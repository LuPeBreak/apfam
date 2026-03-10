"use server";

import { sendContactEmail } from "@/lib/mail";
import { contactSchema } from "@/lib/validations/contact";

export async function submitContactForm(formData: FormData) {
  const rawFields = {
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    website: formData.get("website"),
  };

  const result = contactSchema.safeParse(rawFields);

  if (!result.success) {
    const error = result.error.issues[0];
    throw new Error(error.message);
  }

  const { name, email, subject, message, website } = result.data;

  // Anti-Bot Security: If honeypot is filled, silent reject
  if (website) {
    console.log("Comentário ignorado. Bot detectado via Honeypot.");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return;
  }

  try {
    await sendContactEmail({
      name,
      email,
      subject,
      message,
    });
    console.log("Mensagem de contato enviada com sucesso!");
  } catch (error) {
    console.error("Erro ao processar formulário de contato:", error);
    throw new Error(
      "Não foi possível enviar sua mensagem no momento. Tente novamente mais tarde.",
    );
  }
}
