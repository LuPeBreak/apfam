import { MOCK_EVENTS } from "@/data/mocks";
import { EventsTable } from "@/components/admin/tables/EventsTable";

export default function AdminEventsPage() {
  const events = MOCK_EVENTS;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Gerenciar Eventos</h1>
      </div>

      <EventsTable initialData={events} />
    </div>
  );
}
