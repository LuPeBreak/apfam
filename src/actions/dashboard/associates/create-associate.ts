"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { withPermissions } from "@/lib/auth/with-permissions";
import { prisma } from "@/lib/prisma";
import { associateSchema } from "@/lib/validations/associate";

export const createAssociate = withPermissions(
  [{ resource: "associate", action: ["create"] }],
  async (_session, formData: unknown) => {
    const parsed = associateSchema.safeParse(formData);
    if (!parsed.success) {
      return { error: parsed.error.flatten().fieldErrors };
    }

    const data = parsed.data;
    const slug = slugify(data.name, { lower: true, strict: true });

    await prisma.associate.create({
      data: {
        ...data,
        slug,
      },
    });
    revalidatePath("/dashboard/associados");

    return { success: true };
  },
);
