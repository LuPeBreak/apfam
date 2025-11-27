import { MOCK_CATEGORIES } from "@/data/mocks";
import { CategoriesTable } from "@/components/admin/tables/CategoriesTable";

export default function AdminCategoriesPage() {
  const categories = MOCK_CATEGORIES;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Gerenciar Categorias</h1>
      </div>

      <CategoriesTable initialData={categories} />
    </div>
  );
}
