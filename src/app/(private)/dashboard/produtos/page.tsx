import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAssociates } from "@/actions/dashboard/associates/get-associates";
import { getCategories } from "@/actions/dashboard/categories/get-categories";
import { getProducts } from "@/actions/dashboard/products/get-products";
import { ProductsTable } from "@/components/dashboard/products/products-table";
import { auth } from "@/lib/auth/auth";
import type { Session } from "@/lib/auth/with-permissions";

export const metadata = {
  title: "Produtos | APFAM Dashboard",
};

export default async function ProdutosPage() {
  const session = (await auth.api.getSession({
    headers: await headers(),
  })) as Session | null;

  if (!session) redirect("/login");

  // Fetch all required data in parallel
  const [productsRes, categoriesRes, associatesRes] = await Promise.all([
    getProducts(),
    getCategories(),
    getAssociates(),
  ]);

  const products = Array.isArray(productsRes) ? productsRes : [];
  const categories = Array.isArray(categoriesRes) ? categoriesRes : [];
  const associates = Array.isArray(associatesRes) ? associatesRes : [];

  return (
    <ProductsTable
      data={products}
      categories={categories}
      associates={associates}
    />
  );
}
