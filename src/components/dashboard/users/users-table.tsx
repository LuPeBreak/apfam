"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/dashboard/data-table";
import {
  getUserColumns,
  type UserRow,
} from "@/components/dashboard/users/user-columns";
import { UserDialog } from "@/components/dashboard/users/user-dialog";
import { Button } from "@/components/ui/button";

interface UsersTableProps {
  data: UserRow[];
  currentUserId: string;
}

export function UsersTable({ data, currentUserId }: UsersTableProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedForEdit, setSelectedForEdit] = useState<UserRow | null>(null);

  function handleEditToggle(user: UserRow) {
    setSelectedForEdit(user);
    setEditOpen(true);
  }

  const columns = getUserColumns({
    currentUserId,
    onEdit: handleEditToggle,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Usuários</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Administração de acessos (Admin Only)
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedForEdit(null);
            setCreateOpen(true);
          }}
        >
          <Plus className="size-4 mr-2" />
          Novo usuário
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data}
        searchPlaceholder="Buscar por nome..."
        searchColumn="name"
      />

      <UserDialog open={createOpen} onOpenChange={setCreateOpen} />

      <UserDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setTimeout(() => setSelectedForEdit(null), 200);
        }}
        userToEdit={selectedForEdit}
      />
    </div>
  );
}
