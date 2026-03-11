"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { withPermissions } from "@/lib/auth/with-permissions";
import { prisma } from "@/lib/prisma";
import { eventSchema } from "@/lib/validations/event";

export const updateEvent = withPermissions(
  [{ resource: "event", action: ["update"] }],
  async (_session, id: string, formData: unknown) => {
    const parsed = eventSchema.safeParse(formData);
    if (!parsed.success) {
      return { error: parsed.error.flatten().fieldErrors };
    }

    const { date, ...data } = parsed.data;
    const slug = slugify(data.name, { lower: true, strict: true });

    const oldEvent = await prisma.event.findUnique({ where: { id } });
    // Apaga imagem: quando foi trocada por outra OU foi removida (null)
    const imageChanged =
      oldEvent?.imageUrl && oldEvent.imageUrl !== data.imageUrl;
    if (imageChanged) {
      const { deleteImage } = await import("@/actions/dashboard/delete-image");
      await deleteImage(oldEvent.imageUrl as string);
    }

    await prisma.event.update({
      where: { id },
      data: {
        ...data,
        slug,
        date: new Date(date),
      },
    });

    revalidatePath("/dashboard/eventos");
    return { success: true };
  },
);
