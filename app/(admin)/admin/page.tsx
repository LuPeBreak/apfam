import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const { count: associatesCount } = await supabase.from('associates').select('*', { count: 'exact', head: true });
  const { count: eventsCount } = await supabase.from('events').select('*', { count: 'exact', head: true });
  const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
  const { count: categoriesCount } = await supabase.from('categories').select('*', { count: 'exact', head: true });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Bem-vindo, Admin
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Associados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{associatesCount || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Eventos Programados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{eventsCount || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Produtos no Catálogo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{productsCount || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Categorias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{categoriesCount || 0}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
