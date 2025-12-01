"use client";

import { useState, useEffect } from "react";
import { Associate, Product } from "@/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/combobox";
import { AssociateForm, AssociateFormData } from "@/components/admin/forms/AssociateForm";
import { toast } from "sonner";

interface AssociatesTableProps {
  initialData: Associate[];
  catalog: Product[];
}

export function AssociatesTable({ initialData, catalog }: AssociatesTableProps) {
  const [data, setData] = useState<Associate[]>(initialData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedProductFilter, setSelectedProductFilter] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleEdit = (associate: Associate) => {
    setEditingId(associate.id);
    setIsDialogOpen(true);
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    // Clean up associations first (optional if DB cascades, but safe to do)
    await supabase.from("associate_products").delete().eq("associate_id", deleteId);

    const { error } = await supabase.from("associates").delete().eq("id", deleteId);
    if (error) {
      toast.error("Erro ao excluir associado");
      console.error(error);
    } else {
      setData(data.filter((item) => item.id !== deleteId));
      toast.success("Associado excluído com sucesso");
      router.refresh();
    }
    setDeleteId(null);
  };

  const handleSubmit = async (formData: AssociateFormData) => {
    try {
      let associateId = editingId;

      if (editingId) {
        // Update associate
        const { error } = await supabase
          .from("associates")
          .update({
            name: formData.name,
            bio: formData.bio,
            location: formData.location,
            avatar_url: formData.avatarUrl,
          })
          .eq("id", editingId);
        if (error) throw error;
      } else {
        // Create associate
        const { data: newAssociate, error } = await supabase
          .from("associates")
          .insert([{
            name: formData.name,
            bio: formData.bio,
            location: formData.location,
            avatar_url: formData.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
          }])
          .select()
          .single();
        if (error) throw error;
        associateId = newAssociate.id;
      }

      if (associateId) {
        // Manage products
        // First delete existing associations if updating
        if (editingId) {
           await supabase.from("associate_products").delete().eq("associate_id", associateId);
        }

        // Insert new associations
        if (formData.productIds && formData.productIds.length > 0) {
          const productInserts = formData.productIds.map(prodId => ({
            associate_id: associateId,
            product_id: prodId
          }));
          const { error: prodError } = await supabase.from("associate_products").insert(productInserts);
          if (prodError) throw prodError;
        }
      }

      setIsDialogOpen(false);
      setEditingId(null);
      toast.success(editingId ? "Associado atualizado com sucesso" : "Associado criado com sucesso");
      router.refresh();
    } catch (error) {
      console.error("Error saving associate:", error);
      toast.error("Erro ao salvar associado");
    }
  };

  const filteredData = selectedProductFilter === "all"
    ? data
    : data.filter(associate => associate.products.some(p => p.id === selectedProductFilter));

  const columns: ColumnDef<Associate>[] = [
    {
      accessorKey: "name",
      header: "Nome",
    },
    {
      accessorKey: "location",
      header: "Localização",
    },
    {
      accessorKey: "products",
      header: "Produtos",
      cell: ({ row }) => {
        const products = row.original.products;
        return (
          <div className="flex flex-wrap gap-1">
            {products.map((p) => (
              <span key={p.id} className="text-xs bg-muted px-1.5 py-0.5 rounded-full">
                {p.name}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const associate = row.original;
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
              <DropdownMenuItem onClick={() => handleEdit(associate)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => confirmDelete(associate.id)}
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
      <DataTable 
        columns={columns} 
        data={filteredData} 
        searchPlaceholder="Buscar associados..."
        filterSlot={
          <div className="flex items-center gap-2">
            <div className="w-[250px]">
              <Combobox
                options={catalog.map(p => ({ label: p.name, value: p.id }))}
                value={selectedProductFilter === "all" ? "" : selectedProductFilter}
                onChange={(val) => setSelectedProductFilter(val || "all")}
                placeholder="Filtrar por produto"
                searchPlaceholder="Buscar produto..."
              />
            </div>
            {selectedProductFilter !== "all" && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSelectedProductFilter("all")}
                title="Limpar filtro"
              >
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
          </div>
        }
        actionSlot={
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setEditingId(null);
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Novo Associado
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Associado" : "Adicionar Associado"}</DialogTitle>
                <DialogDescription>
                  Preencha os dados e selecione os produtos.
                </DialogDescription>
              </DialogHeader>
              <AssociateForm 
                onSubmit={handleSubmit} 
                catalog={catalog} 
                initialData={editingId ? data.find(a => a.id === editingId) : undefined}
              />
            </DialogContent>
          </Dialog>
        }
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o associado
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
