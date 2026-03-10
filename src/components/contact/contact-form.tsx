"use client";

import { Loader2, Send } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { submitContactForm } from "@/actions/contact/submit-contact";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await submitContactForm(formData);
        toast.success(
          "Mensagem enviada com sucesso! Entraremos em contato em breve.",
        );
        const form = document.getElementById("contact-form") as HTMLFormElement;
        form.reset();
      } catch (error) {
        toast.error(
          (error as Error).message ||
            "Erro ao enviar mensagem. Tente novamente.",
        );
      }
    });
  }

  return (
    <form
      id="contact-form"
      action={handleSubmit}
      className="space-y-8"
      aria-labelledby="form-title"
    >
      <h2 id="form-title" className="sr-only">
        Formulário de Contato
      </h2>

      {/* HONEYPOT - DO NOT REMOVE */}
      <div className="sr-only opacity-0 absolute -z-50 pointer-events-none">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field>
            <FieldLabel htmlFor="name">Nome Completo</FieldLabel>
            <FieldContent>
              <Input
                id="name"
                name="name"
                placeholder="Como gostaria de ser chamado?"
                required
                disabled={isPending}
                autoComplete="name"
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="email">E-mail para Contato</FieldLabel>
            <FieldContent>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="seu@email.com"
                required
                disabled={isPending}
                autoComplete="email"
              />
            </FieldContent>
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="subject">Assunto</FieldLabel>
          <FieldContent>
            <Input
              id="subject"
              name="subject"
              placeholder="Sobre o que você deseja falar?"
              required
              disabled={isPending}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="message">Sua Mensagem</FieldLabel>
          <FieldContent>
            <Textarea
              id="message"
              name="message"
              placeholder="Escreva aqui sua dúvida, sugestão ou elogio..."
              className="min-h-[160px]"
              required
              disabled={isPending}
            />
          </FieldContent>
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        size="lg"
        disabled={isPending}
        className="w-full md:w-auto h-12 px-8 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" aria-hidden="true" />
            Enviar Mensagem
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground/60 mt-4 leading-relaxed">
        Ao enviar esta mensagem, você concorda que possamos entrar em contato
        via e-mail para responder à sua solicitação. Respeitamos sua
        privacidade.
      </p>
    </form>
  );
}
