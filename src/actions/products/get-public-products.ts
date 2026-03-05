"use server";

import { prisma } from "@/lib/prisma";

export async function getPublicProducts({
  limit = 4,
  search,
}: {
  limit?: number;
  search?: string;
} = {}) {
  try {
    const products = await prisma.product.findMany({
      where: {
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : { featured: true }), // Se não tiver busca, pega destaques
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
