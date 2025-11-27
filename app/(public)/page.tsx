"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_ASSOCIATES, MOCK_EVENTS } from "@/data/mocks";
import { ArrowRight, Users, Sprout, Truck } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  const recentEvents = MOCK_EVENTS.slice(0, 3);
  const featuredAssociates = MOCK_ASSOCIATES.slice(0, 4);

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
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop"
            alt="Paisagem rural"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 container text-center space-y-8 px-4"
        >
          <div className="inline-block p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
            <Sprout className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter drop-shadow-lg">
            APFAM
          </h1>
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

      {/* About Section */}
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

      {/* Services Section */}
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

      {/* Events Preview */}
      <section className="py-24 bg-background">
        <div className="container px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight mb-2">Próximos Eventos</h2>
              <p className="text-muted-foreground">Participe das nossas atividades</p>
            </div>
            <Button variant="outline" asChild className="hidden md:flex">
              <Link href="/eventos" className="flex items-center gap-2">
                Ver todos <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {recentEvents.map((event) => (
              <motion.div key={event.id} variants={itemVariants}>
                <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-300 border-none shadow-md group">
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={event.imageUrl || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop"}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold text-primary shadow-sm">
                      {new Date(event.date).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-xl group-hover:text-primary transition-colors">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">{event.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" asChild className="w-full">
              <Link href="/eventos">Ver todos os eventos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Associates Preview */}
      <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight mb-4">Nossos Associados</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Conheça quem faz a diferença no campo e traz qualidade para sua mesa
            </p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
          >
            {featuredAssociates.map((associate) => (
              <motion.div key={associate.id} variants={itemVariants}>
                <Link href="/associados" className="group block h-full">
                  <Card className="h-full border-none shadow-md hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 bg-card">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="relative h-32 w-32 rounded-full overflow-hidden mb-6 border-4 border-primary/10 group-hover:border-primary/30 transition-colors">
                        <Image
                          src={associate.avatarUrl}
                          alt={associate.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                        {associate.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">{associate.location}</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {associate.products.slice(0, 2).map((p) => (
                          <span key={p.id} className="text-xs bg-secondary/30 text-secondary-foreground px-2.5 py-1 rounded-full font-medium">
                            {p.name}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/associados" className="flex items-center gap-2">
                Conheça todos os produtores <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
