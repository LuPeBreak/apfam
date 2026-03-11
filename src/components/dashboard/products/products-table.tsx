"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteProduct } from "@/actions/dashboard/products/delete-product";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { DataTable } from "@/components/dashboard/data-table";
import {
  getProductColumns,
  type ProductRow,
} from "@/components/dashboard/products/product-columns";
import { ProductDialog } from "@/components/dashboard/products/product-dialog";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import type { AssociateRow } from "../associates/associate-columns";

type GeneratedCategory = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

interface ProductsTableProps {
  data: ProductRow[];
  categories: GeneratedCategory[];
  associates: AssociateRow[];
}

export function ProductsTable({
  data,
  categories,
  associates,
}: ProductsTableProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<ProductRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function handleEdit(product: ProductRow) {
    setSelected(product);
    setDialogOpen(true);
  }

  function handleDelete(product: ProductRow) {
    setSelected(product);
    setConfirmOpen(true);
  }

  function handleCreate() {
    setSelected(null);
    setDialogOpen(true);
  }

  async function handleConfirmDelete() {
    if (!selected) return;
    setIsDeleting(true);
    const result = await deleteProduct(selected.id);
    setIsDeleting(false);
    if (!result || "error" in result) {
      toast.error("Erro ao excluir produto.");
    } else {
      toast.success("Produto excluído com sucesso!");
      setConfirmOpen(false);
    }
  }

  const { data: session } = authClient.useSession();
  const canCreate = session?.user.role
    ? authClient.admin.checkRolePermission({
        permissions: { product: ["create"] },
        role: session.user.role as "admin" | "user",
      })
    : false;

  const columns = getProductColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Produtos</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie o catálogo de produtos disponíveis
          </p>
        </div>
        {canCreate && (
          <Button onClick={handleCreate}>
            <Plus className="size-4 mr-2" />
            Novo produto
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={data}
        searchPlaceholder="Buscar produtos..."
        searchColumn="name"
      />

      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={selected ?? undefined}
        categories={categories}
        associates={associates}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Excluir produto"
        description={`Certeza que deseja excluir o produto "${selected?.name}"? Isso removerá as informações do banco de dados.`}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
