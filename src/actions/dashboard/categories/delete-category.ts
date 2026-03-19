"use server";

import { revalidatePath } from "next/cache";
import { withPermissions } from "@/lib/auth/with-permissions";
import { prisma } from "@/lib/prisma";

export const deleteCategory = withPermissions(
  [{ resource: "category", action: ["delete"] }],
  async (_session, id: string) => {
    try {
      await prisma.category.delete({ where: { id } });
      revalidatePath("/dashboard/categorias");
      return { success: true };
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
      return {
        error:
          "Não foi possível excluir a categoria. Verifique se existem produtos vinculados a ela.",
      };
    }
  },
);
