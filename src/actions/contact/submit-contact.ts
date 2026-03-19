"use server";

import { sendContactEmail } from "@/lib/mail";
import { type ContactFormData, contactSchema } from "@/lib/validations/contact";

export async function submitContactForm(data: ContactFormData) {
  const result = contactSchema.safeParse(data);

  if (!result.success) {
    const error = result.error.issues[0];
    return { error: error.message };
  }

  const { name, email, subject, message, website } = result.data;

  // Anti-Bot Security: If honeypot is filled, silent reject
  if (website) {
    console.log("Comentário ignorado. Bot detectado via Honeypot.");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true };
  }

  try {
    await sendContactEmail({
      name,
      email,
      subject,
      message,
    });
    console.log("Mensagem de contato enviada com sucesso!");
    return { success: true };
  } catch (error) {
    console.error("Erro ao processar formulário de contato:", error);
    return {
      error:
        "Não foi possível enviar sua mensagem no momento. Tente novamente mais tarde.",
    };
  }
}
