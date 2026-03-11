import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUsers } from "@/actions/dashboard/users/get-users";
import { UsersTable } from "@/components/dashboard/users/users-table";
import { auth } from "@/lib/auth/auth";
import type { Session } from "@/lib/auth/with-permissions";

export const metadata = {
  title: "Usuários | APFAM Dashboard",
};

export default async function UsuariosPage() {
  const session = (await auth.api.getSession({
    headers: await headers(),
  })) as Session | null;

  if (!session || session.user.role !== "admin") {
    redirect("/dashboard");
  }

  const records = await getUsers();
  const data = Array.isArray(records) ? records : [];

  return <UsersTable data={data} currentUserId={session.user.id} />;
}
