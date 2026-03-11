"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { withPermissions } from "@/lib/auth/with-permissions";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations/category";

export const createCategory = withPermissions(
  [{ resource: "category", action: ["create"] }],
  async (_session, formData: unknown) => {
    const parsed = categorySchema.safeParse(formData);
    if (!parsed.success) {
      return { error: parsed.error.flatten().fieldErrors };
    }

    const { name } = parsed.data;
    const slug = slugify(name, { lower: true, strict: true });

    await prisma.category.create({ data: { name, slug } });
    revalidatePath("/dashboard/categorias");

    return { success: true };
  },
);
