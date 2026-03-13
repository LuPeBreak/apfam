"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { EventRowActions } from "./event-row-actions";

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
    cell: ({ row }) => (
      <EventRowActions
        event={row.original}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ),
  });

  return cols;
}
