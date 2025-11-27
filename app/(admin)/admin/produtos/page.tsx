import { MOCK_CATALOG, MOCK_CATEGORIES } from "@/data/mocks";
import { ProductsTable } from "@/components/admin/tables/ProductsTable";

export default function AdminProductsPage() {
  const products = MOCK_CATALOG;
  const categories = MOCK_CATEGORIES;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Gerenciar Produtos</h1>
      </div>

      <ProductsTable initialData={products} categories={categories} />
    </div>
  );
}
