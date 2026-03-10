"use server";

import { prisma } from "@/lib/prisma";

export async function getPublicProducts({
  limit = 100,
  search,
  featuredOnly = false,
}: {
  limit?: number;
  search?: string;
  featuredOnly?: boolean;
} = {}) {
  try {
    const products = await prisma.product.findMany({
      where: {
        ...(featuredOnly ? { featured: true } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
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
