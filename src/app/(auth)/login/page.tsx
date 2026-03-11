"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";

const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "Email ou senha incorretos.",
  USER_BANNED: "Sua conta foi banida. Entre em contato com o administrador.",
  EMAIL_NOT_VERIFIED: "Confirme seu email antes de fazer login.",
  TOO_MANY_REQUESTS:
    "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
  INVALID_PASSWORD: "Senha incorreta.",
  USER_NOT_FOUND: "Email ou senha incorretos.",
};

function getErrorMessage(code?: string, fallback?: string): string {
  if (code && AUTH_ERROR_MESSAGES[code]) {
    return AUTH_ERROR_MESSAGES[code];
  }
  return fallback ?? "Ocorreu um erro ao fazer login. Tente novamente.";
}

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    await authClient.signIn.email(
      { email: data.email, password: data.password },
      {
        onSuccess: () => {
          toast.success("Login realizado com sucesso!");
          router.push("/dashboard");
        },
        onError: (ctx) => {
          const message = getErrorMessage(ctx.error.code, ctx.error.message);
          toast.error(message);
          setIsLoading(false);
        },
      },
    );
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-background">
      {/* Botão voltar */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Voltar para o site
      </Link>

      <div className="w-full max-w-md flex flex-col items-center gap-8">
        {/* Logo */}
        <Image
          src="/apfam-verde.png"
          alt="APFAM"
          width={160}
          height={64}
          className="object-contain"
          priority
        />

        {/* Card do formulário */}
        <div className="w-full rounded-xl border bg-card shadow-sm px-8 py-10 flex flex-col gap-6">
          <div className="flex flex-col gap-1 text-center">
            <h1 className="text-2xl font-bold text-foreground">
              Acesso ao painel
            </h1>
            <p className="text-sm text-muted-foreground">
              Entre com suas credenciais para continuar
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    {...field}
                    type="email"
                    placeholder="seu@email.com"
                    autoComplete="email"
                    disabled={isLoading}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Senha</FieldLabel>
                  <Input
                    {...field}
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
            >
              {isLoading && <Loader2 className="size-4 animate-spin" />}
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
