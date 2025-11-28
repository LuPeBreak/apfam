export const siteConfig = {
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "adilsonrezende@uol.com.br",
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "552433415591",
    whatsapp: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || "5524998198120",
    address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || "Estrada da Granja n 40, Santa Rita de Cássia, Barra Mansa/RJ - CEP 27322-410",
  },
  email: {
    host: process.env.EMAIL_HOST || "smtp.mailtrap.io",
    port: parseInt(process.env.EMAIL_PORT || "2525"),
    user: process.env.EMAIL_USER || "placeholder_user",
    pass: process.env.EMAIL_PASS || "placeholder_pass",
    from: process.env.EMAIL_FROM || "noreply@apfam.com",
  }
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
