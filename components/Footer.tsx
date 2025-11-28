import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig, formatPhoneNumber } from "@/lib/config";

export function Footer() {
  return (
    <footer className="bg-muted py-12 text-muted-foreground">
      <div className="container grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4">APFAM</h3>
          <p className="text-sm leading-relaxed">
            Associação dos Produtores Familiares de Santa Rita e Região.
            <br />
            &quot;Sempre ao lado do produtor ajudando no seu crescimento&quot;
          </p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4">Contato</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="h-5 w-5 shrink-0 text-primary" />
              <span>
                {siteConfig.contact.address}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-5 w-5 shrink-0 text-primary" />
              <span>
                {formatPhoneNumber(siteConfig.contact.phone)} / {formatPhoneNumber(siteConfig.contact.whatsapp)}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-5 w-5 shrink-0 text-primary" />
              <span>{siteConfig.contact.email}</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4">Redes Sociais</h3>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">
              <Facebook className="h-6 w-6" />
              <span className="sr-only">Facebook</span>
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              <Instagram className="h-6 w-6" />
              <span className="sr-only">Instagram</span>
            </a>
          </div>
        </div>
      </div>
      <div className="container mt-8 border-t pt-8 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} APFAM. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
