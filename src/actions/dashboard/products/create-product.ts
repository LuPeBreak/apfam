"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { withPermissions } from "@/lib/auth/with-permissions";
import { saveImage } from "@/lib/file-upload/save-image";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations/product";

export const createProduct = withPermissions(
  [{ resource: "product", action: ["create"] }],
  async (_session, formData: unknown) => {
    const parsed = productSchema.safeParse(formData);
    if (!parsed.success) {
      return { error: parsed.error.flatten().fieldErrors };
    }

    const { categoryIds, associateIds, imageUrl, ...data } = parsed.data;
    const slug = slugify(data.name, { lower: true, strict: true });

    let finalImageUrl = null;
    if (imageUrl instanceof File) {
      finalImageUrl = await saveImage(imageUrl, "products", slug);
    }

    await prisma.product.create({
      data: {
        ...data,
        slug,
        imageUrl: finalImageUrl,
        categories: {
          create: categoryIds.map((id) => ({ categoryId: id })),
        },
        associates:
          associateIds && associateIds.length > 0
            ? { create: associateIds.map((id) => ({ associateId: id })) }
            : undefined,
      },
    });

    revalidatePath("/dashboard/produtos");
    return { success: true };
  },
);
