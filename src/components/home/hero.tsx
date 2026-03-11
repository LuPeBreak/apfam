"use client";

import { motion } from "framer-motion";
import { ArrowRight, Leaf } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Imagem de Fundo Otimizada via next/image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.webp"
          alt="Paisagem agrícola"
          fill
          priority
          className="object-cover"
        />
        {/* Overlay Dark/Gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-background via-black/50 to-black/70 mix-blend-multiply" />
      </div>

      <div className="container relative z-10 mx-auto px-4 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium">
            <Leaf className="w-4 h-4 text-primary" />
            <span>Do campo direto para a sua mesa</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
            Alimento <span className="text-primary-foreground">Puro</span>,{" "}
            <br className="hidden md:block" />
            Cultivo com{" "}
            <span className="text-primary-foreground">Tradição</span>.
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl leading-relaxed">
            A APFAM conecta você aos melhores produtos da agricultura familiar
            de Santa Rita de Cássia e região. Frescor, qualidade e respeito à
            natureza.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button
              size="lg"
              className="rounded-full px-8 h-14 text-base hover:-translate-y-1 transition-transform"
              asChild
            >
              <Link href="/produtos">
                Conhecer Produtos <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 h-14 text-base bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:text-white hover:-translate-y-1 transition-transform"
              asChild
            >
              <Link href="/sobre">Sobre a Associação</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Onda/Divisor na base apontando para o grid branco/bege do app */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-linear-to-t from-background to-transparent z-10 pointer-events-none" />
    </section>
  );
}
