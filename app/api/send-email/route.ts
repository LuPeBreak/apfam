import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { siteConfig } from '@/lib/config';
import { env } from '@/lib/env';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, productionType, message, _honey } = body;

    // Honeypot check - if _honey is filled, it's a bot
    if (_honey) {
      console.log('Bot detected via honeypot');
      return NextResponse.json({ success: true }); // Fake success to confuse bots
    }

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando.' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido.' },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: env.EMAIL_PORT,
      secure: env.EMAIL_PORT === 465, // true for 465, false for other ports
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    });

    // Email template
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2E7D32;">Nova Mensagem de Contato - APFAM</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${phone}</p>
        <p><strong>Tipo de Produção/Interesse:</strong> ${productionType}</p>
        <hr />
        <h3>Mensagem:</h3>
        <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${message}</p>
        <hr />
        <p style="font-size: 12px; color: #666;">Este email foi enviado através do formulário de contato do site da APFAM.</p>
      </div>
    `;

    // Send email
    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to: siteConfig.contact.email, // Send to admin
      subject: `Novo Contato: ${name} - ${productionType}`,
      html: htmlContent,
      replyTo: email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar email. Tente novamente mais tarde.' },
      { status: 500 }
    );
  }
}
