"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";

import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Event } from "@/types";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/custom/page-header";
import { SearchContainer } from "@/components/custom/search-container";

interface EventsClientPageProps {
  initialEvents: Event[];
}

export default function EventsClientPage({ initialEvents }: EventsClientPageProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = initialEvents.filter((event) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      event.title.toLowerCase().includes(searchLower) ||
      event.location?.toLowerCase().includes(searchLower) ||
      event.description?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50/50">
      <PageHeader
        title="Próximos Eventos"
        description="Fique por dentro das feiras, cursos e reuniões da APFAM. Participe e fortaleça nossa comunidade."
        imageSrc="https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2940&auto=format&fit=crop"
        height="h-[300px]"
      />

      <div className="container py-8 px-4 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <SearchContainer>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar eventos por nome ou local..."
                className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </SearchContainer>

          <div className="grid gap-8">
            {filteredEvents.map((event) => (
              <motion.div 
                key={event.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <Link href={`/eventos/${event.slug}`} className="block group">
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-none shadow-md">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative h-48 md:h-auto md:w-1/3 shrink-0 overflow-hidden">
                        <ImageWithFallback
                          src={event.imageUrl}
                          fallbackType="event"
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <CardHeader>
                          <div className="flex flex-wrap gap-4 text-sm text-primary font-medium mb-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(event.date).toLocaleDateString("pt-BR", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              {event.location}
                            </div>
                          </div>
                          <CardTitle className="text-2xl group-hover:text-primary transition-colors">{event.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                          <p className="text-muted-foreground leading-relaxed line-clamp-3">
                            {event.description}
                          </p>
                          <div className="mt-4 flex items-center text-primary font-medium text-sm">
                            Ver detalhes <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
                          </div>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
            
            {filteredEvents.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                Nenhum evento encontrado para &quot;{searchTerm}&quot;.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
