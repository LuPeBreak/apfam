"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { UserRow } from "@/components/dashboard/users/user-columns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth/auth-client";

const userSchema = z
  .object({
    name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("E-mail inválido"),
    password: z.string().optional(), // Made optional for edit mode
    role: z.enum(["admin", "user"]),
  })
  .refine(
    (data) => {
      // If we're not editing (no existing user), password is required and must be long enough
      return data.password ? data.password.length >= 8 : true;
    },
    {
      message: "A senha deve ter no mínimo 8 caracteres",
      path: ["password"],
    },
  );

type UserFormData = z.infer<typeof userSchema>;

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userToEdit?: UserRow | null;
}

export function UserDialog({
  open,
  onOpenChange,
  userToEdit,
}: UserDialogProps) {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: userToEdit?.name || "",
      email: userToEdit?.email || "",
      password: "",
      role: (userToEdit?.role as "admin" | "user") || "user",
    },
  });

  // Reseta ao fechar ou ao mudar o usuário
  if (open && userToEdit && control._formValues.email !== userToEdit.email) {
    reset({
      name: userToEdit.name,
      email: userToEdit.email,
      password: "",
      role: (userToEdit.role as "admin" | "user") || "user",
    });
  } else if (!open && control._formValues.name) {
    setTimeout(
      () =>
        reset({
          name: "",
          email: "",
          password: "",
          role: "user",
        }),
      200,
    );
  }

  const isEditing = !!userToEdit;

  async function onSubmit(data: UserFormData) {
    let hasError = false;

    if (isEditing) {
      if (data.password && data.password.length < 8) {
        toast.error("A nova senha deve ter no mínimo 8 caracteres");
        return;
      }

      const { error } = await authClient.admin.updateUser({
        userId: userToEdit.id,
        data: {
          name: data.name,
          role: data.role,
        },
      });

      if (error) {
        toast.error(error.message || "Erro ao atualizar usuário.");
        hasError = true;
      } else {
        if (!hasError) toast.success("Usuário atualizado com sucesso!");
      }
    } else {
      if (!data.password || data.password.length < 8) {
        toast.error(
          "A senha deve ter no mínimo 8 caracteres para novos usuários",
        );
        return;
      }

      const { error } = await authClient.admin.createUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      if (error) {
        toast.error(error.message || "Erro ao criar usuário.");
        hasError = true;
      } else {
        toast.success("Usuário criado com sucesso!");
      }
    }

    if (!hasError) {
      onOpenChange(false);
      reset();
      router.refresh(); // Refresh a lista
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Usuário" : "Novo Usuário"}
          </DialogTitle>
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
                  disabled={isSubmitting || isEditing}
                  placeholder="usuario@email.com"
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />

          {!isEditing && (
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
          )}

          <Controller
            name="role"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Cargo *</FieldLabel>
                <Select
                  disabled={isSubmitting}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um nível de acesso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuário Padrão</SelectItem>
                    <SelectItem value="admin">
                      Administrador (Acesso Total)
                    </SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
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
            {isEditing ? "Salvar Alterações" : "Criar Usuário"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
