import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getEventBySlug } from "@/actions/events/get-event-by-slug";
import { BackButton } from "@/components/ui/back-button";
import { Badge } from "@/components/ui/badge";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const event = await getEventBySlug(params.slug);

  if (!event) {
    return {
      title: "Evento não encontrado | APFAM",
    };
  }

  return {
    title: `${event.name} | Eventos APFAM`,
    description:
      event.description ||
      `Participe do evento ${event.name} organizado pela APFAM.`,
    openGraph: {
      title: `${event.name} | APFAM`,
      description:
        event.description ||
        `Participe do evento ${event.name} organizado pela APFAM.`,
      images: event.imageUrl ? [event.imageUrl] : [],
    },
  };
}

export default async function EventDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const event = await getEventBySlug(params.slug);

  if (!event) {
    notFound();
  }

  const isPastEvent = new Date(event.date) < new Date();

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Imagem Cover do Evento (Hero Full) */}
      <div className="relative w-full h-[55vh] min-h-[450px] bg-muted overflow-hidden">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
            <ImagePlaceholder
              name={event.name}
              className="w-full h-full opacity-60"
              textClassName="text-6xl"
            />
          </div>
        )}

        {/* Gradients */}
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/30 to-background" />

        {/* Top Navbar Overlay */}
        <div className="absolute top-0 left-0 w-full z-20 pt-24 pb-4 px-4 md:px-8">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <BackButton
              href="/eventos"
              label="Todos os Eventos"
              variant="hero"
            />
          </div>
        </div>

        {/* Hero Title & Primary Date */}
        <div className="absolute bottom-20 md:bottom-24 left-0 w-full z-20 px-4">
          <div className="container max-w-6xl mx-auto flex flex-col md:flex-row gap-6 md:gap-12 md:items-end">
            {/* Tear-off Calendar */}
            <div className="flex flex-col items-center justify-center p-6 bg-background rounded-4xl border border-border/50 shadow-2xl shrink-0 w-32 md:w-40 md:-mb-16 z-30 transition-transform hover:-translate-y-2 duration-300">
              <span className="text-primary font-bold uppercase tracking-widest text-sm md:text-base mb-2">
                {format(event.date, "MMM", { locale: ptBR })}
              </span>
              <span className="text-5xl md:text-6xl font-black text-foreground">
                {format(event.date, "dd")}
              </span>
              <span className="text-muted-foreground text-xs md:text-sm font-medium mt-2">
                {format(event.date, "yyyy")}
              </span>
            </div>

            {/* Title */}
            <div className="flex-1 pb-4 md:pb-0">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground border-none">
                  Evento
                </Badge>
                {isPastEvent && (
                  <Badge
                    variant="secondary"
                    className="bg-muted text-muted-foreground"
                  >
                    Já realizado
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                {event.name}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl pt-16 md:pt-24 relative z-20 flex flex-col lg:flex-row gap-12 lg:gap-24">
        {/* Main Description */}
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center border-b border-border/60 pb-4">
            Sobre o Evento
          </h3>
          <div className="prose prose-lg prose-p:text-muted-foreground prose-p:leading-relaxed max-w-none prose-headings:text-foreground">
            <p>
              {event.description ||
                "Junte-se a nós neste dia especial! Venha nos visitar no endereço e horário marcados. Estamos preparando tudo com muito carinho para receber você e sua família."}
            </p>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="w-full lg:w-96 shrink-0 space-y-6">
          <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
            <h4 className="font-bold text-xl mb-6">Informações</h4>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <CalendarDays className="w-6 h-6 text-primary" />
                </div>
                <div className="pt-1">
                  <p className="font-medium text-foreground capitalize">
                    {format(event.date, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 text-balance">
                    Adicione à sua agenda para não esquecer.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div className="pt-1">
                  <p className="font-medium text-foreground">
                    A partir das {format(event.date, "HH:mm")}h
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 text-balance">
                    Chegue no horário para aproveitar tudo.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div className="pt-1">
                  <p className="font-medium text-foreground leading-snug">
                    {event.location}
                  </p>
                  <p className="text-sm text-primary mt-2 cursor-pointer hover:underline">
                    Ver no Mapa (Em breve)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
