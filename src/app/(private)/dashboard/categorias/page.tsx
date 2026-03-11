import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCategories } from "@/actions/dashboard/categories/get-categories";
import { CategoriesTable } from "@/components/dashboard/categories/categories-table";
import { auth } from "@/lib/auth/auth";
import type { Session } from "@/lib/auth/with-permissions";

export const metadata = {
  title: "Categorias | APFAM Dashboard",
};

export default async function CategoriasPage() {
  const session = (await auth.api.getSession({
    headers: await headers(),
  })) as Session | null;

  if (!session) redirect("/login");

  const categories = await getCategories();

  return <CategoriesTable data={Array.isArray(categories) ? categories : []} />;
}
