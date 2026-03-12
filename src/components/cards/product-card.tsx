import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import type { ProductModel } from "@/types/models";

export function ProductCard({ product }: { product: ProductModel }) {
  return (
    <Card className="h-full overflow-hidden group border-border/50 hover:border-primary/50 transition-colors bg-card hover:shadow-lg flex flex-col">
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
        <Link
          href={`/produtos/${product.slug}`}
          className="absolute inset-0 z-0"
        >
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <ImagePlaceholder
              name={product.name}
              className="absolute inset-0"
              textClassName="text-4xl"
            />
          )}
        </Link>

        {/* Badges de Categoria flutuando na imagem */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
          {product.categories.map((c) => (
            <Link
              key={c.category.name}
              href={`/produtos?category=${c.category.slug}`}
            >
              <Badge className="bg-secondary hover:bg-secondary/80 text-secondary-foreground border-none transition-colors">
                {c.category.name}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* Informações do Produto */}
      <Link href={`/produtos/${product.slug}`} className="flex-1 flex flex-col">
        <CardContent className="flex-1 p-5 flex flex-col">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
              {product.description}
            </p>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
