"use server";

import { prisma } from "@/lib/prisma";

export async function getProductBySlug(slug: string) {
  if (!slug) return null;

  try {
    const product = await prisma.product.findUnique({
      where: {
        slug,
      },
      include: {
        associates: {
          include: {
            associate: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return product;
  } catch (error) {
    console.error(`Error fetching product by slug ${slug}:`, error);
    return null;
  }
}
