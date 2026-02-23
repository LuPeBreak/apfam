
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Sprout, Truck } from "lucide-react";
import { motion } from "framer-motion";

export function ServicesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-24 bg-muted/30">
        <div className="container px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight mb-4">Nossos Serviços</h2>
            <p className="text-muted-foreground text-lg">Como apoiamos o crescimento do produtor rural</p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { icon: Truck, title: "Distribuição", desc: "Apoio logístico para escoamento da produção e acesso a mercados." },
              { icon: Sprout, title: "Suporte Técnico", desc: "Consultoria agronômica e veterinária para melhoria da produtividade." },
              { icon: Users, title: "Capacitação", desc: "Cursos, palestras e dias de campo para atualização constante." }
            ].map((service, index) => (
              <motion.div key={index} variants={itemVariants} whileHover={{ y: -5 }} className="h-full">
                <Card className="h-full bg-card border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <CardHeader className="flex flex-col items-center text-center pb-4 pt-8">
                    <div className="p-4 rounded-2xl bg-primary/10 mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <service.icon className="h-10 w-10 text-primary group-hover:text-white transition-colors duration-300" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-muted-foreground px-8 pb-8">
                    {service.desc}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
  );
}
