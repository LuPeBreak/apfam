"use client";

import { useState } from "react";
import { Category } from "@/types";
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
import { CategoryForm } from "@/components/admin/forms/CategoryForm";

interface CategoriesTableProps {
  initialData: Category[];
}

export function CategoriesTable({ initialData }: CategoriesTableProps) {
  const [data, setData] = useState<Category[]>(initialData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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
                onClick={() => handleDelete(category.id)}
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

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta categoria?")) {
      setData(data.filter((item) => item.id !== id));
    }
  };

  const handleSubmit = (formData: any) => {
    if (editingId) {
      setData(data.map(item => item.id === editingId ? { ...item, ...formData } : item));
    } else {
      const newCategory: Category = {
        id: "c" + Date.now().toString(),
        name: formData.name,
      };
      setData([...data, newCategory]);
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
              <Plus className="h-4 w-4 mr-2" /> Nova Categoria
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
    </div>
  );
}
