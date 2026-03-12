"use client";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Menu,
  Package,
  Tag,
  UserCog,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  adminOnly?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Associados", href: "/dashboard/associados", icon: Users },
  { label: "Eventos", href: "/dashboard/eventos", icon: CalendarDays },
  { label: "Produtos", href: "/dashboard/produtos", icon: Package },
  { label: "Categorias", href: "/dashboard/categorias", icon: Tag },
  {
    label: "Usuários",
    href: "/dashboard/usuarios",
    icon: UserCog,
    adminOnly: true,
  },
];

interface SidebarProps {
  isAdmin: boolean;
}

function NavLink({
  item,
  collapsed,
  onClick,
}: {
  item: NavItem;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive =
    item.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(item.href);

  const Icon = item.icon;

  const linkEl = (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        collapsed && "justify-center px-2",
      )}
    >
      <Icon className="size-4 shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    );
  }

  return linkEl;
}

function SidebarContent({
  isAdmin,
  collapsed,
  onLinkClick,
}: {
  isAdmin: boolean;
  collapsed: boolean;
  onLinkClick?: () => void;
}) {
  const visibleItems = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  return (
    <div className="flex h-full flex-col gap-4 py-4">
      {/* Logo */}
      <div
        className={cn(
          "flex items-center px-4",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        {!collapsed && (
          <Image
            src="/apfam-verde.png"
            alt="APFAM"
            width={100}
            height={40}
            className="object-contain"
          />
        )}
      </div>

      <div className="h-px bg-sidebar-border mx-3" />

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-2 flex-1">
        {visibleItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            collapsed={collapsed}
            onClick={onLinkClick}
          />
        ))}
      </nav>
    </div>
  );
}

export function DashboardSidebar({ isAdmin }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex fixed inset-y-0 left-0 z-50 flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <SidebarContent isAdmin={isAdmin} collapsed={collapsed} />

        {/* Toggle button */}
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="absolute -right-3 top-20 flex size-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-muted-foreground shadow-sm hover:text-foreground transition-colors"
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? (
            <ChevronRight className="size-3" />
          ) : (
            <ChevronLeft className="size-3" />
          )}
        </button>
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className="md:hidden fixed top-4 left-4 z-50 flex size-9 items-center justify-center rounded-md border border-border bg-background shadow-sm text-foreground"
            aria-label="Abrir menu"
          >
            <Menu className="size-4" />
          </button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 p-0 bg-sidebar border-sidebar-border"
        >
          <SidebarContent
            isAdmin={isAdmin}
            collapsed={false}
            onLinkClick={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
