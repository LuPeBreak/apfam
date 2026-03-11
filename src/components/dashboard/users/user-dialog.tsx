"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";

const userSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
  isAdmin: z.boolean().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDialog({ open, onOpenChange }: UserDialogProps) {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      isAdmin: false,
    },
  });

  // Reseta ao fechar
  if (!open && control._formValues.name) {
    setTimeout(() => reset(), 200);
  }

  async function onSubmit(data: UserFormData) {
    const { error } = await authClient.admin.createUser({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.isAdmin ? "admin" : "user",
    });

    if (error) {
      toast.error(error.message || "Erro ao criar usuário.");
      return;
    }

    toast.success("Usuário criado com sucesso!");
    onOpenChange(false);
    reset();
    router.refresh(); // Refresh a lista
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
        </DialogHeader>

        <form
          id="user-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 py-4"
        >
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Nome *</FieldLabel>
                <Input
                  {...field}
                  disabled={isSubmitting}
                  placeholder="Nome completo"
                />
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
                <FieldLabel>Email *</FieldLabel>
                <Input
                  type="email"
                  {...field}
                  disabled={isSubmitting}
                  placeholder="usuario@email.com"
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
                <FieldLabel>Senha Temporária *</FieldLabel>
                <Input
                  type="password"
                  {...field}
                  disabled={isSubmitting}
                  placeholder="Mínimo 8 caracteres"
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />

          <Controller
            name="isAdmin"
            control={control}
            render={({ field }) => (
              <Field className="flex flex-row items-center gap-2 space-y-0 pt-2">
                <Checkbox
                  id="isAdmin"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                />
                <div className="space-y-1 leading-none">
                  <label
                    htmlFor="isAdmin"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    Privilégios de Administrador
                  </label>
                  <FieldDescription>
                    Concede acesso total ao painel
                  </FieldDescription>
                </div>
              </Field>
            )}
          />
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" form="user-form" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 mr-2 animate-spin" />}
            Criar Usuário
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
