import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import type { ProductModel } from "@/types/models";

export function ProductCard({ product }: { product: ProductModel }) {
  return (
    <Card className="h-full overflow-hidden group border-border/50 hover:border-primary/50 transition-colors bg-card hover:shadow-lg">
      <Link href={`/produtos/${product.slug}`} className="h-full flex flex-col">
        <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
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

          {/* Badges de Categoria flutuando na imagem */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {product.categories.map((c) => (
              <Badge
                key={c.category.name}
                className="bg-secondary hover:bg-secondary text-secondary-foreground border-none"
              >
                {c.category.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Informações do Produto */}
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
