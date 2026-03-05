"use client";

import { motion } from "framer-motion";
import { ArrowRight, Leaf, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";

export type FeaturedAssociateProps = {
  id: string;
  name: string;
  slug: string;
  location: string;
  avatarUrl: string | null;
};

export function FeaturedAssociates({
  associates,
}: {
  associates: FeaturedAssociateProps[];
}) {
  if (!associates || associates.length === 0) return null;

  return (
    <section className="py-20 md:py-32 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Pattern decorativo de fundo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 -left-1/4 w-full aspect-square rounded-full border-100 border-white" />
        <div className="absolute -bottom-1/4 -right-1/4 w-full aspect-square rounded-full border-100 border-white" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium border border-white/20">
              <Leaf className="w-4 h-4" />
              <span>Quem Planta</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Conheça as mãos que alimentam nossa região
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="pb-2"
          >
            <Button
              variant="outline"
              asChild
              className="rounded-full px-8 h-14 text-base bg-white/10 hover:bg-white/20 text-white border-white/30 border-2 hover:text-white hover:-translate-y-1 transition-transform"
            >
              <Link href="/associados">
                Ver todos os Produtores <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {associates.map((associate, index) => (
            <motion.div
              key={associate.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={`/associados/${associate.slug}`}
                className="block group"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-all text-center h-full flex flex-col items-center">
                  {/* Avatar Circular */}
                  <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden bg-white/20 flex items-center justify-center border-4 border-white/30 group-hover:scale-110 transition-transform duration-300">
                    {associate.avatarUrl ? (
                      <Image
                        src={associate.avatarUrl}
                        alt={associate.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <ImagePlaceholder
                        name={associate.name}
                        className="absolute inset-0"
                        textClassName="text-3xl"
                      />
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">
                    {associate.name}
                  </h3>

                  <div className="mt-auto flex items-center justify-center gap-2 text-white/70 text-sm">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="line-clamp-1">{associate.location}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
