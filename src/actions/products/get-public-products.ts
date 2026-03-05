"use server";

import { prisma } from "@/lib/prisma";

export async function getPublicProducts({
  limit = 4,
}: {
  limit?: number;
} = {}) {
  try {
    const products = await prisma.product.findMany({
      where: { featured: true },
      take: limit,
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return products;
  } catch (error) {
    console.error("Error fetching public products:", error);
    return [];
  }
}
