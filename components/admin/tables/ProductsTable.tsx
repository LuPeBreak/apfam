"use client";

import { useState } from "react";
import { Product, Category } from "@/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductForm, ProductFormData } from "@/components/admin/forms/ProductForm";

interface ProductsTableProps {
  initialData: Product[];
  categories: Category[];
}

export function ProductsTable({ initialData, categories }: ProductsTableProps) {
  const [data, setData] = useState<Product[]>(initialData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Nome",
    },
    {
      accessorKey: "categoryNames",
      header: "Categorias",
      cell: ({ row }) => {
        const names = row.original.categoryNames || [];
        return (
          <div className="flex flex-wrap gap-1">
            {names.map((name, i) => (
              <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {name}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Descrição",
      cell: ({ row }) => <div className="max-w-[300px] truncate">{row.getValue("description")}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;
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
              <DropdownMenuItem onClick={() => handleEdit(product)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDelete(product.id)}
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

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      setData(data.filter((item) => item.id !== id));
    }
  };



  const handleSubmit = (formData: ProductFormData) => {
    const selectedCategoryNames = categories
      .filter(c => formData.categoryIds.includes(c.id))
      .map(c => c.name);

    if (editingId) {
      setData(data.map(item => item.id === editingId ? {
        ...item,
        ...formData,
        categoryNames: selectedCategoryNames,
        id: editingId
      } : item));
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name,
        categoryIds: formData.categoryIds,
        categoryNames: selectedCategoryNames,
        description: formData.description,
        imageUrl: "https://images.unsplash.com/photo-1506617420156-8e4536971650?w=800&q=80",
      };
      setData([...data, newProduct]);
    }
    setIsDialogOpen(false);
    setEditingId(null);
  };

  const filteredData = data.filter((product) => {
    if (selectedCategoryFilter === "all") return true;
    return product.categoryIds.includes(selectedCategoryFilter);
  });

  return (
    <div className="space-y-4">
      <DataTable 
        columns={columns} 
        data={filteredData} 
        searchPlaceholder="Buscar produtos..."
        filterSlot={
          <div className="flex items-center gap-2">
            <div className="w-[200px]">
              <Select
                value={selectedCategoryFilter}
                onValueChange={setSelectedCategoryFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedCategoryFilter !== "all" && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSelectedCategoryFilter("all")}
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
                <Plus className="h-4 w-4 mr-2" /> Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Produto" : "Adicionar Produto"}</DialogTitle>
                <DialogDescription>
                  Cadastre um novo produto no catálogo.
                </DialogDescription>
              </DialogHeader>
              <ProductForm 
                onSubmit={handleSubmit} 
                categories={categories}
                initialData={editingId ? data.find(p => p.id === editingId) : undefined}
              />
            </DialogContent>
          </Dialog>
        }
      />
    </div>
  );
}
