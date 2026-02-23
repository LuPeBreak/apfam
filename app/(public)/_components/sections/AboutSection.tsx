
"use client";

import { motion } from "framer-motion";

export function AboutSection() {
  return (
    <section className="py-24 bg-background">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container px-4 text-center max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-primary tracking-tight">Sobre a Associação</h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            A Associação dos Produtores Familiares de Santa Rita e Região (APFAM)
            foi fundada com o objetivo de fortalecer a agricultura familiar,
            promovendo a união dos produtores e oferecendo suporte técnico,
            logístico e comercial. Trabalhamos para garantir que o homem do campo
            tenha condições dignas de trabalho e que seus produtos cheguem com
            qualidade à mesa do consumidor.
          </p>
        </motion.div>
      </section>
  );
}
