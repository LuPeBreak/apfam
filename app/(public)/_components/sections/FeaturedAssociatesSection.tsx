
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { InitialsAvatar } from "@/components/ui/initials-avatar";
import { motion } from "framer-motion";
import { Associate } from "@/types";

interface FeaturedAssociatesSectionProps {
  associates: Associate[];
}

export function FeaturedAssociatesSection({ associates }: FeaturedAssociatesSectionProps) {
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
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight mb-4">Nossos Associados</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Conheça quem faz a diferença no campo e traz qualidade para sua mesa
            </p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
          >
            {associates.map((associate) => (
              <motion.div key={associate.id} variants={itemVariants}>
                <Link href={`/associados/${associate.slug}`} className="group block h-full">
                  <Card className="h-full border-none shadow-md hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 bg-card">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="mb-6">
                        {associate.avatarUrl ? (
                          <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-primary/10 group-hover:border-primary/30 transition-colors">
                            <Image
                              src={associate.avatarUrl}
                              alt={associate.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <InitialsAvatar
                            name={associate.name}
                            size="lg"
                            className="border-4 border-primary/10 group-hover:border-primary/30 transition-colors"
                          />
                        )}
                      </div>
                      <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                        {associate.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">{associate.location}</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {associate.products.slice(0, 2).map((p) => (
                          <span key={p.id} className="text-xs bg-secondary/30 text-secondary-foreground px-2.5 py-1 rounded-full font-medium">
                            {p.name}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/associados" className="flex items-center gap-2">
                Conheça todos os produtores <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
  );
}
