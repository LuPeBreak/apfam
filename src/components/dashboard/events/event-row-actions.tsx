"use client";

import { Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth/auth-client";
import { RowActionsButton } from "../row-actions-button";
import type { EventRow } from "./event-columns";

interface EventRowActionsProps {
  event: EventRow;
  onEdit: (event: EventRow) => void;
  onDelete: (event: EventRow) => void;
}

export function EventRowActions({
  event,
  onEdit,
  onDelete,
}: EventRowActionsProps) {
  const { data: session } = authClient.useSession();

  if (!session?.user.role) return <RowActionsButton disabled />;

  const canUpdate = authClient.admin.checkRolePermission({
    permissions: { event: ["update"] },
    role: session.user.role as "admin" | "user",
  });

  const canDelete = authClient.admin.checkRolePermission({
    permissions: { event: ["delete"] },
    role: session.user.role as "admin" | "user",
  });

  if (!canUpdate && !canDelete) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <RowActionsButton />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {canUpdate && (
          <DropdownMenuItem onClick={() => onEdit(event)}>
            <Pencil className="size-4 mr-2" />
            Editar
          </DropdownMenuItem>
        )}
        {canDelete && (
          <DropdownMenuItem
            onClick={() => onDelete(event)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="size-4 mr-2" />
            Excluir
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
