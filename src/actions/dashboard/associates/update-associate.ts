"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { withPermissions } from "@/lib/auth/with-permissions";
import { removeImage } from "@/lib/file-upload/remove-image";
import { saveImage } from "@/lib/file-upload/save-image";
import { prisma } from "@/lib/prisma";
import { associateSchema } from "@/lib/validations/associate";

export const updateAssociate = withPermissions(
  [{ resource: "associate", action: ["update"] }],
  async (_session, id: string, formData: unknown) => {
    try {
      const parsed = associateSchema.safeParse(formData);
      if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors };
      }

      const { avatarUrl, ...data } = parsed.data;
      const slug = slugify(data.name, { lower: true, strict: true });

      const oldAssociate = await prisma.associate.findUnique({ where: { id } });

      let finalAvatarUrl = null;

      if (avatarUrl instanceof File) {
        finalAvatarUrl = await saveImage(avatarUrl, "associates", slug);
        if (oldAssociate?.avatarUrl) {
          await removeImage(oldAssociate.avatarUrl);
        }
      } else if (typeof avatarUrl === "string") {
        finalAvatarUrl = avatarUrl;
      } else if (!avatarUrl && oldAssociate?.avatarUrl) {
        await removeImage(oldAssociate.avatarUrl);
      }

      await prisma.associate.update({
        where: { id },
        data: {
          ...data,
          slug,
          avatarUrl: finalAvatarUrl,
        },
      });

      revalidatePath("/dashboard/associados");

      return { success: true };
    } catch (error) {
      console.error("Erro ao atualizar associado:", error);
      return {
        error:
          (error as Error).message ||
          "Não foi possível salvar as alterações no momento.",
      };
    }
  },
);
