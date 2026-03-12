"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { DataTable } from "@/components/dashboard/data-table";
import {
  getUserColumns,
  type UserRow,
} from "@/components/dashboard/users/user-columns";
import { UserDialog } from "@/components/dashboard/users/user-dialog";
import { Button } from "@/components/ui/button";
// Poderiamos extrair os modais em componentes pequenos, mas deixaremos a UI enxuta aqui
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";

interface UsersTableProps {
  data: UserRow[];
  currentUserId: string;
}

const passwordSchema = z.object({
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export function UsersTable({ data, currentUserId }: UsersTableProps) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);

  // States for Ban toggle
  const [banOpen, setBanOpen] = useState(false);
  const [selectedForBan, setSelectedForBan] = useState<UserRow | null>(null);
  const [isBanning, setIsBanning] = useState(false);

  // States for Password Reset
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [selectedForPassword, setSelectedForPassword] =
    useState<UserRow | null>(null);

  // States for Edit
  const [editOpen, setEditOpen] = useState(false);
  const [selectedForEdit, setSelectedForEdit] = useState<UserRow | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting: isUpdatingPassword },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  function handleBanToggle(user: UserRow) {
    setSelectedForBan(user);
    setBanOpen(true);
  }

  function handlePasswordToggle(user: UserRow) {
    setSelectedForPassword(user);
    setPasswordOpen(true);
    reset();
  }

  function handleEditToggle(user: UserRow) {
    setSelectedForEdit(user);
    setEditOpen(true);
  }

  async function confirmBanToggle() {
    if (!selectedForBan) return;
    setIsBanning(true);

    try {
      if (selectedForBan.banned) {
        const { error } = await authClient.admin.unbanUser({
          userId: selectedForBan.id,
        });
        if (error) throw error;
        toast.success("Usuário desbanido e reativado.");
      } else {
        const { error } = await authClient.admin.banUser({
          userId: selectedForBan.id,
        });
        if (error) throw error;
        toast.success("Usuário banido e desconectado da plataforma.");
      }
      setBanOpen(false);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao alterar status.";
      toast.error(message);
    } finally {
      setIsBanning(false);
    }
  }

  async function onPasswordSubmit(data: PasswordFormData) {
    if (!selectedForPassword) return;

    try {
      const { error } = await authClient.admin.setUserPassword({
        userId: selectedForPassword.id,
        newPassword: data.password,
      });

      if (error) throw error;

      toast.success("Senha atualizada com sucesso.");
      setPasswordOpen(false);
      reset();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao atualizar a senha.";
      toast.error(message);
    }
  }

  const columns = getUserColumns({
    currentUserId,
    onBanToggle: handleBanToggle,
    onChangePassword: handlePasswordToggle,
    onEdit: handleEditToggle,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Usuários</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Administração de acessos (Admin Only)
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedForEdit(null);
            setCreateOpen(true);
          }}
        >
          <Plus className="size-4 mr-2" />
          Novo usuário
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data}
        searchPlaceholder="Buscar por nome..."
        searchColumn="name"
      />

      <UserDialog open={createOpen} onOpenChange={setCreateOpen} />

      <UserDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setTimeout(() => setSelectedForEdit(null), 200);
        }}
        userToEdit={selectedForEdit}
      />

      {/* Ban / Unban Dialog */}
      <Dialog open={banOpen} onOpenChange={setBanOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedForBan?.banned ? "Desbanir Usuário" : "Banir Usuário"}
            </DialogTitle>
            <DialogDescription>
              {selectedForBan?.banned
                ? `Tem certeza que deseja reativar o acesso de ${selectedForBan?.name}?`
                : `Tem certeza que deseja banir ${selectedForBan?.name}? Esta ação invalidará imediatamente as sessões ativas do usuário.`}
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
              variant={selectedForBan?.banned ? "default" : "destructive"}
              onClick={confirmBanToggle}
              disabled={isBanning}
            >
              {selectedForBan?.banned ? "Reativar Acesso" : "Banir Usuário"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Reset Dialog */}
      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Senha</DialogTitle>
            <DialogDescription>
              Defina uma nova senha para {selectedForPassword?.name}.
            </DialogDescription>
          </DialogHeader>

          <form
            id="password-form"
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
                    placeholder="Mínimo 8 caracteres"
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
              type="button"
              variant="outline"
              onClick={() => setPasswordOpen(false)}
              disabled={isUpdatingPassword}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form="password-form"
              disabled={isUpdatingPassword}
            >
              {isUpdatingPassword && (
                <Loader2 className="size-4 mr-2 animate-spin" />
              )}
              Salvar Nova Senha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
