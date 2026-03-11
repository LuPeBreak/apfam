import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileForms } from "@/components/dashboard/profile/profile-forms";
import { auth } from "@/lib/auth/auth";
import type { Session } from "@/lib/auth/with-permissions";

export const metadata = {
  title: "Perfil | APFAM Dashboard",
};

export default async function PerfilPage() {
  const session = (await auth.api.getSession({
    headers: await headers(),
  })) as Session | null;

  if (!session) redirect("/login");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold text-primary">Meu Perfil</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie suas informações pessoais e credenciais de acesso
        </p>
      </div>

      <ProfileForms initialName={session.user.name} />
    </div>
  );
}
