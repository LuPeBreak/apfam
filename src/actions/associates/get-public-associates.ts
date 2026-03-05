"use server";

import { prisma } from "@/lib/prisma";

export async function getPublicAssociates({
  limit = 4,
}: {
  limit?: number;
} = {}) {
  try {
    const associates = await prisma.associate.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return associates;
  } catch (error) {
    console.error("Error fetching public associates:", error);
    return [];
  }
}
