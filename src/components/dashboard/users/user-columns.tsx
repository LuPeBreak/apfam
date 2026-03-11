"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Key, MoreHorizontal, ShieldAlert, ShieldOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  onBanToggle: (user: UserRow) => void;
  onChangePassword: (user: UserRow) => void;
}

export function getUserColumns({
  currentUserId,
  onBanToggle,
  onChangePassword,
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
      cell: ({ row }) => {
        const user = row.original;
        const isSelf = user.id === currentUserId;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Ações</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onChangePassword(user)}>
                <Key className="size-4 mr-2" />
                Alterar Senha
              </DropdownMenuItem>
              {!isSelf && (
                <DropdownMenuItem
                  onClick={() => onBanToggle(user)}
                  className={
                    user.banned
                      ? "text-green-600 focus:text-green-600"
                      : "text-destructive focus:text-destructive"
                  }
                >
                  {user.banned ? (
                    <>
                      <ShieldAlert className="size-4 mr-2" />
                      Desbanir
                    </>
                  ) : (
                    <>
                      <ShieldOff className="size-4 mr-2" />
                      Banir
                    </>
                  )}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
