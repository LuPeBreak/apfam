"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ShoppingBag,
  Tags,
  Home,
  LogOut,
  Sprout
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Associados",
    href: "/admin/associados",
    icon: Users,
  },
  {
    title: "Eventos",
    href: "/admin/eventos",
    icon: CalendarDays,
  },
  {
    title: "Produtos",
    href: "/admin/produtos",
    icon: ShoppingBag,
  },
  {
    title: "Categorias",
    href: "/admin/categorias",
    icon: Tags,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full border-r bg-muted/10">
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Sprout className="h-6 w-6" />
          <span>APFAM Admin</span>
        </Link>
      </div>
      <div className="flex-1 py-6 px-4 space-y-2">
        {sidebarItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-2",
              pathname === item.href && "bg-secondary"
            )}
            asChild
          >
            <Link href={item.href}>
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          </Button>
        ))}
      </div>
      <div className="p-4 border-t bg-muted/20">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
            AD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Admin User</span>
            <span className="text-xs text-muted-foreground">admin@apfam.com</span>
          </div>
        </div>
        <Button variant="outline" className="w-full gap-2 text-muted-foreground hover:text-foreground" asChild>
          <Link href="/">
            <LogOut className="h-4 w-4" />
            Sair
          </Link>
        </Button>
      </div>
    </div>
  );
}
