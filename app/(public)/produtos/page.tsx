import { supabase } from "@/lib/supabase";
import { Product, Category } from "@/types";
import ProductsClientPage from "./ProductsClientPage";

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  // Fetch products with their categories and associate info
  const { data: productsData } = await supabase
    .from('products')
    .select(`
      *,
      product_categories (
        category_id,
        categories (
          name
        )
      ),
      associate_products (
        associate_id,
        associates (
          name
        )
      )
    `)
    .order('created_at', { ascending: false });

  // Fetch categories for filter
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formattedProducts: Product[] = (productsData || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    description: p.description || "",
    imageUrl: p.image_url,
    categoryIds: p.product_categories.map((pc: any) => pc.category_id),
    categoryNames: p.product_categories.map((pc: any) => pc.categories.name),
    associateName: p.associate_products?.[0]?.associates?.name || "APFAM",
    associateCount: p.associate_products?.length || 0
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categories: Category[] = (categoriesData || []).map((c: any) => ({
    id: c.id,
    name: c.name,
  }));

  return <ProductsClientPage initialProducts={formattedProducts} categories={categories} />;
}
