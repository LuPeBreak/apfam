"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteCategory } from "@/actions/dashboard/categories/delete-category";
import {
  type CategoryRow,
  getCategoryColumns,
} from "@/components/dashboard/categories/category-columns";
import { CategoryDialog } from "@/components/dashboard/categories/category-dialog";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";

interface CategoriesTableProps {
  data: CategoryRow[];
}

export function CategoriesTable({ data }: CategoriesTableProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<CategoryRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function handleEdit(category: CategoryRow) {
    setSelected(category);
    setDialogOpen(true);
  }

  function handleDelete(category: CategoryRow) {
    setSelected(category);
    setConfirmOpen(true);
  }

  function handleCreate() {
    setSelected(null);
    setDialogOpen(true);
  }

  async function handleConfirmDelete() {
    if (!selected) return;
    setIsDeleting(true);
    const result = await deleteCategory(selected.id);
    setIsDeleting(false);
    if (!result || "error" in result) {
      toast.error("Erro ao excluir categoria.");
    } else {
      toast.success("Categoria excluída!");
      setConfirmOpen(false);
    }
  }

  const { data: session } = authClient.useSession();
  const canCreate = session?.user.role
    ? authClient.admin.checkRolePermission({
        permissions: { category: ["create"] },
        role: session.user.role as "admin" | "user",
      })
    : false;

  const columns = getCategoryColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Categorias</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie as categorias dos produtos
          </p>
        </div>
        {canCreate && (
          <Button onClick={handleCreate}>
            <Plus className="size-4 mr-2" />
            Nova categoria
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={data}
        searchPlaceholder="Buscar categorias..."
        searchColumn="name"
      />

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={selected ?? undefined}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Excluir categoria"
        description={`Tem certeza que deseja excluir "${selected?.name}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
