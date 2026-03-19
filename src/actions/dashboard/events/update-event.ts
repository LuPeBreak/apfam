"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { withPermissions } from "@/lib/auth/with-permissions";
import { removeImage } from "@/lib/file-upload/remove-image";
import { saveImage } from "@/lib/file-upload/save-image";
import { prisma } from "@/lib/prisma";
import { eventSchema } from "@/lib/validations/event";

export const updateEvent = withPermissions(
  [{ resource: "event", action: ["update"] }],
  async (_session, id: string, formData: unknown) => {
    try {
      const parsed = eventSchema.safeParse(formData);
      if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors };
      }

      const { date, imageUrl, ...data } = parsed.data;
      const slug = slugify(data.name, { lower: true, strict: true });

      const oldEvent = await prisma.event.findUnique({ where: { id } });

      let finalImageUrl = null;

      if (imageUrl instanceof File) {
        // Nova imagem foi enviada
        finalImageUrl = await saveImage(imageUrl, "events", slug);
        if (oldEvent?.imageUrl) {
          await removeImage(oldEvent.imageUrl); // Limpa a velha
        }
      } else if (typeof imageUrl === "string") {
        // Mesma imagem mantida
        finalImageUrl = imageUrl;
      } else if (!imageUrl && oldEvent?.imageUrl) {
        // Usuário apagou a imagem, limpamos do server
        await removeImage(oldEvent.imageUrl);
      }

      await prisma.event.update({
        where: { id },
        data: {
          ...data,
          slug,
          imageUrl: finalImageUrl,
          date: new Date(date),
        },
      });

      revalidatePath("/dashboard/eventos");
      return { success: true };
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
      return {
        error:
          (error as Error).message ||
          "Não foi possível salvar as alterações no momento.",
      };
    }
  },
);
