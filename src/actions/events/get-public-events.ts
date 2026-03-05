"use server";

import { prisma } from "@/lib/prisma";

export async function getPublicEvents({ limit = 3 }: { limit?: number } = {}) {
  try {
    const events = await prisma.event.findMany({
      where: {
        date: { gte: new Date() },
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
