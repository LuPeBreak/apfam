"use client";

import { useState } from "react";
import { Event } from "@/types";
import { DataTable } from "@/components/tables/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash2, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EventForm, EventFormData } from "@/components/admin/forms/EventForm";
import { toast } from "sonner";
import { deleteImageFromStorage } from "@/lib/storage-utils";

interface EventsTableProps {
  initialData: Event[];
}

export function EventsTable({ initialData }: EventsTableProps) {
  const [data, setData] = useState<Event[]>(initialData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();

  const handleEdit = (event: Event) => {
    setEditingId(event.id);
    setIsDialogOpen(true);
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    // Delete image from storage if it exists
    const eventToDelete = data.find(e => e.id === deleteId);
    if (eventToDelete?.imageUrl) {
      await deleteImageFromStorage(eventToDelete.imageUrl);
    }

    const { error } = await supabase.from("events").delete().eq("id", deleteId);
    if (error) {
      toast.error("Erro ao excluir evento");
      console.error(error);
    } else {
      setData(data.filter((item) => item.id !== deleteId));
      toast.success("Evento excluído com sucesso");
      router.refresh();
    }
    setDeleteId(null);
  };

  const handleSubmit = async (formData: EventFormData) => {
    try {
      if (editingId) {
        // If updating and image changed, delete old image
        const oldEvent = data.find(e => e.id === editingId);
        if (oldEvent?.imageUrl && formData.imageUrl !== oldEvent.imageUrl) {
          await deleteImageFromStorage(oldEvent.imageUrl);
        }

        // Update event
        const { error } = await supabase
          .from("events")
          .update({
            title: formData.title,
            date: formData.date,
            location: formData.location,
            description: formData.description,
            image_url: formData.imageUrl,
          })
          .eq("id", editingId);
        if (error) throw error;
        setData(data.map((item) => (item.id === editingId ? { ...item, ...formData, imageUrl: formData.imageUrl } : item)));
      } else {
        // Create event
        const { data: newEvent, error } = await supabase
          .from("events")
          .insert([{
            title: formData.title,
            date: formData.date,
            location: formData.location,
            description: formData.description,
            image_url: formData.imageUrl || "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&q=80",
          }])
          .select()
          .single();
        if (error) throw error;
        if (newEvent) {
            setData([...data, {
                id: newEvent.id,
                title: newEvent.title,
                date: newEvent.date,
                location: newEvent.location,
                description: newEvent.description,
                imageUrl: newEvent.image_url
            }]);
        }
      }
      setIsDialogOpen(false);
      setEditingId(null);
      toast.success(editingId ? "Evento atualizado com sucesso" : "Evento criado com sucesso");
      router.refresh();
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Erro ao salvar evento");
    }
  };

  const columns: ColumnDef<Event>[] = [
    {
      accessorKey: "title",
      header: "Título",
    },
    {
      accessorKey: "date",
      header: "Data",
      cell: ({ row }) => {
        return new Date(row.original.date).toLocaleDateString("pt-BR");
      },
    },
    {
      accessorKey: "location",
      header: "Local",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const event = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleEdit(event)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => confirmDelete(event.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingId(null);
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Novo Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Evento" : "Adicionar Evento"}</DialogTitle>
              <DialogDescription>
                Preencha os dados do evento.
              </DialogDescription>
            </DialogHeader>
            <EventForm 
              onSubmit={handleSubmit} 
              initialData={editingId ? data.find(e => e.id === editingId) : undefined}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable columns={columns} data={data} searchPlaceholder="Buscar eventos..." />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o evento
              e removerá seus dados de nossos servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
