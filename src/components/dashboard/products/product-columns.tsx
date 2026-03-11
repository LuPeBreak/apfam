"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth/auth-client";

export type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  featured: boolean;
  categories: { category: { id: string; name: string } }[];
  associates: { associate: { id: string; name: string } }[];
};

interface ProductColumnsProps {
  onEdit: (product: ProductRow) => void;
  onDelete: (product: ProductRow) => void;
}

export function getProductColumns({
  onEdit,
  onDelete,
}: ProductColumnsProps): ColumnDef<ProductRow>[] {
  const cols: ColumnDef<ProductRow>[] = [
    {
      accessorKey: "name",
      header: "Produto",
      cell: ({ row }) => {
        const { name, imageUrl } = row.original;
        return (
          <div className="flex items-center gap-3">
            {imageUrl ? (
              <div className="relative size-10 rounded-md overflow-hidden border">
                <Image
                  src={imageUrl}
                  alt={name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="size-10 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground border">
                Sem img
              </div>
            )}
            <span className="font-medium">{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "categories",
      header: "Categorias",
      cell: ({ row }) => {
        const categories = row.original.categories.map((c) => c.category);
        if (!categories.length)
          return <span className="text-muted-foreground">-</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {categories.slice(0, 2).map((cat) => (
              <Badge
                key={cat.id}
                variant="secondary"
                className="font-normal text-xs"
              >
                {cat.name}
              </Badge>
            ))}
            {categories.length > 2 && (
              <Badge variant="outline" className="font-normal text-xs">
                +{categories.length - 2}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "featured",
      header: "Destaque",
      cell: ({ row }) => {
        return row.original.featured ? (
          <Badge variant="default" className="font-normal text-xs">
            Sim
          </Badge>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        );
      },
    },
  ];

  // Component wrapper to access hooks for actions
  cols.push({
    id: "actions",
    header: "",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { data: session } = authClient.useSession();
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const canUpdate = session?.user.role
        ? authClient.admin.checkRolePermission({
            permissions: { product: ["update"] },
            role: session.user.role as "admin" | "user",
          })
        : false;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const canDelete = session?.user.role
        ? authClient.admin.checkRolePermission({
            permissions: { product: ["delete"] },
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
