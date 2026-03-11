"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
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
import { authClient } from "@/lib/auth/auth-client";

interface UsersTableProps {
  data: UserRow[];
  currentUserId: string;
}

export function UsersTable({ data, currentUserId }: UsersTableProps) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);

  // States for Ban toggle
  const [banOpen, setBanOpen] = useState(false);
  const [selectedForBan, setSelectedForBan] = useState<UserRow | null>(null);
  const [isBanning, setIsBanning] = useState(false);

  function handleBanToggle(user: UserRow) {
    setSelectedForBan(user);
    setBanOpen(true);
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

  const columns = getUserColumns({
    currentUserId,
    onBanToggle: handleBanToggle,
    onChangePassword: () => {},
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
        <Button onClick={() => setCreateOpen(true)}>
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
    </div>
  );
}
