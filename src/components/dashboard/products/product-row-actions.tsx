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
import type { ProductRow } from "./product-columns";

interface ProductRowActionsProps {
  product: ProductRow;
  onEdit: (product: ProductRow) => void;
  onDelete: (product: ProductRow) => void;
}

export function ProductRowActions({
  product,
  onEdit,
  onDelete,
}: ProductRowActionsProps) {
  const { data: session } = authClient.useSession();

  if (!session?.user.role) return <RowActionsButton disabled />;

  const canUpdate = authClient.admin.checkRolePermission({
    permissions: { product: ["update"] },
    role: session.user.role as "admin" | "user",
  });

  const canDelete = authClient.admin.checkRolePermission({
    permissions: { product: ["delete"] },
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
          <DropdownMenuItem onClick={() => onEdit(product)}>
            <Pencil className="size-4 mr-2" />
            Editar
          </DropdownMenuItem>
        )}
        {canDelete && (
          <DropdownMenuItem
            onClick={() => onDelete(product)}
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
