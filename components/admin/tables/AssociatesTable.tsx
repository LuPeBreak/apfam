"use client";

import { useState } from "react";
import { Associate, Product } from "@/types";
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
import { AssociateForm, AssociateFormData } from "@/components/admin/forms/AssociateForm";

interface AssociatesTableProps {
  initialData: Associate[];
  catalog: Product[];
}

export function AssociatesTable({ initialData, catalog }: AssociatesTableProps) {
  const [data, setData] = useState<Associate[]>(initialData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedProductFilter, setSelectedProductFilter] = useState<string>("all");

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
                onClick={() => handleDelete(associate.id)}
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

  const handleEdit = (associate: Associate) => {
    setEditingId(associate.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este associado?")) {
      setData(data.filter((item) => item.id !== id));
    }
  };



  const handleSubmit = (formData: AssociateFormData) => {
    const selectedProducts = catalog.filter(p => formData.products.includes(p.id));
    
    if (editingId) {
      setData(data.map(item => item.id === editingId ? {
        ...item,
        ...formData,
        products: selectedProducts,
        id: editingId // Keep original ID
      } : item));
    } else {
      const newAssociate: Associate = {
        id: Date.now().toString(),
        name: formData.name,
        bio: formData.bio,
        location: formData.location,
        products: selectedProducts,
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + Date.now(),
      };
      setData([...data, newAssociate]);
    }
    setIsDialogOpen(false);
    setEditingId(null);
  };

  const filteredData = data.filter((associate) => {
    if (selectedProductFilter === "all") return true;
    return associate.products.some((p) => p.id === selectedProductFilter);
  });

  return (
    <div className="space-y-4">
      <DataTable 
        columns={columns} 
        data={filteredData} 
        searchPlaceholder="Buscar associados..."
        filterSlot={
          <div className="flex items-center gap-2">
            <div className="w-[200px]">
              <Select
                value={selectedProductFilter}
                onValueChange={setSelectedProductFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por produto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os produtos</SelectItem>
                  {catalog.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
    </div>
  );
}
