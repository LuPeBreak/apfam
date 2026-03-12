"use server";

import { prisma } from "@/lib/prisma";

export async function getPublicProductsList() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: { name: "asc" },
    });
    return products;
  } catch (error) {
    console.error("Error fetching public products list:", error);
    return [];
  }
}
