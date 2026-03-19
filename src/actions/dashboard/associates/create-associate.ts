"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { withPermissions } from "@/lib/auth/with-permissions";
import { saveImage } from "@/lib/file-upload/save-image";
import { prisma } from "@/lib/prisma";
import { associateSchema } from "@/lib/validations/associate";

export const createAssociate = withPermissions(
  [{ resource: "associate", action: ["create"] }],
  async (_session, formData: unknown) => {
    try {
      const parsed = associateSchema.safeParse(formData);
      if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors };
      }

      const { avatarUrl, ...data } = parsed.data;
      const slug = slugify(data.name, { lower: true, strict: true });

      let finalAvatarUrl = null;
      if (avatarUrl instanceof File) {
        finalAvatarUrl = await saveImage(avatarUrl, "associates", slug);
      }

      await prisma.associate.create({
        data: {
          ...data,
          slug,
          avatarUrl: finalAvatarUrl,
        },
      });
      revalidatePath("/dashboard/associados");

      return { success: true };
    } catch (error) {
      console.error("Erro ao criar associado:", error);
      return {
        error:
          (error as Error).message ||
          "Não foi possível salvar o associado no momento.",
      };
    }
  },
);
