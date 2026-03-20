import { getPublicCategories } from "@/actions/categories/get-public-categories";
import { getSiteConfigsBySection } from "@/actions/config/get-site-configs-by-section";
import { getPublicProducts } from "@/actions/products/get-public-products";
import { ProductCard } from "@/components/cards/product-card";
import { PageHero } from "@/components/public/page-hero";
import { ProductFilters } from "@/components/public/product-filters";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export const revalidate = 60;

export default async function ProductsPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const categorySlug =
    typeof searchParams.category === "string"
      ? searchParams.category
      : undefined;

  const [products, categories, configs] = await Promise.all([
    getPublicProducts({
      limit: 100,
      search: q,
      categorySlug: categorySlug,
      featuredOnly: false,
    }),
    getPublicCategories(),
    getSiteConfigsBySection("produtos"),
  ]);

  const configMap = Object.fromEntries(configs.map((c) => [c.key, c.value]));

  return (
    <main className="min-h-screen bg-background pb-20">
      <PageHero
        title={configMap.produtos_title}
        description={configMap.produtos_description}
        backgroundImage={configMap.produtos_hero_image}
        alt="Nossos Produtos"
      />

      {/* Floating Search Bar */}
      <div className="container relative z-20 -mt-8 max-w-4xl mx-auto px-4 pb-12">
        <ProductFilters
          categories={categories}
          placeholder="Buscar produtos..."
        />
      </div>

      <div className="container mx-auto px-4 mt-4">
        {products.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border/50">
            <p className="text-lg text-muted-foreground">
              {q
                ? `Nenhum produto encontrado com a busca "${q}".`
                : "Nenhum produto disponível no momento."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
