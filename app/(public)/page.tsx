import { supabase } from "@/lib/supabase";
import { Event, Associate, Product } from "@/types";
import { DatabaseEvent, ProductWithCategories, AssociateWithProducts } from "@/types/supabase-custom";
import HomeClientPage from "./_components/HomeClientPage";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch recent events
  const { data: eventsData } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })
    .limit(3);

  // Fetch featured products (limit 4)
  const { data: productsData } = await supabase
    .from('products')
    .select(`
      *,
      product_categories (
        category_id,
        categories (
          id,
          name
        )
      )
    `)
    .limit(4);

  // Fetch featured associates (just taking 4 for now)
  const { data: associatesData } = await supabase
    .from('associates')
    .select(`
      *,
      associate_products (
        product_id,
        products (
          id,
          name,
          slug
        )
      )
    `)
    .limit(4);

  const formattedEvents: Event[] = (eventsData as unknown as DatabaseEvent[] || []).map((e) => ({
    id: e.id,
    title: e.title,
    date: e.date,
    location: e.location || "",
    description: e.description || "",
    imageUrl: e.image_url,
    slug: e.slug,
  }));

  const formattedProducts: Product[] = (productsData as unknown as ProductWithCategories[] || []).map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description || "",
    imageUrl: p.image_url,
    categoryIds: p.product_categories.map((pc) => pc.category_id),
    categoryNames: p.product_categories.map((pc) => pc.categories.name),
    slug: p.slug,
  }));

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
      slug: ap.products.slug,
      categoryIds: [],
      categoryNames: []
    }))
  }));

  return <HomeClientPage recentEvents={formattedEvents} featuredAssociates={formattedAssociates} featuredProducts={formattedProducts} />;
}
