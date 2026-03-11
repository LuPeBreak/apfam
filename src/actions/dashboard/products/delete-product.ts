"use server";

import { revalidatePath } from "next/cache";
import { withPermissions } from "@/lib/auth/with-permissions";
import { prisma } from "@/lib/prisma";

export const deleteProduct = withPermissions(
  [{ resource: "product", action: ["delete"] }],
  async (_session, id: string) => {
    const prod = await prisma.product.findUnique({ where: { id } });
    if (prod?.imageUrl) {
      const { deleteImage } = await import("@/actions/dashboard/delete-image");
      await deleteImage(prod.imageUrl);
    }

    await prisma.product.delete({ where: { id } });
    revalidatePath("/dashboard/produtos");
    return { success: true };
  },
);
