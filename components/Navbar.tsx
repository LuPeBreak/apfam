import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, Sprout } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/produtos", label: "Produtos" },
    { href: "/associados", label: "Associados" },
    { href: "/eventos", label: "Eventos" },
    { href: "/contato", label: "Contato" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-primary shadow-md">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-white p-2.5 rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-300">
              <Sprout className="h-6 w-6 text-primary" />
            </div>
            <span className="text-2xl font-bold text-primary-foreground tracking-tight">APFAM</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-primary-foreground/90 transition-colors hover:text-white hover:bg-white/10 px-3 py-2 rounded-md"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild className="bg-white text-primary hover:bg-white/90 font-semibold shadow-sm">
            <Link href="/contato">Torne-se um Associado</Link>
          </Button>
        </nav>

        {/* Mobile Nav */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/10 hover:text-white">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="border-l-primary/20 bg-primary text-primary-foreground">
            <nav className="flex flex-col gap-4 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium text-primary-foreground/90 hover:text-white hover:bg-white/10 px-4 py-3 rounded-md transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild className="mt-4 bg-white text-primary hover:bg-white/90 font-semibold w-full">
                <Link href="/contato">Torne-se um Associado</Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
