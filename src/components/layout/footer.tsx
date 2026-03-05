import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          {/* Col 1 */}
          <div className="space-y-4 md:col-span-1">
            <div className="relative w-32 h-10">
              <Image
                src="/apfam-branca.png"
                alt="Logotipo APFAM"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="text-secondary-foreground/80 leading-relaxed">
              Associação de Agricultores Familiares de Santa Rita de Cássia e
              Região. Levando o campo até a sua mesa com saúde e respeito à
              natureza.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-white">Navegação</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/sobre"
                  className="hover:text-white transition-colors"
                >
                  A Associação
                </Link>
              </li>
              <li>
                <Link
                  href="/produtos"
                  className="hover:text-white transition-colors"
                >
                  Produtos
                </Link>
              </li>
              <li>
                <Link
                  href="/eventos"
                  className="hover:text-white transition-colors"
                >
                  Feiras e Eventos
                </Link>
              </li>
              <li>
                <Link
                  href="/associados"
                  className="hover:text-white transition-colors"
                >
                  Produtores
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-white">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 shrink-0 text-white/70" />
                <span>
                  Estrada da Granja nº 40, Santa Rita de Cássia
                  <br />
                  Barra Mansa/RJ
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 shrink-0 text-white/70" />
                <span>(24) 3341-5591</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 shrink-0 text-white/70" />
                <span>contato@apfam.com.br</span>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-white">
              Redes Sociais
            </h4>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors text-white"
              >
                <Instagram className="w-5 h-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="/"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors text-white"
              >
                <Facebook className="w-5 h-5" />
                <span className="sr-only">Facebook</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-secondary-foreground/60">
          <p>© {currentYear} APFAM. Todos os direitos reservados.</p>
          <p>
            Desenvolvido por{" "}
            <Link
              href="https://www.idearagencia.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
            >
              IDEAR
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
