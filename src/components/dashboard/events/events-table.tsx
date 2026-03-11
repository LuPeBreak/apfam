"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteEvent } from "@/actions/dashboard/events/delete-event";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { DataTable } from "@/components/dashboard/data-table";
import {
  type EventRow,
  getEventColumns,
} from "@/components/dashboard/events/event-columns";
import { EventDialog } from "@/components/dashboard/events/event-dialog";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";

interface EventsTableProps {
  data: EventRow[];
}

export function EventsTable({ data }: EventsTableProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<EventRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function handleEdit(event: EventRow) {
    setSelected(event);
    setDialogOpen(true);
  }

  function handleDelete(event: EventRow) {
    setSelected(event);
    setConfirmOpen(true);
  }

  function handleCreate() {
    setSelected(null);
    setDialogOpen(true);
  }

  async function handleConfirmDelete() {
    if (!selected) return;
    setIsDeleting(true);
    const result = await deleteEvent(selected.id);
    setIsDeleting(false);
    if (!result || "error" in result) {
      toast.error("Erro ao excluir evento.");
    } else {
      toast.success("Evento excluído!");
      setConfirmOpen(false);
    }
  }

  const { data: session } = authClient.useSession();
  const canCreate = session?.user.role
    ? authClient.admin.checkRolePermission({
        permissions: { event: ["create"] },
        role: session.user.role as "admin" | "user",
      })
    : false;

  const columns = getEventColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Eventos</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Programe e divulgue as feiras e eventos
          </p>
        </div>
        {canCreate && (
          <Button onClick={handleCreate}>
            <Plus className="size-4 mr-2" />
            Novo evento
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={data}
        searchPlaceholder="Buscar eventos..."
        searchColumn="name"
      />

      <EventDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={selected ?? undefined}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Excluir evento"
        description={`Certeza que deseja excluir o evento "${selected?.name}"?`}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
