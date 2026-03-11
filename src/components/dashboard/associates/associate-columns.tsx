"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth/auth-client";
import { getInitials } from "@/lib/utils";

export type AssociateRow = {
  id: string;
  name: string;
  location: string;
  avatarUrl: string | null;
  whatsapp: string | null;
  email: string | null;
  phone: string | null;
  bio: string;
};

interface AssociateColumnsProps {
  onEdit: (associate: AssociateRow) => void;
  onDelete: (associate: AssociateRow) => void;
}

export function getAssociateColumns({
  onEdit,
  onDelete,
}: AssociateColumnsProps): ColumnDef<AssociateRow>[] {
  const cols: ColumnDef<AssociateRow>[] = [
    {
      accessorKey: "name",
      header: "Associado",
      cell: ({ row }) => {
        const { name, avatarUrl } = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-9 border">
              <AvatarImage
                src={avatarUrl || ""}
                alt={name}
                className="object-cover"
              />
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "location",
      header: "Localização",
    },
    {
      accessorKey: "contact",
      header: "Contato",
      cell: ({ row }) => {
        const { whatsapp, phone, email } = row.original;
        return (
          <div className="flex flex-col text-sm text-muted-foreground">
            {whatsapp && <span>W: {whatsapp}</span>}
            {!whatsapp && phone && <span>T: {phone}</span>}
            {email && <span>{email}</span>}
            {!whatsapp && !phone && !email && <span>-</span>}
          </div>
        );
      },
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
            permissions: { associate: ["update"] },
            role: session.user.role as "admin" | "user",
          })
        : false;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const canDelete = session?.user.role
        ? authClient.admin.checkRolePermission({
            permissions: { associate: ["delete"] },
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
