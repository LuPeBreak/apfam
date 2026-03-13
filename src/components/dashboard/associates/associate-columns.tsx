"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { AssociateRowActions } from "./associate-row-actions";

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
    cell: ({ row }) => (
      <AssociateRowActions
        associate={row.original}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ),
  });

  return cols;
}
