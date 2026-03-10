"use server";

import { prisma } from "@/lib/prisma";

export async function getPublicEvents({
  limit = 100,
  search,
}: {
  limit?: number;
  search?: string;
} = {}) {
  try {
    const events = await prisma.event.findMany({
      where: {
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { location: { contains: search, mode: "insensitive" } },
              ],
            }
          : { date: { gte: new Date() } }),
      },
      take: limit,
      orderBy: { date: "asc" },
    });

    return events;
  } catch (error) {
    console.error("Error fetching public events:", error);
    return [];
  }
}
