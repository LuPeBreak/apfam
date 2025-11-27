"use client";

import { useState } from "react";
import { Event } from "@/types";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash2, MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EventForm } from "@/components/admin/forms/EventForm";

interface EventsTableProps {
  initialData: Event[];
}

export function EventsTable({ initialData }: EventsTableProps) {
  const [data, setData] = useState<Event[]>(initialData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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
                onClick={() => handleDelete(event.id)}
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

  const handleEdit = (event: Event) => {
    setEditingId(event.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este evento?")) {
      setData(data.filter((item) => item.id !== id));
    }
  };

  const handleSubmit = (formData: any) => {
    if (editingId) {
      setData(data.map(item => item.id === editingId ? {
        ...item,
        ...formData,
        id: editingId
      } : item));
    } else {
      const newEvent: Event = {
        id: Date.now().toString(),
        ...formData,
        imageUrl: "https://images.unsplash.com/photo-1506617420156-8e4536971650?w=800&q=80",
      };
      setData([...data, newEvent]);
    }
    setIsDialogOpen(false);
    setEditingId(null);
  };

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
    </div>
  );
}
