import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_ASSOCIATES, MOCK_EVENTS, MOCK_CATALOG, MOCK_CATEGORIES } from "@/data/mocks";

export default function AdminDashboardPage() {
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
            <div className="text-4xl font-bold">{MOCK_ASSOCIATES.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Eventos Programados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{MOCK_EVENTS.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Produtos no Catálogo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{MOCK_CATALOG.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Categorias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{MOCK_CATEGORIES.length}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
