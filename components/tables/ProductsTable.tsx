"use client";

import { useState, useEffect } from "react";
import { Product, Category } from "@/types";
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
import { ProductForm, ProductFormData } from "@/components/admin/forms/ProductForm";
import { toast } from "sonner";

interface ProductsTableProps {
  initialData: Product[];
  categories: Category[];
}

export function ProductsTable({ initialData, categories }: ProductsTableProps) {
  const [data, setData] = useState<Product[]>(initialData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setIsDialogOpen(true);
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    // Cleanup associations first (optional if DB cascades, but safe to do)
    await supabase.from("product_categories").delete().eq("product_id", deleteId);
    await supabase.from("associate_products").delete().eq("product_id", deleteId);

    const { error } = await supabase.from("products").delete().eq("id", deleteId);
    if (error) {
      toast.error("Erro ao excluir produto");
      console.error(error);
    } else {
      setData(data.filter((item) => item.id !== deleteId));
      toast.success("Produto excluído com sucesso");
      router.refresh();
    }
    setDeleteId(null);
  };

  const handleSubmit = async (formData: ProductFormData) => {
    try {
      let productId = editingId;

      if (editingId) {
        // Update product
        const { error } = await supabase
          .from("products")
          .update({
            name: formData.name,
            description: formData.description,
            image_url: formData.imageUrl,
          })
          .eq("id", editingId);
        if (error) throw error;
      } else {
        // Create product
        const { data: newProduct, error } = await supabase
          .from("products")
          .insert([{
            name: formData.name,
            description: formData.description,
            image_url: formData.imageUrl || "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
          }])
          .select()
          .single();
        if (error) throw error;
        productId = newProduct.id;
      }

      if (productId) {
        // Manage categories
        // First delete existing associations if updating
        if (editingId) {
           await supabase.from("product_categories").delete().eq("product_id", productId);
        }

        // Insert new associations
        if (formData.categoryIds && formData.categoryIds.length > 0) {
          const categoryInserts = formData.categoryIds.map(catId => ({
            product_id: productId,
            category_id: catId
          }));
          const { error: catError } = await supabase.from("product_categories").insert(categoryInserts);
          if (catError) throw catError;
        }
      }

      setIsDialogOpen(false);
      setEditingId(null);
      toast.success(editingId ? "Produto atualizado com sucesso" : "Produto criado com sucesso");
      router.refresh();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Erro ao salvar produto");
    }
  };

  const filteredData = selectedCategoryFilter === "all"
    ? data
    : data.filter(product => product.categoryIds?.includes(selectedCategoryFilter));

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
                onClick={() => confirmDelete(product.id)}
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
        searchPlaceholder="Buscar produtos..."
        filterSlot={
          <div className="flex items-center gap-2">
            <div className="w-[250px]">
              <Combobox
                options={categories.map(c => ({ label: c.name, value: c.id }))}
                value={selectedCategoryFilter === "all" ? "" : selectedCategoryFilter}
                onChange={(val) => setSelectedCategoryFilter(val || "all")}
                placeholder="Filtrar por categoria"
                searchPlaceholder="Buscar categoria..."
              />
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

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o produto
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
