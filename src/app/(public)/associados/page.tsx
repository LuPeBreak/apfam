import { getPublicAssociates } from "@/actions/associates/get-public-associates";
import { getSiteConfigsBySection } from "@/actions/config/get-site-configs-by-section";
import { getPublicProductsList } from "@/actions/products/get-public-products-list";
import { AssociateCard } from "@/components/cards/associate-card";
import { AssociateFilters } from "@/components/public/associate-filters";
import { PageHero } from "@/components/public/page-hero";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export const revalidate = 60;

export default async function AssociatesPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const productSlug =
    typeof searchParams.product === "string" ? searchParams.product : undefined;

  const [associates, products, configs] = await Promise.all([
    getPublicAssociates({ search: q, productSlug }),
    getPublicProductsList(),
    getSiteConfigsBySection("associados"),
  ]);

  const configMap = Object.fromEntries(configs.map((c) => [c.key, c.value]));

  return (
    <main className="min-h-screen bg-background pb-20">
      <PageHero
        title={configMap.associados_title}
        description={configMap.associados_description}
        backgroundImage={configMap.associados_hero_image}
        alt="Nossos Produtores Associados"
      />

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
