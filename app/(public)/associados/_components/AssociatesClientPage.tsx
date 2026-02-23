"use client";

import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Search, ArrowLeft } from "lucide-react";

import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import Link from "next/link";
import { Associate } from "@/types";
import { PageHeader } from "@/components/custom/page-header";
import { SearchContainer } from "@/components/custom/search-container";

interface AssociatesClientPageProps {
  initialAssociates: Associate[];
}

export default function AssociatesClientPage({ initialAssociates }: AssociatesClientPageProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAssociates = initialAssociates.filter((associate) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      associate.name.toLowerCase().includes(searchLower) ||
      associate.products.some((p) => p.name.toLowerCase().includes(searchLower)) ||
      associate.location?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50/50">
      <PageHeader
        title="Nossos Associados"
        description="Conheça as famílias e produtores que fazem parte da nossa história e levam qualidade à sua mesa."
        imageSrc="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?q=80&w=2940&auto=format&fit=crop"
        height="h-[300px]"
      />

      <div className="container py-8 px-4 relative z-10">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <SearchContainer>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, produto ou local..."
                className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </SearchContainer>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssociates.map((associate) => (
            <Link key={associate.id} href={`/associados/${associate.slug}`} className="block group h-full">
              <Card className="h-full overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card flex flex-col">
                <div className="relative h-56 w-full overflow-hidden">
                  <ImageWithFallback
                    src={associate.avatarUrl}
                    fallbackType="associate"
                    name={associate.name}
                    alt={associate.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center text-xs font-medium bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full w-fit mb-2">
                      <MapPin className="h-3 w-3 mr-1" />
                      {associate.location}
                    </div>
                  </div>
                </div>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <CardTitle className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors font-serif tracking-tight">
                      {associate.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {associate.bio}
                    </p>
                  </div>
  
                  <div className="mt-auto space-y-4">
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                        Destaques da Produção
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {associate.products.slice(0, 3).map((product) => (
                          <span 
                            key={product.id}
                            className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/5 text-primary text-xs font-medium border border-primary/10"
                          >
                            {product.name}
                          </span>
                        ))}
                        {associate.products.length > 3 && (
                          <span className="text-xs text-muted-foreground self-center font-medium pl-1">
                            +{associate.products.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Ver perfil completo</span>
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <ArrowLeft className="h-4 w-4 rotate-180" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredAssociates.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Nenhum associado encontrado para &quot;{searchTerm}&quot;.
          </div>
        )}
    </div>
    </div>
  </div>
  );
}
