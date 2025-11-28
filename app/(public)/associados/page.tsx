import { supabase } from "@/lib/supabase";
import { Associate } from "@/types";
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formattedAssociates: Associate[] = (associatesData || []).map((a: any) => ({
    id: a.id,
    name: a.name,
    bio: a.bio || "",
    location: a.location || "",
    avatarUrl: a.avatar_url,
    products: a.associate_products.map((ap: any) => ({
      id: ap.products.id,
      name: ap.products.name
    }))
  }));

  return <AssociatesClientPage initialAssociates={formattedAssociates} />;
}
