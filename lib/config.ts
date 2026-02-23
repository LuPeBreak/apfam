import { env } from "./env";

export const siteConfig = {
  contact: {
    email: env.NEXT_PUBLIC_CONTACT_EMAIL || "contato@apfam.com.br",
    phone: env.NEXT_PUBLIC_CONTACT_PHONE || "552433415591",
    whatsapp: env.NEXT_PUBLIC_CONTACT_WHATSAPP || "5524998198120",
    address: env.NEXT_PUBLIC_CONTACT_ADDRESS || "Estrada da Granja n 40, Santa Rita de Cássia, Barra Mansa/RJ - CEP 27322-410",
  },
  // Email config moved to lib/server-config.ts for security
};

export function formatPhoneNumber(phone: string): string {
  // Removes country code 55 if present for display, or just formats generic 10/11 digit numbers
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})?(\d{2})(\d{4,5})(\d{4})$/);
  
  if (match) {
    // match[2] is DDD, match[3] is first part, match[4] is second part
    return `(${match[2]}) ${match[3]}-${match[4]}`;
  }
  
  return phone;
}
