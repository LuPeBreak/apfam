import { supabase } from "@/lib/supabase";
import { ProductWithCategoriesAndAssociates } from "@/types/supabase-custom";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageCircle, Mail, User } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { Card, CardContent } from "@/components/ui/card";
import { ProducerList } from "@/components/custom/producer-list";

export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      product_categories (
        categories (
          name
        )
      ),
      associate_products (
        associates (
          id,
          name,
          location,
          avatar_url
        )
      )
    `)
    .eq('id', id)
    .single();

  if (error || !product) {
    notFound();
  }

  // Cast to ensure type safety for joined tables
  const typedProduct = product as unknown as ProductWithCategoriesAndAssociates;

  const categoryNames = typedProduct.product_categories.map((pc) => pc.categories.name);
  const associates = typedProduct.associate_products.map((ap) => ap.associates);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Banner */}
      <div className="relative h-[300px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2940&auto=format&fit=crop"
          alt="Farm background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container px-4">
            <Button variant="outline" asChild className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white backdrop-blur-sm">
              <Link href="/produtos" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar para o catálogo
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-12 px-4 -mt-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        {/* Product Image */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-lg bg-muted">
          <ImageWithFallback
            src={product.image_url}
            fallbackType="product"
            alt={product.name}
            fill
            className="object-cover"
            priority
            iconClassName="h-32 w-32"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-8">
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {categoryNames.map((cat: string) => (
                <Badge key={cat} variant="secondary" className="text-sm px-3 py-1">
                  {cat}
                </Badge>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">{product.name}</h1>
            
            {associates.length > 0 ? (
              <ProducerList associates={associates} />
            ) : (
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 border border-transparent">
                <div className="relative h-10 w-10 rounded-full overflow-hidden border bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Produzido por</p>
                  <p className="font-medium">Comunidade APFAM</p>
                </div>
              </div>
            )}
          </div>

          <div className="prose prose-gray max-w-none">
            <h3 className="text-xl font-semibold mb-2">Sobre o Produto</h3>
            <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {product.description}
            </p>
          </div>

          <Card className="bg-muted/30 border-none">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg">Tenho Interesse</h3>
              <p className="text-muted-foreground text-sm">
                Entre em contato com a APFAM para verificar a disponibilidade e combinar a entrega.
              </p>
              <div className="grid gap-3">
                <Button asChild className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white h-12 text-lg">
                  <Link 
                    href={`https://wa.me/${siteConfig.contact.whatsapp}?text=Olá, tenho interesse no produto *${product.name}* ${
                      associates.length > 0 
                        ? `do(s) produtor(es) *${associates.map((a) => a.name).join(", ")}*` 
                        : "da APFAM"
                    } que vi no site.`}
                    target="_blank"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Falar no WhatsApp
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full h-12">
                  <Link href="/contato">
                    <Mail className="h-5 w-5 mr-2" />
                    Enviar Email
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
  );
}
