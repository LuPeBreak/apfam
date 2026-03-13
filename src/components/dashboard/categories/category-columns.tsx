"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CategoryRowActions } from "./category-row-actions";

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
    cell: ({ row }) => (
      <CategoryRowActions
        category={row.original}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ),
  });

  return cols;
}
