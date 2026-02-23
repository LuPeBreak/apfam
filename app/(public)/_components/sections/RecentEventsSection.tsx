
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Event } from "@/types";

interface RecentEventsSectionProps {
  events: Event[];
}

export function RecentEventsSection({ events }: RecentEventsSectionProps) {
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
    <section className="py-24 bg-muted/30">
        <div className="container px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight mb-2">Próximos Eventos</h2>
              <p className="text-muted-foreground">Participe das nossas atividades</p>
            </div>
            <Button variant="outline" asChild className="hidden md:flex">
              <Link href="/eventos" className="flex items-center gap-2">
                Ver todos <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {events.map((event) => (
              <motion.div key={event.id} variants={itemVariants}>
                <Link href={`/eventos/${event.slug}`} className="group block h-full">
                  <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-300 border-none shadow-md bg-card">
                    <div className="relative h-56 w-full overflow-hidden">
                      <Image
                        src={event.imageUrl || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop"}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold text-primary shadow-sm">
                        {new Date(event.date).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2 text-xl group-hover:text-primary transition-colors">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">{event.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" asChild className="w-full">
              <Link href="/eventos">Ver todos os eventos</Link>
            </Button>
          </div>
        </div>
      </section>
  );
}
