import { getPublicAssociates } from "@/actions/associates/get-public-associates";
import { getPublicEvents } from "@/actions/events/get-public-events";
import { getPublicProducts } from "@/actions/products/get-public-products";
import { About } from "@/components/home/about";
import { FeaturedAssociates } from "@/components/home/featured-associates";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Hero } from "@/components/home/hero";
import { RecentEvents } from "@/components/home/recent-events";

// Next.js 15: forced dynamic não é mais necessário por default se não usarmos cookies/headers,
// mas como queremos dados sempre atualizados (sem regenerar build estática inteira para cada novo produto cadastrado)
// podemos exportar revalidate ou usar dynamic:
export const revalidate = 60; // ISR cache de 60 segundos

export default async function Home() {
  // Disparamos as queries em paralelo para performance usando as Server Actions
  const [featuredProducts, recentEvents, featuredAssociates] =
    await Promise.all([
      getPublicProducts({ limit: 4, featuredOnly: true }),
      getPublicEvents({ limit: 3 }),
      getPublicAssociates({ limit: 4 }),
    ]);

  return (
    <>
      <Hero />
      <About />
      <FeaturedProducts products={featuredProducts} />
      <FeaturedAssociates associates={featuredAssociates} />
      <RecentEvents events={recentEvents} />
    </>
  );
}
