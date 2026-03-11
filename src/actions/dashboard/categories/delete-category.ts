"use server";

import { revalidatePath } from "next/cache";
import { withPermissions } from "@/lib/auth/with-permissions";
import { prisma } from "@/lib/prisma";

export const deleteCategory = withPermissions(
  [{ resource: "category", action: ["delete"] }],
  async (_session, id: string) => {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/dashboard/categorias");
    return { success: true };
  },
);
