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
import { MultiSelect } from "@/components/ui/multi-select";
import { getProductsWithAssociates, MOCK_CATEGORIES } from "@/data/mocks";
import { Search, ShoppingBag, MessageCircle } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const allProducts = getProductsWithAssociates();
  // Use MOCK_CATEGORIES for the filter options to ensure all available categories are shown
  const categories = MOCK_CATEGORIES.map(c => c.name);

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategories.length === 0 || 
                            (product.categoryIds && product.categoryIds.some(id => selectedCategories.includes(id)));
    
    return matchesSearch && matchesCategory;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

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
                  options={MOCK_CATEGORIES.map(c => ({ label: c.name, value: c.id }))}
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
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
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
                  <div className="text-xs text-muted-foreground mb-1">
                    Produtor: <span className="font-medium text-primary">{product.associateName}</span>
                  </div>
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {product.description}
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full gap-2 group-hover:bg-primary/90">
                        <ShoppingBag className="h-4 w-4" />
                        Tenho Interesse
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Interesse em: {product.name}</DialogTitle>
                        <DialogDescription>
                          A APFAM intermedia a venda para garantir a qualidade. Escolha como deseja prosseguir.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="relative h-40 w-full rounded-md overflow-hidden">
                          <Image
                            src={product.imageUrl || ""}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Você será redirecionado para falar com nossa equipe sobre a disponibilidade e entrega deste produto do produtor <strong>{product.associateName}</strong>.
                        </p>
                      </div>
                      <div className="flex flex-col gap-3">
                        <Button asChild className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white">
                          <Link 
                            href={`https://wa.me/5524998198120?text=Olá, tenho interesse no produto *${product.name}* do produtor *${product.associateName}* que vi no site da APFAM.`}
                            target="_blank"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Falar no WhatsApp
                          </Link>
                        </Button>
                        <Button variant="outline" asChild className="w-full">
                          <Link href="/contato">
                            Enviar Email / Formulário
                          </Link>
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

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
