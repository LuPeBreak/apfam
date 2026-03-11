"use client";

import type { UserWithRole } from "better-auth/plugins/admin";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth/auth-client";
import { getInitials } from "@/lib/utils";

const BREADCRUMB_MAP: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/associados": "Associados",
  "/dashboard/eventos": "Eventos",
  "/dashboard/produtos": "Produtos",
  "/dashboard/categorias": "Categorias",
  "/dashboard/publicacoes": "Publicações",
  "/dashboard/usuarios": "Usuários",
  "/dashboard/perfil": "Perfil",
};

interface DashboardHeaderProps {
  user: UserWithRole;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const pageTitle = BREADCRUMB_MAP[pathname] ?? "Dashboard";

  async function handleLogout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push("/login"),
      },
    });
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-4 md:px-8">
      {/* Título da página / breadcrumb */}
      <div className="flex items-center gap-2 pl-12 md:pl-0">
        <h1 className="text-base font-semibold text-foreground">{pageTitle}</h1>
      </div>

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted transition-colors outline-none"
            aria-label="Menu do usuário"
          >
            <Avatar className="size-7">
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:block text-sm font-medium text-foreground max-w-[120px] truncate">
              {user.name}
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-0.5">
              <span className="font-medium truncate">{user.name}</span>
              <span className="text-xs text-muted-foreground truncate">
                {user.email}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard/perfil" className="cursor-pointer">
              <User className="size-4 mr-2" />
              Meu Perfil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-destructive focus:text-destructive cursor-pointer"
          >
            <LogOut className="size-4 mr-2" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
