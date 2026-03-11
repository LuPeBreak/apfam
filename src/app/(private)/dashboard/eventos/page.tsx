import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getEvents } from "@/actions/dashboard/events/get-events";
import { EventsTable } from "@/components/dashboard/events/events-table";
import { auth } from "@/lib/auth/auth";
import type { Session } from "@/lib/auth/with-permissions";

export const metadata = {
  title: "Eventos | APFAM Dashboard",
};

export default async function EventosPage() {
  const session = (await auth.api.getSession({
    headers: await headers(),
  })) as Session | null;

  if (!session) redirect("/login");

  const records = await getEvents();
  const data = Array.isArray(records) ? records : [];

  return <EventsTable data={data} />;
}
