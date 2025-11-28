import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, ShoppingBag } from "lucide-react";

export const dynamic = 'force-dynamic';

interface AssociatePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AssociatePage({ params }: AssociatePageProps) {
  const { id } = await params;

  const { data: associate, error } = await supabase
    .from('associates')
    .select(`
      *,
      associate_products (
        product_id,
        products (
          id,
          name,
          description,
          image_url
        )
      )
    `)
    .eq('id', id)
    .single();

  if (error || !associate) {
    notFound();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const products = associate.associate_products.map((ap: any) => ap.products);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Banner */}
      <div className="h-[300px] w-full relative bg-muted">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40 mix-blend-multiply" />
        <Image
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop"
          alt="Background"
          fill
          className="object-cover -z-10"
          priority
        />
        <div className="container h-full flex items-start pt-8 px-4">
          <Button variant="ghost" asChild className="text-white hover:bg-white/20 hover:text-white pl-0">
            <Link href="/associados" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar para associados
            </Link>
          </Button>
        </div>
      </div>

      <div className="container px-4 -mt-32 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar / Profile Card */}
          <div className="lg:col-span-4">
            <div className="bg-card rounded-xl shadow-lg border overflow-hidden sticky top-24">
              <div className="p-6 flex flex-col items-center text-center">
                <div className="relative h-40 w-40 rounded-full border-4 border-background shadow-md overflow-hidden mb-4">
                  <Image
                    src={associate.avatar_url || "https://github.com/shadcn.png"}
                    alt={associate.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <h1 className="text-2xl font-bold text-primary font-serif mb-2">{associate.name}</h1>
                <div className="flex items-center text-muted-foreground text-sm mb-6 bg-muted/50 px-3 py-1 rounded-full">
                  <MapPin className="h-3 w-3 mr-1" />
                  {associate.location}
                </div>

                <div className="w-full grid grid-cols-2 gap-4 border-t pt-6">
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-primary">{products.length}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Produtos</span>
                  </div>
                  <div className="text-center border-l">
                    <span className="block text-2xl font-bold text-primary">
                      {new Date(associate.created_at || Date.now()).getFullYear()}
                    </span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Membro desde</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-10 pt-4 lg:pt-12">
            {/* Bio Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 bg-primary rounded-full" />
                <h2 className="text-2xl font-bold">Sobre o Produtor</h2>
              </div>
              <div className="prose prose-lg prose-gray max-w-none bg-card p-8 rounded-xl border shadow-sm">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {associate.bio || "Nenhuma biografia disponível."}
                </p>
              </div>
            </section>

            {/* Products Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 bg-primary rounded-full" />
                <h2 className="text-2xl font-bold">Produtos Disponíveis</h2>
              </div>
              
              {products.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {products.map((product: any) => (
                    <Link key={product.id} href={`/produtos/${product.id}`} className="group">
                      <div className="bg-card rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300 flex flex-row h-32">
                        <div className="relative w-32 shrink-0">
                          <Image
                            src={product.image_url || "https://images.unsplash.com/photo-1506617420156-8e4536971650?w=800&q=80"}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
                          <div>
                            <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {product.description}
                            </p>
                          </div>
                          <div className="flex items-center text-xs font-medium text-primary mt-2">
                            Ver detalhes <ArrowLeft className="h-3 w-3 ml-1 rotate-180" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-muted/30 rounded-xl border-2 border-dashed">
                  <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-30" />
                  <p className="text-muted-foreground font-medium">Nenhum produto cadastrado.</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
