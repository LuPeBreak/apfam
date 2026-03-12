"use server";

import { prisma } from "@/lib/prisma";

export async function getPublicProducts({
  limit = 100,
  search,
  featuredOnly = false,
  categorySlug,
}: {
  limit?: number;
  search?: string;
  featuredOnly?: boolean;
  categorySlug?: string;
} = {}) {
  try {
    const products = await prisma.product.findMany({
      where: {
        ...(featuredOnly ? { featured: true } : {}),
        ...(categorySlug
          ? {
              categories: {
                some: {
                  category: {
                    slug: categorySlug,
                  },
                },
              },
            }
          : {}),
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
