import { supabase } from "@/lib/supabase";
import { Event, Associate, Product } from "@/types";
import HomeClientPage from "./HomeClientPage";

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
          name
        )
      )
    `)
    .limit(4);

  const formattedEvents: Event[] = (eventsData || []).map((e: any) => ({
    id: e.id,
    title: e.title,
    date: e.date,
    location: e.location || "",
    description: e.description || "",
    imageUrl: e.image_url,
  }));

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

  return <HomeClientPage recentEvents={formattedEvents} featuredAssociates={formattedAssociates} featuredProducts={formattedProducts} />;
}
