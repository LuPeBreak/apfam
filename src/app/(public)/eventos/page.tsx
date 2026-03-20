import { getSiteConfigsBySection } from "@/actions/config/get-site-configs-by-section";
import { getPublicEvents } from "@/actions/events/get-public-events";
import { EventCard } from "@/components/cards/event-card";
import { EventFilters } from "@/components/public/event-filters";
import { PageHero } from "@/components/public/page-hero";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export const revalidate = 60;

export default async function EventsPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const dateFilter =
    typeof searchParams.date === "string" ? searchParams.date : undefined;

  const [events, configs] = await Promise.all([
    getPublicEvents({ search: q, dateFilter }),
    getSiteConfigsBySection("eventos"),
  ]);

  const configMap = Object.fromEntries(configs.map((c) => [c.key, c.value]));

  return (
    <main className="min-h-screen bg-background pb-20">
      <PageHero
        title={configMap.eventos_title}
        description={configMap.eventos_description}
        backgroundImage={configMap.eventos_hero_image}
        alt="Feiras e Eventos"
      />

      {/* Floating Search Bar */}
      <div className="container relative z-20 -mt-8 max-w-4xl mx-auto px-4 pb-12">
        <EventFilters placeholder="Buscar eventos ou locais..." />
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
