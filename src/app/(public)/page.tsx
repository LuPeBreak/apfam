import { getPublicAssociates } from "@/actions/associates/get-public-associates";
import { getSiteConfigsBySection } from "@/actions/config/get-site-configs-by-section";
import { getPublicEvents } from "@/actions/events/get-public-events";
import { getPublicProducts } from "@/actions/products/get-public-products";
import { About } from "@/components/home/about";
import { FeaturedAssociates } from "@/components/home/featured-associates";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Hero } from "@/components/home/hero";
import { RecentEvents } from "@/components/home/recent-events";

export const revalidate = 60;

export default async function Home() {
  const [homeConfigs, featuredProducts, recentEvents, featuredAssociates] =
    await Promise.all([
      getSiteConfigsBySection("home"),
      getPublicProducts({ limit: 4, featuredOnly: true }),
      getPublicEvents({ limit: 3 }),
      getPublicAssociates({ limit: 4 }),
    ]);

  const homeMap = Object.fromEntries(
    homeConfigs.map((c) => {
      const key = c.key.startsWith("home_") ? c.key.slice(5) : c.key;
      return [key, c.value];
    }),
  );

  const heroProps = {
    title: homeMap.hero_title,
    subtitle: homeMap.hero_subtitle,
    badge: homeMap.hero_badge,
    background: homeMap.hero_background,
  };

  const aboutProps = {
    title: homeMap.about_title,
    description: homeMap.about_description,
    image: homeMap.about_image,
    benefits: (() => {
      try {
        return JSON.parse(homeMap.about_benefits ?? "[]");
      } catch {
        return [];
      }
    })(),
  };

  const featuredProductsProps = {
    title: homeMap.featured_products_title,
    description: homeMap.featured_products_description,
  };

  const featuredEventsProps = {
    title: homeMap.featured_events_title,
    description: homeMap.featured_events_description,
  };

  const featuredAssociatesProps = {
    title: homeMap.featured_associates_title,
    badge: homeMap.featured_associates_badge,
  };

  return (
    <>
      <Hero {...heroProps} />
      <About {...aboutProps} />
      <FeaturedProducts
        products={featuredProducts}
        title={featuredProductsProps.title}
        description={featuredProductsProps.description}
      />
      <FeaturedAssociates
        associates={featuredAssociates}
        title={featuredAssociatesProps.title}
        badge={featuredAssociatesProps.badge}
      />
      <RecentEvents
        events={recentEvents}
        title={featuredEventsProps.title}
        description={featuredEventsProps.description}
      />
    </>
  );
}
