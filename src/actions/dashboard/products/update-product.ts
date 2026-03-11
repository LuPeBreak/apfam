"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { withPermissions } from "@/lib/auth/with-permissions";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations/product";

export const updateProduct = withPermissions(
  [{ resource: "product", action: ["update"] }],
  async (_session, id: string, formData: unknown) => {
    const parsed = productSchema.safeParse(formData);
    if (!parsed.success) {
      return { error: parsed.error.flatten().fieldErrors };
    }

    const { categoryIds, associateIds, ...data } = parsed.data;
    const slug = slugify(data.name, { lower: true, strict: true });

    const oldProd = await prisma.product.findUnique({ where: { id } });
    // Apaga imagem: quando foi trocada por outra OU foi removida (null)
    const imageChanged =
      oldProd?.imageUrl && oldProd.imageUrl !== data.imageUrl;
    if (imageChanged) {
      const { deleteImage } = await import("@/actions/dashboard/delete-image");
      await deleteImage(oldProd.imageUrl as string);
    }

    await prisma.product.update({
      where: { id },
      data: {
        ...data,
        slug,
        categories: {
          deleteMany: {},
          create: categoryIds.map((catId) => ({ categoryId: catId })),
        },
        associates: {
          deleteMany: {},
          create: associateIds
            ? associateIds.map((assocId) => ({ associateId: assocId }))
            : [],
        },
      },
    });

    revalidatePath("/dashboard/produtos");
    return { success: true };
  },
);
