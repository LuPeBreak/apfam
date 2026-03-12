import Image from "next/image";
import { getPublicAssociates } from "@/actions/associates/get-public-associates";
import { getPublicProductsList } from "@/actions/products/get-public-products-list";
import { AssociateCard } from "@/components/cards/associate-card";
import { AssociateFilters } from "@/components/public/associate-filters";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export const revalidate = 60; // ISR

export default async function AssociatesPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const productSlug =
    typeof searchParams.product === "string" ? searchParams.product : undefined;

  const [associates, products] = await Promise.all([
    getPublicAssociates({ search: q, productSlug }),
    getPublicProductsList(),
  ]);

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] md:h-[60vh] md:min-h-[500px] w-full flex flex-col items-center justify-center pt-20">
        <Image
          src="/images/associates-banner.webp"
          alt="Nossos Produtores Associados"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center px-4 max-w-3xl mt-8">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6">
            Produtores Associados
          </h1>
          <p className="text-lg md:text-2xl text-white/90">
            Conheça de perto as mãos, o suor e a dedicação de quem cultiva os
            alimentos que chegam frescos à sua mesa todos os dias.
          </p>
        </div>
      </section>

      {/* Floating Search Bar */}
      <div className="container relative z-20 -mt-8 max-w-4xl mx-auto px-4 pb-12">
        <AssociateFilters
          products={products}
          placeholder="Buscar produtor pelo nome..."
        />
      </div>

      <div className="container mx-auto px-4 mt-4">
        {associates.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border/50">
            <p className="text-lg text-muted-foreground">
              {q
                ? `Nenhum produtor encontrado com a busca "${q}".`
                : "Nenhum produtor associado encontrado."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {associates.map((associate) => (
              <AssociateCard key={associate.id} associate={associate} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
