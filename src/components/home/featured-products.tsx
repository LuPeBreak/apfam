"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/cards/product-card";
import { Button } from "@/components/ui/button";

// Definindo o tipo para bater com a query do Prisma que virá no page.tsx
export type FeaturedProductProps = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  categories: { category: { name: string } }[];
};

export function FeaturedProducts({
  products,
}: {
  products: FeaturedProductProps[];
}) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-20 md:py-32 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Destaques da Nossa Terra
            </h2>
            <p className="text-lg text-muted-foreground">
              Cultivados com carinho pelas nossas famílias associadas. Conheça
              alguns dos produtos mais procurados.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              variant="outline"
              asChild
              className="rounded-full px-8 h-14 text-base hover:-translate-y-1 transition-transform"
            >
              <Link href="/produtos">
                Ver todos os Produtos <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
