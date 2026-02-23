
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Product } from "@/types";

interface FeaturedProductsSectionProps {
  products: Product[];
}

export function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-24 bg-background">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight mb-2">Nossos Produtos</h2>
              <p className="text-muted-foreground text-lg">O melhor da agricultura familiar direto para você</p>
            </div>
            <Button variant="default" asChild className="hidden md:flex rounded-full px-6">
              <Link href="/produtos" className="flex items-center gap-2">
                Ver catálogo completo <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {products.length > 0 ? (
              products.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                <Link href={`/produtos/${product.slug}`} className="block group h-full">
                  <Card className="h-full border-none shadow-md hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 bg-card flex flex-col">
                    <div className="relative aspect-square w-full overflow-hidden bg-muted">
                      <Image
                        src={product.imageUrl || "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=2000&auto=format&fit=crop"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="bg-secondary text-secondary-foreground text-sm font-medium px-4 py-2 rounded-full shadow-lg">
                          Ver Detalhes
                        </span>
                      </div>
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors">
                          {product.name}
                        </CardTitle>
                      </div>
                      {product.categoryNames && product.categoryNames.length > 0 && (
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                          {product.categoryNames[0]}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="p-4 pt-0 flex-1">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 mt-auto">
                      <div className="w-full flex justify-between items-center text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                        Saiba mais <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Nenhum produto em destaque no momento.</p>
              </div>
            )}
          </motion.div>

          <div className="mt-8 text-center md:hidden">
            <Button variant="default" asChild className="w-full rounded-full">
              <Link href="/produtos">Ver catálogo completo</Link>
            </Button>
          </div>
        </div>
      </section>
  );
}
