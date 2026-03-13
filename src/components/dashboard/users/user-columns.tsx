"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { UserRowActions } from "./user-row-actions";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string | null;
  banned: boolean | null;
  createdAt: Date;
};

interface UserColumnsProps {
  currentUserId: string;
  onEdit: (user: UserRow) => void;
}

export function getUserColumns({
  currentUserId,
  onEdit,
}: UserColumnsProps): ColumnDef<UserRow>[] {
  return [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Nível",
      cell: ({ row }) => (
        <Badge
          variant={row.original.role === "admin" ? "default" : "secondary"}
        >
          {row.original.role === "admin" ? "Admin" : "Usuário"}
        </Badge>
      ),
    },
    {
      accessorKey: "banned",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.banned ? "destructive" : "outline"}>
          {row.original.banned ? "Banido" : "Ativo"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Data de Criação",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(row.original.createdAt), "dd/MM/yyyy", {
            locale: ptBR,
          })}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <UserRowActions
          user={row.original}
          currentUserId={currentUserId}
          onEdit={onEdit}
        />
      ),
    },
  ];
}
