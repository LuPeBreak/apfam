import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageCircle, Mail, MapPin, User } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { Card, CardContent } from "@/components/ui/card";

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categoryNames = product.product_categories.map((pc: any) => pc.categories.name);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const associate = product.associate_products[0]?.associates;

  return (
    <div className="container py-12 px-4 min-h-screen">
      <Button variant="ghost" asChild className="mb-8 hover:bg-transparent hover:text-primary pl-0">
        <Link href="/produtos" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar para o catálogo
        </Link>
      </Button>

      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Product Image */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-lg bg-muted">
          <Image
            src={product.image_url || "https://images.unsplash.com/photo-1506617420156-8e4536971650?w=800&q=80"}
            alt={product.name}
            fill
            className="object-cover"
            priority
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
            
            {associate && (
              <Link href={`/associados/${associate.id}`} className="inline-flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group">
                <div className="relative h-10 w-10 rounded-full overflow-hidden border">
                  <Image 
                    src={associate.avatar_url || "https://github.com/shadcn.png"} 
                    alt={associate.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Produzido por</p>
                  <p className="font-medium group-hover:text-primary transition-colors">{associate.name}</p>
                </div>
              </Link>
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
                    href={`https://wa.me/${siteConfig.contact.whatsapp}?text=Olá, tenho interesse no produto *${product.name}* do produtor *${associate?.name}* que vi no site da APFAM.`}
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
  );
}
