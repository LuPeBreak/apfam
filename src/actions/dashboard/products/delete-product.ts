"use server";

import { revalidatePath } from "next/cache";
import { withPermissions } from "@/lib/auth/with-permissions";
import { removeImage } from "@/lib/file-upload/remove-image";
import { prisma } from "@/lib/prisma";

export const deleteProduct = withPermissions(
  [{ resource: "product", action: ["delete"] }],
  async (_session, id: string) => {
    try {
      const prod = await prisma.product.findUnique({ where: { id } });
      if (prod?.imageUrl) {
        await removeImage(prod.imageUrl);
      }

      await prisma.product.delete({ where: { id } });
      revalidatePath("/dashboard/produtos");
      return { success: true };
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      return { error: "Não foi possível excluir o produto no momento." };
    }
  },
);
