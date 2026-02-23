
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop"
            alt="Paisagem rural"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-background" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 container text-center space-y-8 px-4"
        >
          <div className="inline-block mb-4 relative h-32 w-64 md:h-48 md:w-96 drop-shadow-lg">
            <Image src="/apfam-branca.png" alt="APFAM Logo" fill className="object-contain" priority />
          </div>
          <p className="text-xl md:text-3xl font-light max-w-2xl mx-auto text-gray-100 drop-shadow-md leading-relaxed">
            &quot;Sempre ao lado do produtor ajudando no seu crescimento&quot;
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-6 h-auto rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <Link href="/contato">Torne-se um Associado</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 text-lg px-8 py-6 h-auto rounded-full">
              <Link href="/produtos">Conheça os Produtos</Link>
            </Button>
          </div>
        </motion.div>
      </section>
  );
}
