"use server";

import { withPermissions } from "@/lib/auth/with-permissions";
import { prisma } from "@/lib/prisma";

export const getDashboardStats = withPermissions([], async (_session) => {
  const [products, events, associates, categories] = await Promise.all([
    prisma.product.count(),
    prisma.event.count(),
    prisma.associate.count(),
    prisma.category.count(),
  ]);

  return { products, events, associates, categories };
});
