"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteAssociate } from "@/actions/dashboard/associates/delete-associate";
import {
  type AssociateRow,
  getAssociateColumns,
} from "@/components/dashboard/associates/associate-columns";
import { AssociateDialog } from "@/components/dashboard/associates/associate-dialog";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";

interface AssociatesTableProps {
  data: AssociateRow[];
}

export function AssociatesTable({ data }: AssociatesTableProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<AssociateRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function handleEdit(associate: AssociateRow) {
    setSelected(associate);
    setDialogOpen(true);
  }

  function handleDelete(associate: AssociateRow) {
    setSelected(associate);
    setConfirmOpen(true);
  }

  function handleCreate() {
    setSelected(null);
    setDialogOpen(true);
  }

  async function handleConfirmDelete() {
    if (!selected) return;
    setIsDeleting(true);
    const result = await deleteAssociate(selected.id);
    setIsDeleting(false);
    if (!result || "error" in result) {
      toast.error("Erro ao excluir associado.");
    } else {
      toast.success("Associado excluído!");
      setConfirmOpen(false);
    }
  }

  const { data: session } = authClient.useSession();
  const canCreate = session?.user.role
    ? authClient.admin.checkRolePermission({
        permissions: { associate: ["create"] },
        role: session.user.role as "admin" | "user",
      })
    : false;

  const columns = getAssociateColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Associados</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie os produtores e parceiros da plataforma
          </p>
        </div>
        {canCreate && (
          <Button onClick={handleCreate}>
            <Plus className="size-4 mr-2" />
            Novo associado
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={data}
        searchPlaceholder="Buscar associados..."
        searchColumn="name"
      />

      <AssociateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={selected ?? undefined}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Excluir associado"
        description={`Tem certeza que deseja excluir "${selected?.name}"? Esta ação não pode ser desfeita e removerá os dados permanentemente.`}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
