import nodemailer from "nodemailer";
import { env } from "@/lib/env";

export const mailer = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  secure: env.EMAIL_PORT === 465,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

export async function sendContactEmail({
  name,
  email,
  subject: userSubject,
  message,
}: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  const finalSubject = userSubject
    ? `Novo Contato APFAM [${userSubject}]: ${name}`
    : `Novo Contato APFAM: ${name}`;

  return await mailer.sendMail({
    from: `"${name}" <${env.EMAIL_USER}>`,
    to: env.NEXT_PUBLIC_CONTACT_EMAIL,
    replyTo: email,
    subject: finalSubject,
    text: `Nome: ${name}\nEmail: ${email}\nAssunto: ${userSubject || "Não informado"}\n\nMensagem:\n${message}`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
        <h2 style="color: #166534; border-bottom: 2px solid #f0fdf4; padding-bottom: 10px;">Novo Contato — Site APFAM</h2>
        <p>Você recebeu uma nova mensagem através do formulário de contato do site.</p>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Nome:</strong> ${name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0;"><strong>Assunto:</strong> ${userSubject || "Não informado"}</p>
        </div>

        <p><strong>Mensagem:</strong></p>
        <div style="white-space: pre-wrap; background: #fff; border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px;">
          ${message}
        </div>
        
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
        <p style="font-size: 12px; color: #6b7280; text-align: center;">Este é um e-mail automático gerado pelo sistema APFAM v2.</p>
      </div>
    `,
  });
}
