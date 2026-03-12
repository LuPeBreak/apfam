"use server";

import { prisma } from "@/lib/prisma";

export async function getPublicAssociates({
  limit = 100,
  search,
  productSlug,
}: {
  limit?: number;
  search?: string;
  productSlug?: string;
} = {}) {
  try {
    const associates = await prisma.associate.findMany({
      where: {
        ...(productSlug
          ? {
              products: {
                some: {
                  product: {
                    slug: productSlug,
                  },
                },
              },
            }
          : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { bio: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return associates;
  } catch (error) {
    console.error("Error fetching public associates:", error);
    return [];
  }
}
