"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";

export type EventProps = {
  id: string;
  name: string;
  slug: string;
  date: Date;
  location: string;
  imageUrl: string | null;
};

export function RecentEvents({ events }: { events: EventProps[] }) {
  if (!events) return null;

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Próximos Eventos e Feiras
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Encontre nossos produtores nas feiras da região e participe de
            workshops sobre agricultura sustentável.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col overflow-hidden bg-card border-border hover:shadow-lg transition-shadow">
                <Link
                  href={`/eventos/${event.slug}`}
                  className="flex-1 flex flex-col"
                >
                  {/* Imagem do Evento */}
                  <div className="relative aspect-video w-full bg-muted">
                    {event.imageUrl ? (
                      <Image
                        src={event.imageUrl}
                        alt={event.name}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImagePlaceholder
                        name={event.name}
                        className="absolute inset-0"
                        textClassName="text-3xl"
                      />
                    )}
                    {/* Box de Data Flutuante */}
                    <div className="absolute top-4 left-4 bg-white dark:bg-card p-2 rounded-lg shadow-md text-center min-w-[60px]">
                      <span className="block text-sm font-semibold text-primary uppercase leading-tight">
                        {format(event.date, "MMM", { locale: ptBR })}
                      </span>
                      <span className="block text-2xl font-bold text-foreground leading-tight">
                        {format(event.date, "dd")}
                      </span>
                    </div>
                  </div>

                  <CardContent className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-foreground mb-4 line-clamp-2 hover:text-primary transition-colors">
                      {event.name}
                    </h3>

                    <div className="space-y-3 mb-6 mt-auto">
                      <div className="flex items-start gap-3 text-muted-foreground">
                        <Calendar className="w-5 h-5 shrink-0 text-primary/70" />
                        <span className="text-sm">
                          {format(event.date, "EEEE, dd 'de' MMMM 'às' HH:mm", {
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                      <div className="flex items-start gap-3 text-muted-foreground">
                        <MapPin className="w-5 h-5 shrink-0 text-primary/70" />
                        <span className="text-sm line-clamp-2">
                          {event.location}
                        </span>
                      </div>
                    </div>

                    <div className="text-primary font-medium text-sm inline-flex items-center group/link mt-auto">
                      Mais detalhes
                      <ArrowRight className="ml-1 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 h-14 text-base hover:-translate-y-1 transition-transform"
            asChild
          >
            <Link href="/eventos">Ver Agenda Completa</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
