"use client";

import { useState } from "react";
import { Category } from "@/types";
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
import { CategoryForm } from "@/components/admin/forms/CategoryForm";
import { toast } from "sonner";

interface CategoriesTableProps {
  initialData: Category[];
}

export function CategoriesTable({ initialData }: CategoriesTableProps) {
  const [data, setData] = useState<Category[]>(initialData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setIsDialogOpen(true);
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    // Check for associated products
    const { count, error: checkError } = await supabase
      .from("product_categories")
      .select("*", { count: 'exact', head: true })
      .eq("category_id", deleteId);

    if (checkError) {
      toast.error("Erro ao verificar produtos associados");
      console.error(checkError);
      return;
    }

    if (count && count > 0) {
      toast.error(`Não é possível excluir. Existem ${count} produtos associados a esta categoria.`);
      setDeleteId(null);
      return;
    }

    const { error } = await supabase.from("categories").delete().eq("id", deleteId);
    if (error) {
      toast.error("Erro ao excluir categoria");
      console.error(error);
    } else {
      setData(data.filter((item) => item.id !== deleteId));
      toast.success("Categoria excluída com sucesso");
      router.refresh();
    }
    setDeleteId(null);
  };

  const handleSubmit = async (formData: { name: string }) => {
    try {
      if (editingId) {
        const { error } = await supabase
          .from("categories")
          .update({ name: formData.name })
          .eq("id", editingId);
        if (error) throw error;
        setData(data.map((item) => (item.id === editingId ? { ...item, ...formData } : item)));
      } else {
        const { data: newCategory, error } = await supabase
          .from("categories")
          .insert([{ name: formData.name }])
          .select()
          .single();
        if (error) throw error;
        if (newCategory) setData([...data, newCategory]);
      }
      setIsDialogOpen(false);
      setEditingId(null);
      toast.success(editingId ? "Categoria atualizada com sucesso" : "Categoria criada com sucesso");
      router.refresh();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Erro ao salvar categoria");
    }
  };

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: "Nome",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const category = row.original;
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
              <DropdownMenuItem onClick={() => handleEdit(category)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => confirmDelete(category.id)}
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
              <Plus className="h-4 w-4 mr-2" /> Novo Categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Categoria" : "Adicionar Categoria"}</DialogTitle>
              <DialogDescription>
                Adicione ou edite uma categoria de produtos.
              </DialogDescription>
            </DialogHeader>
            <CategoryForm 
              onSubmit={handleSubmit} 
              initialData={editingId ? data.find(c => c.id === editingId) : undefined}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable columns={columns} data={data} searchPlaceholder="Buscar categorias..." />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a categoria
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
