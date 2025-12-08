import { supabase } from "@/lib/supabase";
import { Product, Category } from "@/types";
import { ProductWithAssociateNames, DatabaseCategory } from "@/types/supabase-custom";
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

  const formattedProducts: Product[] = (productsData as unknown as ProductWithAssociateNames[] || []).map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description || "",
    imageUrl: p.image_url,
    categoryIds: p.product_categories.map((pc) => pc.category_id),
    categoryNames: p.product_categories.map((pc) => pc.categories.name),
     
    associateName: p.associate_products?.[0]?.associates?.name || "APFAM",
    associateCount: p.associate_products?.length || 0
  }));

  const categories: Category[] = (categoriesData as unknown as DatabaseCategory[] || []).map((c) => ({
    id: c.id,
    name: c.name,
  }));

  return <ProductsClientPage initialProducts={formattedProducts} categories={categories} />;
}
