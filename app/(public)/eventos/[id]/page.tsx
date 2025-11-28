import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Clock } from "lucide-react";

export const dynamic = 'force-dynamic';

interface EventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;

  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !event) {
    notFound();
  }

  const eventDate = new Date(event.date);

  return (
    <div className="container py-12 px-4 min-h-screen">
      <Button variant="ghost" asChild className="mb-8 hover:bg-transparent hover:text-primary pl-0">
        <Link href="/eventos" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar para eventos
        </Link>
      </Button>

      <article className="max-w-4xl mx-auto bg-card rounded-2xl overflow-hidden shadow-sm border">
        <div className="relative h-[400px] w-full">
          <Image
            src={event.image_url || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop"}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">{event.title}</h1>
            <div className="flex flex-wrap gap-6 text-lg font-medium">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {eventDate.toLocaleDateString("pt-BR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {eventDate.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 space-y-8">
          <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg border">
            <MapPin className="h-6 w-6 text-primary shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-1">Localização</h3>
              <p className="text-muted-foreground">{event.location}</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold mb-4">Sobre o Evento</h2>
            <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
