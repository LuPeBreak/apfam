"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { withPermissions } from "@/lib/auth/with-permissions";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations/product";

export const createProduct = withPermissions(
  [{ resource: "product", action: ["create"] }],
  async (_session, formData: unknown) => {
    const parsed = productSchema.safeParse(formData);
    if (!parsed.success) {
      return { error: parsed.error.flatten().fieldErrors };
    }

    const { categoryIds, associateIds, ...data } = parsed.data;
    const slug = slugify(data.name, { lower: true, strict: true });

    await prisma.product.create({
      data: {
        ...data,
        slug,
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
