"use server";

import { withPermissions } from "@/lib/auth/with-permissions";
import { prisma } from "@/lib/prisma";

export const getProducts = withPermissions(
  [{ resource: "product", action: ["list"] }],
  async (_session) => {
    return prisma.product.findMany({
      orderBy: { name: "asc" },
      include: {
        categories: { include: { category: true } },
        associates: { include: { associate: true } },
      },
    });
  },
);
