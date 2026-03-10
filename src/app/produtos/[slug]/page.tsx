import { Leaf } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/actions/products/get-product-by-slug";
import { BackButton } from "@/components/ui/back-button";
import { Badge } from "@/components/ui/badge";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: "Produto não encontrado | APFAM",
    };
  }

  return {
    title: `${product.name} | Produtos APFAM`,
    description:
      product.description ||
      `Veja detalhes de ${product.name} no catálogo da APFAM.`,
    openGraph: {
      title: `${product.name} | APFAM`,
      description:
        product.description ||
        `Veja detalhes de ${product.name} no catálogo da APFAM.`,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default async function ProductDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const categories = product.categories || [];
  const associates = product.associates || [];

  return (
    <main className="min-h-screen bg-background">
      {/* Navbar space compensation */}
      <div className="h-24 md:h-32 bg-background" />

      <div className="container mx-auto px-4 max-w-6xl pb-24">
        {/* Breadcrumb / Nav */}
        <div className="flex items-center justify-between mb-8">
          <BackButton href="/produtos" label="Catálogo de Produtos" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Coluna da Imagem */}
          <div className="lg:col-span-7">
            <div className="sticky top-32 aspect-4/3 md:aspect-square w-full bg-muted rounded-4xl overflow-hidden border border-border shadow-xl">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                  <ImagePlaceholder
                    name={product.name}
                    className="w-full h-full"
                    textClassName="text-6xl"
                  />
                </div>
              )}
              {product.featured && (
                <div className="absolute top-6 right-6">
                  <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-none shadow-lg px-4 py-1.5 text-sm uppercase tracking-widest">
                    Destaque
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Coluna de Info */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((item) => (
                <Badge
                  key={item.category?.id || item.category?.name}
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors px-4 py-1.5 text-sm font-semibold rounded-full"
                >
                  {item.category?.name}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 leading-tight tracking-tight">
              {product.name}
            </h1>

            <div className="w-16 h-1.5 bg-primary/60 rounded-full mb-8" />

            <div className="prose prose-lg prose-p:text-muted-foreground prose-p:leading-relaxed max-w-none mb-12">
              <p>
                {product.description ||
                  "Este produto recém-colhido ainda não possui uma descrição completa, mas traz toda a qualidade e frescor da nossa produção local direto para a sua mesa."}
              </p>
            </div>

            {/* Box dos Produtores Responsáveis */}
            {associates.length > 0 && (
              <div className="mt-auto xl:mt-16 p-1 rounded-3xl bg-linear-to-br from-border/50 to-background">
                <div className="bg-card rounded-3xl p-6 lg:p-8 flex flex-col gap-6 shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-primary" />
                      <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">
                        Produtor{associates.length > 1 ? "es" : ""} Responsável
                        {associates.length > 1 ? "is" : ""}
                      </h3>
                    </div>
                    {associates.length > 3 && (
                      <Badge
                        variant="outline"
                        className="text-[10px] uppercase font-bold text-muted-foreground border-dashed"
                      >
                        + {associates.length - 3} Outros
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-4">
                    {associates.map((item) => {
                      if (!item.associate) return null;
                      return (
                        <Link
                          key={item.associate.id}
                          href={`/associados/${item.associate.slug}`}
                          className="group/item flex items-center gap-4 p-3 rounded-2xl border border-transparent hover:border-primary/10 hover:bg-primary/5 transition-all"
                        >
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 border-background shadow-sm group-hover/item:scale-105 transition-transform">
                            {item.associate.avatarUrl ? (
                              <Image
                                src={item.associate.avatarUrl}
                                alt={item.associate.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-muted">
                                <ImagePlaceholder name={item.associate.name} />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-foreground group-hover/item:text-primary transition-colors">
                              {item.associate.name}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {item.associate.location || "Produtor APFAM"}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
