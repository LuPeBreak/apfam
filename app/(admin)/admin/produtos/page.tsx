import { ProductsTable } from "@/components/tables/ProductsTable";
import { supabase } from "@/lib/supabase";
import { Product, Category } from "@/types";

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  // Fetch products with their categories
  const { data: productsData, error: productsError } = await supabase
    .from('products')
    .select(`
      *,
      product_categories (
        category_id,
        categories (
          name
        )
      )
    `)
    .order('created_at', { ascending: false });

  // Fetch all categories for the filter/form
  const { data: categoriesData, error: categoriesError } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (productsError || categoriesError) {
    console.error("Error fetching data:", productsError || categoriesError);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formattedProducts: Product[] = (productsData || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    description: p.description || "",
    imageUrl: p.image_url,
    categoryIds: p.product_categories.map((pc: any) => pc.category_id),
    categoryNames: p.product_categories.map((pc: any) => pc.categories.name),
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categories: Category[] = (categoriesData || []).map((c: any) => ({
    id: c.id,
    name: c.name,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
      </div>
      
      <ProductsTable initialData={formattedProducts} categories={categories} />
    </div>
  );
}
