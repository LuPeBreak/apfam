"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { withPermissions } from "@/lib/auth/with-permissions";
import { prisma } from "@/lib/prisma";
import { associateSchema } from "@/lib/validations/associate";

export const updateAssociate = withPermissions(
  [{ resource: "associate", action: ["update"] }],
  async (_session, id: string, formData: unknown) => {
    const parsed = associateSchema.safeParse(formData);
    if (!parsed.success) {
      return { error: parsed.error.flatten().fieldErrors };
    }

    const data = parsed.data;
    const slug = slugify(data.name, { lower: true, strict: true });

    const oldAssoc = await prisma.associate.findUnique({ where: { id } });

    // Apaga imagem: quando foi trocada por outra OU foi removida (null)
    const imageChanged =
      oldAssoc?.avatarUrl && oldAssoc.avatarUrl !== data.avatarUrl;
    if (imageChanged) {
      const { deleteImage } = await import("@/actions/dashboard/delete-image");
      await deleteImage(oldAssoc.avatarUrl as string);
    }

    await prisma.associate.update({
      where: { id },
      data: {
        ...data,
        slug,
      },
    });
    revalidatePath("/dashboard/associados");

    return { success: true };
  },
);
