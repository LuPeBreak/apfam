
"use client";

import { Event, Associate, Product } from "@/types";
import { HeroSection } from "./sections/HeroSection";
import { AboutSection } from "./sections/AboutSection";
import { ServicesSection } from "./sections/ServicesSection";
import { FeaturedProductsSection } from "./sections/FeaturedProductsSection";
import { RecentEventsSection } from "./sections/RecentEventsSection";
import { FeaturedAssociatesSection } from "./sections/FeaturedAssociatesSection";

interface HomeClientPageProps {
  recentEvents: Event[];
  featuredAssociates: Associate[];
  featuredProducts: Product[];
}

export default function HomeClientPage({ recentEvents, featuredAssociates, featuredProducts }: HomeClientPageProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <FeaturedProductsSection products={featuredProducts} />
      <RecentEventsSection events={recentEvents} />
      <FeaturedAssociatesSection associates={featuredAssociates} />
    </div>
  );
}
