"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MultiSelect } from "@/components/multi-select";
import { Search, ShoppingBag, MessageCircle } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Product, Category } from "@/types";
import { siteConfig } from "@/lib/config";

interface ProductsClientPageProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ProductsClientPage({ initialProducts, categories }: ProductsClientPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const filteredProducts = initialProducts.filter((product) => {
    const searchLower = searchTerm.toLowerCase().trim();
    
    const matchesSearch = !searchLower || 
                          product.name.toLowerCase().includes(searchLower) ||
                          (product.description && product.description.toLowerCase().includes(searchLower));
    
    const matchesCategory = selectedCategories.length === 0 || 
                            (product.categoryIds && product.categoryIds.some(id => selectedCategories.includes(id)));
    
    return matchesSearch && matchesCategory;
  });



  return (
    <div className="container py-12 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">Catálogo de Produtos</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Produtos frescos e artesanais, direto do produtor para sua mesa.
            Intermediamos o contato para garantir a melhor qualidade.
          </p>
        </div>

        {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-20 z-40 bg-background/95 backdrop-blur py-4 border-b">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="w-full md:w-72">
            <MultiSelect
                  options={categories.map(c => ({ label: c.name, value: c.id }))}
                  selected={selectedCategories}
                  onChange={setSelectedCategories}
                  placeholder="Filtrar por categorias..."
                />
              </div>
              {(searchTerm || selectedCategories.length > 0) && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategories([]);
                  }}
                  className="shrink-0"
                >
                  Limpar
                </Button>
              )}
            </div>
          </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <motion.div 
              key={product.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 group border-none shadow-md">
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={product.imageUrl || "https://images.unsplash.com/photo-1506617420156-8e4536971650?w=800&q=80"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <Badge className="absolute top-3 right-3 bg-white/90 text-primary hover:bg-white">
                    {product.categoryNames.join(", ")}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs font-normal">
                      {product.associateCount && product.associateCount > 0 
                        ? `${product.associateCount} ${product.associateCount === 1 ? 'produtor' : 'produtores'}`
                        : 'Disponível'}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {product.description}
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button asChild className="w-full group-hover:bg-primary/90">
                    <Link href={`/produtos/${product.id}`}>
                      Ver Detalhes
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">Nenhum produto encontrado</h3>
            <p className="text-muted-foreground">
              Tente buscar por outro termo ou categoria.
            </p>
            <Button 
              variant="link" 
              onClick={() => {setSearchTerm(""); setSelectedCategories([])}}
              className="mt-2"
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
