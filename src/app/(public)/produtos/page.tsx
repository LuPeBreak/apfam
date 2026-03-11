import Image from "next/image";
import { getPublicProducts } from "@/actions/products/get-public-products";
import { ProductCard } from "@/components/cards/product-card";
import { SearchInput } from "@/components/ui/search-input";

// No Next.js 15, os searchParams devem ser sempre tipados e acessados através do await
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export const revalidate = 60; // ISR

export default async function ProductsPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;

  const products = await getPublicProducts({
    limit: 100,
    search: q,
    featuredOnly: false,
  });

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] md:h-[60vh] md:min-h-[500px] w-full flex flex-col items-center justify-center pt-20">
        <Image
          src="/images/products-banner.webp"
          alt="Nossos Produtos"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center px-4 max-w-3xl mt-8">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6">
            Nossos Produtos
          </h1>
          <p className="text-lg md:text-2xl text-white/90">
            Descubra os cultivos e preparos feitos com carinho pelas nossas
            famílias associadas, direto do campo para a sua mesa.
          </p>
        </div>
      </section>

      {/* Floating Search Bar */}
      <div className="container relative z-20 -mt-8 max-w-3xl mx-auto px-4 pb-12">
        <SearchInput placeholder="Buscar produtos..." />
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
