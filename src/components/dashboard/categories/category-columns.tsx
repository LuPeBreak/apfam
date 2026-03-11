"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth/auth-client";

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
};

interface CategoryColumnsProps {
  onEdit: (category: CategoryRow) => void;
  onDelete: (category: CategoryRow) => void;
}

export function getCategoryColumns({
  onEdit,
  onDelete,
}: CategoryColumnsProps): ColumnDef<CategoryRow>[] {
  const cols: ColumnDef<CategoryRow>[] = [
    {
      accessorKey: "name",
      header: "Nome",
    },
    {
      accessorKey: "slug",
      header: "Slug",
      cell: ({ row }) => (
        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
          {row.original.slug}
        </code>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Criado em",
      cell: ({ row }) =>
        format(new Date(row.original.createdAt), "dd/MM/yyyy", {
          locale: ptBR,
        }),
    },
  ];

  cols.push({
    id: "actions",
    header: "",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { data: session } = authClient.useSession();
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const canUpdate = session?.user.role
        ? authClient.admin.checkRolePermission({
            permissions: { category: ["update"] },
            role: session.user.role as "admin" | "user",
          })
        : false;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const canDelete = session?.user.role
        ? authClient.admin.checkRolePermission({
            permissions: { category: ["delete"] },
            role: session.user.role as "admin" | "user",
          })
        : false;

      if (!canUpdate && !canDelete) return null;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Ações</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {canUpdate && (
              <DropdownMenuItem onClick={() => onEdit(row.original)}>
                <Pencil className="size-4 mr-2" />
                Editar
              </DropdownMenuItem>
            )}
            {canDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(row.original)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="size-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  });

  return cols;
}
