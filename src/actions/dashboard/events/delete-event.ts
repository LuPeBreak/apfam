"use server";

import { revalidatePath } from "next/cache";
import { withPermissions } from "@/lib/auth/with-permissions";
import { removeImage } from "@/lib/file-upload/remove-image";
import { prisma } from "@/lib/prisma";

export const deleteEvent = withPermissions(
  [{ resource: "event", action: ["delete"] }],
  async (_session, id: string) => {
    const evt = await prisma.event.findUnique({ where: { id } });
    if (evt?.imageUrl) {
      await removeImage(evt.imageUrl);
    }

    await prisma.event.delete({ where: { id } });
    revalidatePath("/dashboard/eventos");
    return { success: true };
  },
);
