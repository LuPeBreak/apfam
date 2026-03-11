"use server";

import { withPermissions } from "@/lib/auth/with-permissions";
import { prisma } from "@/lib/prisma";

export const getCategories = withPermissions(
  [{ resource: "category", action: ["list"] }],
  async (_session) => {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  },
);
