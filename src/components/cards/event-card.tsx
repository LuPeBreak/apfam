import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import type { EventModel } from "@/types/models";

export function EventCard({ event }: { event: EventModel }) {
  return (
    <Card className="h-full flex flex-col overflow-hidden bg-card border-border hover:shadow-lg transition-shadow">
      <Link href={`/eventos/${event.slug}`} className="flex-1 flex flex-col">
        {/* Imagem do Evento */}
        <div className="relative aspect-video w-full bg-muted overflow-hidden group">
          {event.imageUrl ? (
            <Image
              src={event.imageUrl}
              alt={event.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <ImagePlaceholder
              name={event.name}
              className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
              textClassName="text-3xl"
            />
          )}

          {/* Box de Data Flutuante */}
          <div className="absolute top-4 left-4 bg-white dark:bg-card p-2 rounded-lg shadow-md text-center min-w-[60px] z-10">
            <span className="block text-sm font-semibold text-primary uppercase leading-tight">
              {format(event.date, "MMM", { locale: ptBR })}
            </span>
            <span className="block text-2xl font-bold text-foreground leading-tight">
              {format(event.date, "dd")}
            </span>
          </div>
        </div>

        <CardContent className="p-6 flex-1 flex flex-col group">
          <h3 className="text-xl font-bold text-foreground mb-4 line-clamp-2 group-hover:text-primary transition-colors">
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
              <span className="text-sm line-clamp-2">{event.location}</span>
            </div>
          </div>

          <div className="text-primary font-medium text-sm inline-flex items-center group-hover:underline mt-auto">
            Mais detalhes
            <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
