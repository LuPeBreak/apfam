"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { submitContactForm } from "@/actions/contact/submit-contact";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type ContactFormData, contactSchema } from "@/lib/validations/contact";

export function ContactForm() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      website: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await submitContactForm(data);

      if (response?.error) {
        toast.error(response.error);
        return;
      }

      toast.success(
        "Mensagem enviada com sucesso! Entraremos em contato em breve.",
      );
      reset();
    } catch (error) {
      console.error("Erro inesperado no formulário:", error);
      toast.error("Erro ao enviar mensagem. Tente novamente.");
    }
  };

  return (
    <form
      id="contact-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
      aria-labelledby="form-title"
    >
      <h2 id="form-title" className="sr-only">
        Formulário de Contato
      </h2>

      {/* HONEYPOT - DO NOT REMOVE */}
      <Controller
        name="website"
        control={control}
        render={({ field }) => (
          <div className="sr-only opacity-0 absolute -z-50 pointer-events-none">
            <label htmlFor="website">Website</label>
            <input
              type="text"
              id="website"
              autoComplete="off"
              tabIndex={-1}
              {...field}
            />
          </div>
        )}
      />

      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="name">Nome Completo</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    id="name"
                    placeholder="Como gostaria de ser chamado?"
                    disabled={isSubmitting}
                    autoComplete="name"
                  />
                </FieldContent>
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="email">E-mail para Contato</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    disabled={isSubmitting}
                    autoComplete="email"
                  />
                </FieldContent>
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        </div>

        <Controller
          name="subject"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="subject">Assunto</FieldLabel>
              <FieldContent>
                <Input
                  {...field}
                  id="subject"
                  placeholder="Sobre o que você deseja falar?"
                  disabled={isSubmitting}
                />
              </FieldContent>
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        <Controller
          name="message"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="message">Sua Mensagem</FieldLabel>
              <FieldContent>
                <Textarea
                  {...field}
                  id="message"
                  placeholder="Escreva aqui sua dúvida, sugestão ou elogio..."
                  className="min-h-[160px]"
                  disabled={isSubmitting}
                />
              </FieldContent>
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full md:w-auto h-12 px-8 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        {isSubmitting ? (
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
