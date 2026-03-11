import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { auth } from "@/lib/auth/auth";
import type { Session } from "@/lib/auth/with-permissions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = (await auth.api.getSession({
    headers: await headers(),
  })) as Session | null;

  if (!session) {
    redirect("/login");
  }

  const isAdmin = session.user.role === "admin";

  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar isAdmin={isAdmin} />
        <div className="flex flex-1 flex-col md:pl-64 transition-all duration-300">
          <DashboardHeader user={session.user} />
          <main className="flex-1 py-6 px-4 md:px-8">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}
