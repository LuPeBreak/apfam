"use server";

import { prisma } from "@/lib/prisma";

export async function getPublicAssociates({
  limit = 100,
  search,
}: {
  limit?: number;
  search?: string;
} = {}) {
  try {
    const associates = await prisma.associate.findMany({
      where: {
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
