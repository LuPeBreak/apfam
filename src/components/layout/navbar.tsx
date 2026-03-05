"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "A Associação", href: "/sobre" },
  { name: "Produtos", href: "/produtos" },
  { name: "Eventos", href: "/eventos" },
  { name: "Produtores Associados", href: "/associados" },
  { name: "Contato", href: "/contato" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  // Se estamos na home, a navbar começa transparente e fica verde com o scroll.
  // Em outras páginas, a navbar é sempre verde no topo.
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on init
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isTransparent = isHome && !scrolled;

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 h-20 transition-all duration-300",
        isTransparent
          ? "bg-transparent text-white"
          : "bg-primary text-primary-foreground shadow-md",
      )}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* Logo */}
          <div className="relative w-32 h-10">
            <Image
              src="/apfam-branca.png"
              alt="Logotipo oficial da APFAM - Associação de Produtores Familiares"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                "hover:bg-white/10 hover:text-white",
                pathname === link.href && !isTransparent && "bg-black/10",
                pathname === link.href && isTransparent && "bg-white/20",
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* CTA (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            asChild
            className={cn(
              "px-6 hover:-translate-y-1 transition-transform",
              "bg-white text-primary hover:bg-white/90 font-bold",
            )}
          >
            <Link href="/contato">Quero ser Associado</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  isTransparent
                    ? "text-white hover:bg-white/10"
                    : "text-primary-foreground hover:bg-white/10",
                )}
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-primary text-primary-foreground border-l-primary-foreground/20"
            >
              <SheetTitle className="text-white">APFAM</SheetTitle>
              <SheetDescription className="sr-only">
                Navegação do portal da APFAM
              </SheetDescription>
              <nav className="flex flex-col gap-4 mt-8">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium px-4 py-2 hover:bg-white/10 rounded-md transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  href="/contato"
                  className="text-lg font-bold px-4 py-3 bg-white text-primary text-center rounded-md transition-colors mt-6 shadow-lg"
                >
                  Quero ser Associado
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
