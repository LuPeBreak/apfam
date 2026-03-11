import {
  Camera,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import Image from "next/image";
import { ContactForm } from "@/components/contact/contact-form";
import { env } from "@/lib/env";
import { formatPhoneNumber } from "@/lib/utils";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary/20" />
        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
          <Image
            src="/images/hero-bg.webp"
            alt="Farm background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-transparent" />

        <div className="relative z-20 text-center px-4 max-w-3xl mt-12">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
            <Send className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-4 tracking-tight">
            Fale Conosco
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground text-balance">
            Tem dúvidas sobre nossos produtos, interesse em se associar, ou quer
            visitar nossa feira? Estamos à disposição.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl pb-24 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 bg-card rounded-[2.5rem] border border-border shadow-2xl overflow-hidden">
          {/* Left Column: Contact Info */}
          <div className="lg:col-span-5 bg-primary text-primary-foreground p-10 md:p-14 flex flex-col relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -mt-24 -mr-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-80 h-80 bg-black/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2">Informações</h2>
              <p className="text-primary-foreground/80 mb-12">
                Nossa equipe está pronta para te atender. Escolha o melhor
                canal.
              </p>

              <div className="space-y-8 mb-12">
                <div className="flex items-start group">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-4 shrink-0 group-hover:bg-white/20 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="pt-1">
                    <p className="text-sm font-medium text-primary-foreground/70 uppercase tracking-wider mb-1">
                      Telefone / Web
                    </p>
                    <p className="text-lg font-semibold">
                      {formatPhoneNumber(env.NEXT_PUBLIC_CONTACT_PHONE)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-4 shrink-0 group-hover:bg-white/20 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="pt-1">
                    <p className="text-sm font-medium text-primary-foreground/70 uppercase tracking-wider mb-1">
                      E-mail
                    </p>
                    <p className="text-lg font-semibold">
                      {env.NEXT_PUBLIC_CONTACT_EMAIL}
                    </p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-4 shrink-0 group-hover:bg-white/20 transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="pt-1">
                    <p className="text-sm font-medium text-primary-foreground/70 uppercase tracking-wider mb-1">
                      Endereço Sede
                    </p>
                    <p className="text-lg font-semibold leading-snug whitespace-pre-line">
                      {env.NEXT_PUBLIC_CONTACT_ADDRESS}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media Footer */}
              <div className="mt-auto pt-8">
                <p className="text-sm font-medium text-primary-foreground/70 uppercase tracking-wider mb-4">
                  Nossas Redes
                </p>
                <div className="flex space-x-4">
                  <a
                    href="/"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-primary transition-all shadow-sm"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href="/"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-primary transition-all shadow-sm"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href="/"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-primary transition-all shadow-sm"
                  >
                    <Camera className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7 p-10 md:p-14 bg-card">
            <h2 className="text-2xl font-bold mb-8 text-foreground">
              Envie uma mensagem
            </h2>

            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
}
