import { Leaf, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAssociateBySlug } from "@/actions/associates/get-associate-by-slug";
import { BackButton } from "@/components/ui/back-button";
import { Badge } from "@/components/ui/badge";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const associate = await getAssociateBySlug(params.slug);

  if (!associate) {
    return {
      title: "Associado não encontrado | APFAM",
    };
  }

  return {
    title: `${associate.name} | Produtor APFAM`,
    description:
      associate.bio ||
      `Conheça ${associate.name}, produtor associado da APFAM.`,
    openGraph: {
      title: `${associate.name} | APFAM`,
      description:
        associate.bio ||
        `Conheça ${associate.name}, produtor associado da APFAM.`,
      images: associate.avatarUrl ? [associate.avatarUrl] : [],
    },
  };
}

export default async function AssociateDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const associate = await getAssociateBySlug(params.slug);

  if (!associate) {
    notFound();
  }

  // Products are nested in the join table relation
  const products = associate.products || [];

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Hero Cover */}
      <div className="relative w-full h-[50vh] min-h-[350px] bg-primary/20 overflow-hidden">
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          <Image
            src="/images/hero-bg.webp"
            alt="Fazenda"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/20 to-background/95" />

        <div className="absolute top-4 left-4 z-20 pt-24 md:pt-32 px-4 md:px-8 w-full max-w-6xl mx-auto flex items-center justify-between">
          <BackButton
            href="/associados"
            label="Voltar aos Produtores"
            variant="hero"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl -mt-32 md:-mt-40 relative z-20">
        <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-6 md:p-12 shadow-2xl border border-white/10 flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
          {/* Avatar Area */}
          <div className="relative group shrink-0 mx-auto md:mx-0">
            <div className="absolute -inset-1 bg-linear-to-r from-primary to-green-500 rounded-full blur-sm opacity-40 group-hover:opacity-60 transition duration-500" />
            <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-background shadow-xl bg-muted">
              {associate.avatarUrl ? (
                <Image
                  src={associate.avatarUrl}
                  alt={associate.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <ImagePlaceholder
                  name={associate.name}
                  className="absolute inset-0"
                  textClassName="text-6xl"
                />
              )}
            </div>
            {/* Tag Badge */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full shadow-lg flex items-center whitespace-nowrap">
              <Leaf className="w-3 h-3 mr-1" />
              Produtor Associado
            </div>
          </div>

          {/* Associate Info Area */}
          <div className="flex-1 w-full pt-4 md:pt-8 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tight">
              {associate.name}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-muted-foreground mb-8">
              {associate.location && (
                <div className="flex items-center bg-muted/50 px-4 py-2 rounded-full border border-border/50">
                  <MapPin className="w-4 h-4 mr-2 text-primary" />
                  <span className="font-medium text-sm">
                    {associate.location}
                  </span>
                </div>
              )}
              {associate.whatsapp && (
                <div className="flex items-center bg-muted/50 px-4 py-2 rounded-full border border-border/50">
                  <Phone className="w-4 h-4 mr-2 text-primary" />
                  <span className="font-medium text-sm">Possui WhatsApp</span>
                </div>
              )}
            </div>

            <div className="relative">
              <div className="absolute left-0 top-0 w-1 h-full bg-primary/20 rounded-full hidden md:block" />
              <p className="text-lg text-muted-foreground leading-relaxed md:pl-6 max-w-3xl">
                {associate.bio ||
                  "Este produtor está focado no cultivo e ainda não detalhou sua biografia. Visite a feira para conhecê-lo de perto e descobrir os ingredientes de qualidade cultivados com carinho."}
              </p>
            </div>
          </div>
        </div>

        {/* Cesta de Produtos Inline Design (Premium Grid) */}
        <div className="mt-20 mb-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-border/40">
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Cesta de Produtos
              </h2>
              <p className="text-muted-foreground mt-2">
                Descubra o que é cultivado e oferecido por {associate.name}
              </p>
            </div>
            <Badge variant="secondary" className="px-4 py-1.5 text-sm">
              {products.length} Itens disponíveis
            </Badge>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-3xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Leaf className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Nenhum produto cadastrado
              </h3>
              <p className="text-muted-foreground max-w-md">
                Este associado ainda não adicionou produtos ao seu catálogo
                digital.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((item) => {
                if (!item.product) return null;
                return (
                  <Link
                    key={item.product.id}
                    href={`/produtos/${item.product.slug}`}
                    className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/50 bg-card hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-[360px]"
                  >
                    <div className="relative w-full h-full z-0 overflow-hidden">
                      {item.product.imageUrl ? (
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                          <ImagePlaceholder
                            name={item.product.name}
                            className="w-full h-full"
                            textClassName="text-3xl"
                          />
                        </div>
                      )}
                    </div>

                    {/* Decorative Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent z-10" />

                    <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.product.categories?.map((pc) => (
                          <Badge
                            key={pc.category?.id || pc.category?.name}
                            className="bg-white/20 hover:bg-white/30 text-white border border-white/10 shadow-sm backdrop-blur-md font-medium"
                          >
                            {pc.category?.name}
                          </Badge>
                        ))}
                      </div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors drop-shadow-md">
                        {item.product.name}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
