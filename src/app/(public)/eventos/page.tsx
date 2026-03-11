import Image from "next/image";
import { getPublicEvents } from "@/actions/events/get-public-events";
import { EventCard } from "@/components/cards/event-card";
import { SearchInput } from "@/components/ui/search-input";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export const revalidate = 60; // ISR

export default async function EventsPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;

  const events = await getPublicEvents({ search: q });

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] md:h-[60vh] md:min-h-[500px] w-full flex flex-col items-center justify-center pt-20">
        <Image
          src="/images/events-banner.webp"
          alt="Feiras e Eventos"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center px-4 max-w-3xl mt-8">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6">
            Feiras e Eventos
          </h1>
          <p className="text-lg md:text-2xl text-white/90">
            Acompanhe onde nossos produtos estarão disponíveis e participe de
            nossas atividades e capacitações regionais.
          </p>
        </div>
      </section>

      {/* Floating Search Bar */}
      <div className="container relative z-20 -mt-8 max-w-3xl mx-auto px-4 pb-12">
        <SearchInput placeholder="Buscar eventos ou locais..." />
      </div>

      <div className="container mx-auto px-4 mt-4">
        {events.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border/50">
            <p className="text-lg text-muted-foreground">
              {q
                ? `Nenhum evento encontrado com a busca "${q}".`
                : "Nenhum evento programado no momento."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
