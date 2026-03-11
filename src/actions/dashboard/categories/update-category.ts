"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { withPermissions } from "@/lib/auth/with-permissions";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations/category";

export const updateCategory = withPermissions(
  [{ resource: "category", action: ["update"] }],
  async (_session, id: string, formData: unknown) => {
    const parsed = categorySchema.safeParse(formData);
    if (!parsed.success) {
      return { error: parsed.error.flatten().fieldErrors };
    }

    const { name } = parsed.data;
    const slug = slugify(name, { lower: true, strict: true });

    await prisma.category.update({ where: { id }, data: { name, slug } });
    revalidatePath("/dashboard/categorias");

    return { success: true };
  },
);
