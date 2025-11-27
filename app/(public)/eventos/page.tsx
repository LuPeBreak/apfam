import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_EVENTS } from "@/data/mocks";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";

export default function EventsPage() {
  // Sort events by date (ascending - upcoming first)
  const sortedEvents = [...MOCK_EVENTS].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="container py-12 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">Próximos Eventos</h1>
          <p className="text-muted-foreground text-lg">
            Fique por dentro das feiras, cursos e reuniões da APFAM.
          </p>
        </div>

        <div className="grid gap-8">
          {sortedEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row">
                <div className="relative h-48 md:h-auto md:w-1/3 shrink-0">
                  <Image
                    src={event.imageUrl || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop"}
                    alt={event.title}
                    fill
                    className="object-cover"
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
                    <CardTitle className="text-2xl">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground leading-relaxed">
                      {event.description}
                    </p>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
