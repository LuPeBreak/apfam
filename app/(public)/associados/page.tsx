import { supabase } from "@/lib/supabase";
import { Associate } from "@/types";
import { AssociateWithProducts } from "@/types/supabase-custom";
import AssociatesClientPage from "./AssociatesClientPage";

export const dynamic = 'force-dynamic';

export default async function AssociatesPage() {
  const { data: associatesData, error } = await supabase
    .from('associates')
    .select(`
      *,
      associate_products (
        product_id,
        products (
          id,
          name
        )
      )
    `)
    .order('name');

  if (error) {
    console.error("Error fetching associates:", error);
  }

  const formattedAssociates: Associate[] = (associatesData as unknown as AssociateWithProducts[] || []).map((a) => ({
    id: a.id,
    name: a.name,
    bio: a.bio || "",
    location: a.location || "",
    avatarUrl: a.avatar_url,
    products: a.associate_products.map((ap) => ({
      id: ap.product_id,
      name: ap.products.name,
      categoryIds: [],
      categoryNames: []
    }))
  }));

  return <AssociatesClientPage initialAssociates={formattedAssociates} />;
}
