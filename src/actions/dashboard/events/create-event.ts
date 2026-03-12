"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { withPermissions } from "@/lib/auth/with-permissions";
import { saveImage } from "@/lib/file-upload/save-image";
import { prisma } from "@/lib/prisma";
import { eventSchema } from "@/lib/validations/event";

export const createEvent = withPermissions(
  [{ resource: "event", action: ["create"] }],
  async (_session, formData: unknown) => {
    const parsed = eventSchema.safeParse(formData);
    if (!parsed.success) {
      return { error: parsed.error.flatten().fieldErrors };
    }

    const { date, imageUrl, ...data } = parsed.data;
    const slug = slugify(data.name, { lower: true, strict: true });

    let finalImageUrl = null;
    if (imageUrl instanceof File) {
      finalImageUrl = await saveImage(imageUrl, "events", slug);
    }

    await prisma.event.create({
      data: {
        ...data,
        slug,
        imageUrl: finalImageUrl,
        date: new Date(date),
      },
    });

    revalidatePath("/dashboard/eventos");
    return { success: true };
  },
);
