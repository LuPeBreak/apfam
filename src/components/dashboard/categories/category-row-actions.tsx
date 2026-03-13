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
import type { CategoryRow } from "./category-columns";

interface CategoryRowActionsProps {
  category: CategoryRow;
  onEdit: (category: CategoryRow) => void;
  onDelete: (category: CategoryRow) => void;
}

export function CategoryRowActions({
  category,
  onEdit,
  onDelete,
}: CategoryRowActionsProps) {
  const { data: session } = authClient.useSession();

  if (!session?.user.role) return <RowActionsButton disabled />;

  const canUpdate = authClient.admin.checkRolePermission({
    permissions: { category: ["update"] },
    role: session.user.role as "admin" | "user",
  });

  const canDelete = authClient.admin.checkRolePermission({
    permissions: { category: ["delete"] },
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
          <DropdownMenuItem onClick={() => onEdit(category)}>
            <Pencil className="size-4 mr-2" />
            Editar
          </DropdownMenuItem>
        )}
        {canDelete && (
          <DropdownMenuItem
            onClick={() => onDelete(category)}
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
