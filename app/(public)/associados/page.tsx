"use client";

import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MOCK_ASSOCIATES } from "@/data/mocks";
import { MapPin, Search } from "lucide-react";
import Image from "next/image";

export default function AssociatesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAssociates = MOCK_ASSOCIATES.filter((associate) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      associate.name.toLowerCase().includes(searchLower) ||
      associate.products.some((p) => p.name.toLowerCase().includes(searchLower)) ||
      associate.location?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="container py-12 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">Nossos Associados</h1>
          <p className="text-muted-foreground text-lg">
            Conheça os produtores que fazem parte da nossa família e seus produtos de qualidade.
          </p>
        </div>

        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, produto ou local..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredAssociates.map((associate) => (
            <Card key={associate.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                  <div className="relative h-24 w-24 shrink-0 rounded-full overflow-hidden border-2 border-primary/20">
                    <Image
                      src={associate.avatarUrl}
                      alt={associate.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <div>
                      <CardTitle className="text-xl mb-1">{associate.name}</CardTitle>
                      {associate.location && (
                        <div className="flex items-center justify-center sm:justify-start gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{associate.location}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {associate.bio}
                    </p>
                    <div className="pt-2">
                      <p className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">Principais Produtos:</p>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                        {associate.products.map((p) => (
                          <span
                            key={p.id}
                            className="text-xs bg-secondary/30 text-secondary-foreground px-2 py-1 rounded-md border border-secondary/50"
                          >
                            {p.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAssociates.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Nenhum associado encontrado para &quot;{searchTerm}&quot;.
          </div>
        )}
      </div>
    </div>
  );
}
