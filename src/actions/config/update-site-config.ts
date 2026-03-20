"use server";

import { revalidatePath } from "next/cache";
import { withPermissions } from "@/lib/auth/with-permissions";
import { removeImage } from "@/lib/file-upload/remove-image";
import { saveImage } from "@/lib/file-upload/save-image";
import { prisma } from "@/lib/prisma";
import { SITE_CONFIG_FIELDS } from "@/lib/site-config";

export const updateSiteConfig = withPermissions(
  [{ resource: "site-config", action: ["update"] }],
  async (_, formData: FormData) => {
    const key = formData.get("key") as string;
    const value = formData.get("value");

    if (!key) {
      return { error: "Chave do config é obrigatória" };
    }

    // Validar se a key existe na definição
    let fieldType = "text";
    let fieldExists = false;
    for (const fields of Object.values(SITE_CONFIG_FIELDS)) {
      const field = Object.values(fields).find((f) => f.key === key);
      if (field) {
        fieldType = field.type;
        fieldExists = true;
        break;
      }
    }

    if (!fieldExists) {
      return { error: "Configuração inválida" };
    }

    let finalValue: string;

    if (value instanceof File) {
      try {
        finalValue = await saveImage(value, "config", key);
      } catch {
        return { error: "Erro ao salvar imagem" };
      }

      // Buscar imagem antiga para remover (só após salvar nova com sucesso)
      const oldConfig = await prisma.siteConfig.findUnique({ where: { key } });
      if (oldConfig?.value?.startsWith("/uploads/")) {
        try {
          await removeImage(oldConfig.value);
        } catch {
          // Silenciosamente ignora erro ao remover imagem antiga
        }
      }
    } else {
      finalValue = value as string;
    }

    await prisma.siteConfig.upsert({
      where: { key },
      update: { value: finalValue },
      create: { key, value: finalValue, type: fieldType },
    });

    revalidatePath("/");
    revalidatePath("/produtos");
    revalidatePath("/eventos");
    revalidatePath("/associados");
    return { success: true };
  },
);
