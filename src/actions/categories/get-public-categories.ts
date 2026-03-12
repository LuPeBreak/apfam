"use server";

import { prisma } from "@/lib/prisma";

export async function getPublicCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return categories;
  } catch (error) {
    console.error("Error fetching public categories:", error);
    return [];
  }
}
