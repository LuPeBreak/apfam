import { supabase } from "@/lib/supabase";
import { Event } from "@/types";
import EventsClientPage from "./EventsClientPage";

export const dynamic = 'force-dynamic';

import { DatabaseEvent } from "@/types/supabase-custom";

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
    imageUrl: e.image_url,
  }));

  return <EventsClientPage initialEvents={formattedEvents} />;
}
