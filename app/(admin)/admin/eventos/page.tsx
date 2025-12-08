
import { EventsTable } from "@/components/tables/EventsTable";
import { supabase } from "@/lib/supabase";
import { Event } from "@/types";
import { DatabaseEvent } from "@/types/supabase-custom";

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    console.error("Error fetching events:", error);
  }

  const formattedEvents: Event[] = (events as unknown as DatabaseEvent[] || []).map((e) => ({
    id: e.id,
    title: e.title,
    date: e.date,
    location: e.location || "",
    description: e.description || "",
    imageUrl: e.image_url || "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&q=80",
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Eventos</h1>
      </div>
      
      <EventsTable initialData={formattedEvents} />
    </div>
  );
}
