"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";

// Schemas
const profileSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "A senha atual é obrigatória"),
    newPassword: z
      .string()
      .min(8, "A nova senha deve ter no mínimo 8 caracteres"),
    confirmPassword: z.string().min(1, "A confirmação é obrigatória"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type ProfileData = z.infer<typeof profileSchema>;
type PasswordData = z.infer<typeof passwordSchema>;

interface ProfileFormsProps {
  initialName: string;
}

export function ProfileForms({ initialName }: ProfileFormsProps) {
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Form 1: Nome
  const { control: nameControl, handleSubmit: handleNameSubmit } =
    useForm<ProfileData>({
      resolver: zodResolver(profileSchema),
      defaultValues: { name: initialName },
    });

  // Form 2: Senha
  const {
    control: passControl,
    handleSubmit: handlePassSubmit,
    reset: resetPass,
  } = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmitName(data: ProfileData) {
    setIsUpdatingName(true);
    const { error } = await authClient.updateUser({
      name: data.name,
    });
    setIsUpdatingName(false);

    if (error) {
      toast.error(error.message || "Erro ao atualizar perfil");
      return;
    }
    toast.success("Perfil atualizado com sucesso!");
  }

  async function onSubmitPassword(data: PasswordData) {
    setIsUpdatingPassword(true);
    const { error } = await authClient.changePassword({
      newPassword: data.newPassword,
      currentPassword: data.currentPassword,
      revokeOtherSessions: true,
    });
    setIsUpdatingPassword(false);

    if (error) {
      toast.error(
        error.message || "Erro ao alterar senha. Verifique sua senha atual.",
      );
      return;
    }
    toast.success("Senha alterada com sucesso!");
    resetPass();
  }

  return (
    <div className="flex flex-col gap-10 max-w-2xl">
      {/* Dados Pessoais */}
      <section className="bg-card rounded-xl border p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-4 text-primary">
          Dados Pessoais
        </h3>
        <form
          onSubmit={handleNameSubmit(onSubmitName)}
          className="flex flex-col gap-4"
        >
          <Controller
            name="name"
            control={nameControl}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Nome completo</FieldLabel>
                <Input {...field} disabled={isUpdatingName} />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
          <div className="flex justify-end mt-2">
            <Button type="submit" disabled={isUpdatingName}>
              {isUpdatingName && (
                <Loader2 className="size-4 mr-2 animate-spin" />
              )}
              Salvar Alterações
            </Button>
          </div>
        </form>
      </section>

      {/* Alterar Senha */}
      <section className="bg-card rounded-xl border p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-4 text-primary">Segurança</h3>
        <form
          onSubmit={handlePassSubmit(onSubmitPassword)}
          className="flex flex-col gap-4"
        >
          <Controller
            name="currentPassword"
            control={passControl}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Senha Atual</FieldLabel>
                <Input
                  type="password"
                  {...field}
                  disabled={isUpdatingPassword}
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="newPassword"
              control={passControl}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Nova Senha</FieldLabel>
                  <Input
                    type="password"
                    {...field}
                    disabled={isUpdatingPassword}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
            <Controller
              name="confirmPassword"
              control={passControl}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Confirmar Nova Senha</FieldLabel>
                  <Input
                    type="password"
                    {...field}
                    disabled={isUpdatingPassword}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </div>
          <div className="flex justify-end mt-2">
            <Button
              type="submit"
              variant="default"
              disabled={isUpdatingPassword}
            >
              {isUpdatingPassword && (
                <Loader2 className="size-4 mr-2 animate-spin" />
              )}
              Atualizar Senha
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
