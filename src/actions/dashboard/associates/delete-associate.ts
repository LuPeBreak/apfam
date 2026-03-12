"use server";

import { revalidatePath } from "next/cache";
import { withPermissions } from "@/lib/auth/with-permissions";
import { removeImage } from "@/lib/file-upload/remove-image";
import { prisma } from "@/lib/prisma";

export const deleteAssociate = withPermissions(
  [{ resource: "associate", action: ["delete"] }],
  async (_session, id: string) => {
    const assoc = await prisma.associate.findUnique({ where: { id } });
    if (assoc?.avatarUrl) {
      await removeImage(assoc.avatarUrl);
    }

    await prisma.associate.delete({ where: { id } });
    revalidatePath("/dashboard/associados");
    return { success: true };
  },
);
