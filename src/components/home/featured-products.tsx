"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";

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
              <Card className="h-full overflow-hidden group border-border/50 hover:border-primary/50 transition-colors bg-card hover:shadow-lg">
                <Link
                  href={`/produtos/${product.slug}`}
                  className="h-full flex flex-col"
                >
                  {/* Área da Imagem */}
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <ImagePlaceholder
                        name={product.name}
                        className="absolute inset-0"
                        textClassName="text-4xl"
                      />
                    )}

                    {/* Badges de Categoria flutuando na imagem */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      {product.categories.map((c) => (
                        <Badge
                          key={c.category.name}
                          className="bg-secondary hover:bg-secondary text-secondary-foreground border-none"
                        >
                          {c.category.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Informações do Produto */}
                  <CardContent className="flex-1 p-5">
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </CardContent>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
