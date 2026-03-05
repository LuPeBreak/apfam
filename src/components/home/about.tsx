"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const benefits = [
  "Qualidade direto da terra",
  "Apoio à economia local",
  "Cultivo com respeito ao meio ambiente",
  "Sem atravessadores",
];

export function About() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Lado Esquerdo - Imagem/Ilustração */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative"
          >
            <div className="aspect-square md:aspect-4/5 rounded-3xl overflow-hidden relative">
              {/* 
                  Imagem de agricultor colhendo/segurando caixa de vegetais 
                  Vamos usar unsplash de placeholder 
                */}
              <Image
                src="/images/about-farmer.jpg"
                alt="Produtor rural da APFAM segurando uma caixa com diversas verduras e legumes frescos, colhidos diretamente do campo."
                width={800}
                height={1000}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-primary/30 to-transparent mix-blend-multiply" />
            </div>

            {/* Badge Flutuante */}
            <div className="absolute -bottom-6 -right-6 md:-right-10 bg-white dark:bg-card p-6 rounded-2xl shadow-xl border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <span className="font-bold text-xl">25+</span>
                </div>
                <div>
                  <p className="font-bold text-foreground">Famílias</p>
                  <p className="text-sm text-muted-foreground">
                    Produtoras associadas
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Lado Direito - Conteúdo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col items-start"
          >
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-secondary/10 text-secondary text-sm font-semibold tracking-wide">
              NOSSA HISTÓRIA
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Semeando o <span className="text-primary">futuro</span>,
              cultivando a <span className="text-secondary">tradição</span>.
            </h2>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              A APFAM nasceu da união de trabalhadores rurais de Santa Rita de
              Cássia e região com um objetivo comum: fortalecer a agricultura
              familiar, promover a sustentabilidade e levar comida de verdade
              para a mesa das pessoas.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-10 w-full">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-foreground font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            <Button asChild size="lg" className="rounded-full px-8 h-14 group">
              <Link href="/sobre">
                Conheça Nossa Trajetória
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
