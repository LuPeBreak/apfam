import { AssociatesTable } from "@/components/admin/tables/AssociatesTable";
import { supabase } from "@/lib/supabase";
import { Associate, Product } from "@/types";

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

  // Cast to Associate[] to ensure type compatibility
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formattedAssociates: Associate[] = (associatesData || []).map((a: any) => ({
    id: a.id,
    name: a.name,
    bio: a.bio || "",
    location: a.location || "",
    avatarUrl: a.avatar_url,
    products: a.associate_products.map((ap: any) => ({
      id: ap.product_id,
      name: ap.products.name
    })),
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const catalog: Product[] = (productsData || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    description: p.description || "",
    imageUrl: p.image_url,
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
