"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { authClient } from "@/lib/auth/auth-client";

export type EventRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  date: Date;
  location: string;
  imageUrl: string | null;
};

interface EventColumnsProps {
  onEdit: (event: EventRow) => void;
  onDelete: (event: EventRow) => void;
}

export function getEventColumns({
  onEdit,
  onDelete,
}: EventColumnsProps): ColumnDef<EventRow>[] {
  const cols: ColumnDef<EventRow>[] = [
    {
      accessorKey: "name",
      header: "Evento",
      cell: ({ row }) => {
        const { name, imageUrl } = row.original;
        return (
          <div className="flex items-center gap-3">
            {imageUrl ? (
              <div className="relative size-12 rounded-md overflow-hidden border">
                <Image
                  src={imageUrl}
                  alt={name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="relative size-12 rounded-md bg-muted flex items-center justify-center overflow-hidden border">
                <ImagePlaceholder
                  name={name}
                  className="absolute inset-0"
                  textClassName="text-base"
                />
              </div>
            )}
            <span className="font-medium text-sm line-clamp-2">{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Data e Hora",
      cell: ({ row }) => {
        return (
          <span className="text-sm">
            {format(new Date(row.original.date), "dd/MM/yyyy 'às' HH:mm", {
              locale: ptBR,
            })}
          </span>
        );
      },
    },
    {
      accessorKey: "location",
      header: "Local",
      cell: ({ row }) => (
        <span className="text-sm">{row.original.location}</span>
      ),
    },
  ];

  // Action Column with embedded Session checks
  cols.push({
    id: "actions",
    header: "",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { data: session } = authClient.useSession();
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const canUpdate = session?.user.role
        ? authClient.admin.checkRolePermission({
            permissions: { event: ["update"] },
            role: session.user.role as "admin" | "user",
          })
        : false;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const canDelete = session?.user.role
        ? authClient.admin.checkRolePermission({
            permissions: { event: ["delete"] },
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
