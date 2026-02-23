import { AssociatesTable } from "@/components/tables/AssociatesTable";
import { supabase } from "@/lib/supabase";
import { Associate, Product } from "@/types";
import { AssociateWithProducts, DatabaseProduct } from "@/types/supabase-custom";

export const dynamic = 'force-dynamic';

export default async function AssociatesPage() {
  // Fetch associates with their products
  const { data: associatesData, error: associatesError } = await supabase
    .from('associates')
    .select(`
      *,
      associate_products (
        product_id,
        products (
          name
        )
      )
    `)
    .order('created_at', { ascending: false });

  // Fetch all products for the catalog (for selection in form)
  const { data: productsData, error: productsError } = await supabase
    .from('products')
    .select('*')
    .order('name');

  if (associatesError || productsError) {
    console.error("Error fetching data:", associatesError || productsError);
  }

  const formattedAssociates: Associate[] = (associatesData as unknown as AssociateWithProducts[] || []).map((a) => ({
    id: a.id,
    name: a.name,
    bio: a.bio || "",
    location: a.location || "",
    avatarUrl: a.avatar_url,
    slug: a.slug,
    products: a.associate_products.map((ap) => ({
      id: ap.product_id,
      name: ap.products.name,
      slug: ap.products.slug, // Ensure products also have slug if needed by Associate type
    })),
  }));

  const catalog: Product[] = (productsData as unknown as DatabaseProduct[] || []).map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description || "",
    imageUrl: p.image_url,
    slug: p.slug,
    categoryIds: [], // Not needed for this view
    categoryNames: [],
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Associados</h1>
      </div>
      
      <AssociatesTable initialData={formattedAssociates} catalog={catalog} />
    </div>
  );
}
