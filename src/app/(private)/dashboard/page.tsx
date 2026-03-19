import type { LucideIcon } from "lucide-react";
import { CalendarDays, Package, Tag, Users } from "lucide-react";
import { getDashboardStats } from "@/actions/dashboard/get-stats";

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-lg border bg-card p-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="text-4xl font-bold text-foreground">{value}</div>
    </div>
  );
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  if ("error" in stats) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-3xl font-bold text-primary">Visão Geral</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Resumo do conteúdo cadastrado na plataforma
          </p>
        </div>
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
          {stats.error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-bold text-primary">Visão Geral</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Resumo do conteúdo cadastrado na plataforma
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Produtos" value={stats.products} icon={Package} />
        <StatCard label="Eventos" value={stats.events} icon={CalendarDays} />
        <StatCard label="Associados" value={stats.associates} icon={Users} />
        <StatCard label="Categorias" value={stats.categories} icon={Tag} />
      </div>
    </div>
  );
}
