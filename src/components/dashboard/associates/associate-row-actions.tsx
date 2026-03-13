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
import type { AssociateRow } from "./associate-columns";

interface AssociateRowActionsProps {
  associate: AssociateRow;
  onEdit: (associate: AssociateRow) => void;
  onDelete: (associate: AssociateRow) => void;
}

export function AssociateRowActions({
  associate,
  onEdit,
  onDelete,
}: AssociateRowActionsProps) {
  const { data: session } = authClient.useSession();

  if (!session?.user.role) return <RowActionsButton disabled />;

  const canUpdate = authClient.admin.checkRolePermission({
    permissions: { associate: ["update"] },
    role: session.user.role as "admin" | "user",
  });

  const canDelete = authClient.admin.checkRolePermission({
    permissions: { associate: ["delete"] },
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
          <DropdownMenuItem onClick={() => onEdit(associate)}>
            <Pencil className="size-4 mr-2" />
            Editar
          </DropdownMenuItem>
        )}
        {canDelete && (
          <DropdownMenuItem
            onClick={() => onDelete(associate)}
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
