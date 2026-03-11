import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAssociates } from "@/actions/dashboard/associates/get-associates";
import { AssociatesTable } from "@/components/dashboard/associates/associates-table";
import { auth } from "@/lib/auth/auth";
import type { Session } from "@/lib/auth/with-permissions";

export const metadata = {
  title: "Associados | APFAM Dashboard",
};

export default async function AssociadosPage() {
  const session = (await auth.api.getSession({
    headers: await headers(),
  })) as Session | null;

  if (!session) redirect("/login");

  const records = await getAssociates();
  const data = Array.isArray(records) ? records : [];

  return <AssociatesTable data={data} />;
}
