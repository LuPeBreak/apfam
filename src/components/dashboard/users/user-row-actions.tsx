"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Key, Loader2, Pencil, ShieldAlert, ShieldOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";
import { RowActionsButton } from "../row-actions-button";
import type { UserRow } from "./user-columns";

const passwordSchema = z.object({
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

type PasswordFormData = z.infer<typeof passwordSchema>;

interface UserRowActionsProps {
  user: UserRow;
  currentUserId: string;
  onEdit: (user: UserRow) => void;
}

export function UserRowActions({
  user,
  currentUserId,
  onEdit,
}: UserRowActionsProps) {
  const router = useRouter();
  const [banOpen, setBanOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [isBanning, setIsBanning] = useState(false);

  const isSelf = user.id === currentUserId;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting: isUpdatingPassword },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "" },
  });

  async function confirmBanToggle() {
    setIsBanning(true);
    try {
      if (user.banned) {
        const { error } = await authClient.admin.unbanUser({ userId: user.id });
        if (error) throw error;
        toast.success("Usuário desbanido e reativado.");
      } else {
        const { error } = await authClient.admin.banUser({ userId: user.id });
        if (error) throw error;
        toast.success("Usuário banido e desconectado da plataforma.");
      }
      setBanOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao alterar status.",
      );
    } finally {
      setIsBanning(false);
    }
  }

  async function onPasswordSubmit(data: PasswordFormData) {
    try {
      const { error } = await authClient.admin.setUserPassword({
        userId: user.id,
        newPassword: data.password,
      });
      if (error) throw error;
      toast.success("Senha atualizada com sucesso.");
      setPasswordOpen(false);
      reset();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao atualizar senha.",
      );
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <RowActionsButton />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(user)}>
            <Pencil className="size-4 mr-2" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setPasswordOpen(true);
              reset();
            }}
          >
            <Key className="size-4 mr-2" />
            Alterar Senha
          </DropdownMenuItem>
          {!isSelf && (
            <DropdownMenuItem
              onClick={() => setBanOpen(true)}
              className={
                user.banned
                  ? "text-green-600 focus:text-green-600"
                  : "text-destructive focus:text-destructive"
              }
            >
              {user.banned ? (
                <>
                  <ShieldAlert className="size-4 mr-2" />
                  Desbanir
                </>
              ) : (
                <>
                  <ShieldOff className="size-4 mr-2" />
                  Banir
                </>
              )}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={banOpen} onOpenChange={setBanOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {user.banned ? "Desbanir Usuário" : "Banir Usuário"}
            </DialogTitle>
            <DialogDescription>
              {user.banned
                ? `Tem certeza que deseja reativar o acesso de ${user.name}?`
                : `Tem certeza que deseja banir ${user.name}? Esta ação invalidará imediatamente as sessões ativas.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBanOpen(false)}
              disabled={isBanning}
            >
              Cancelar
            </Button>
            <Button
              variant={user.banned ? "default" : "destructive"}
              onClick={confirmBanToggle}
              disabled={isBanning}
            >
              {user.banned ? "Reativar" : "Banir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Senha</DialogTitle>
            <DialogDescription>
              Defina uma nova senha para {user.name}.
            </DialogDescription>
          </DialogHeader>
          <form
            id={`pass-form-${user.id}`}
            onSubmit={handleSubmit(onPasswordSubmit)}
            className="py-4"
          >
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Nova Senha *</FieldLabel>
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
          </form>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPasswordOpen(false)}
              disabled={isUpdatingPassword}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form={`pass-form-${user.id}`}
              disabled={isUpdatingPassword}
            >
              {isUpdatingPassword && (
                <Loader2 className="size-4 mr-2 animate-spin" />
              )}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
