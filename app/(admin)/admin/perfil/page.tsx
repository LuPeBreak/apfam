"use client";

import { useEffect, useState } from "react";
import { ProfileForm, ProfileFormData } from "@/components/admin/forms/ProfileForm";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteImageFromStorage } from "@/lib/storage-utils";

import { User } from "@supabase/supabase-js";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        toast.error("Erro ao carregar perfil");
        return;
      }
      setUser(user);
      setLoading(false);
    }
    getUser();
  }, []);

  const handleSubmit = async (data: ProfileFormData) => {
    setSaving(true);
    try {
      const updates: { data: { full_name: string; avatar_url: string }; password?: string } = {
        data: {
          full_name: data.fullName,
          avatar_url: data.avatarUrl || "",
        }
      };

      if (data.password && data.password.length >= 6) {
        updates.password = data.password;
      }

      const { error } = await supabase.auth.updateUser(updates);

      if (error) throw error;

      // Delete old avatar if it was changed (even if new one is empty)
      if (user?.user_metadata?.avatar_url && data.avatarUrl !== user.user_metadata.avatar_url) {
        await deleteImageFromStorage(user.user_metadata.avatar_url);
      }

      toast.success("Perfil atualizado com sucesso!");
      router.refresh();
      
      // Update local state to reflect changes immediately if needed
      setUser((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          user_metadata: {
            ...prev.user_metadata,
            full_name: data.fullName,
            avatar_url: data.avatarUrl,
          }
        } as User;
      });

    } catch (error: unknown) {
      console.error("Error updating profile:", error);
      const message = error instanceof Error ? error.message : "Erro ao atualizar perfil";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Meu Perfil</h1>
        <p className="text-muted-foreground">Gerencie suas informações pessoais e senha.</p>
      </div>
      
      <div className="max-w-2xl bg-white p-6 rounded-xl shadow-sm border">
        <ProfileForm 
          onSubmit={handleSubmit} 
          initialData={{
            fullName: user?.user_metadata?.full_name || "",
            avatarUrl: user?.user_metadata?.avatar_url || "",
            email: user?.email || "",
          }}
          isLoading={saving}
        />
      </div>
    </div>
  );
}
