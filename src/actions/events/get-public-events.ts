"use server";

import { prisma } from "@/lib/prisma";

export async function getPublicEvents({
  limit,
  search,
}: {
  limit?: number;
  search?: string;
} = {}) {
  try {
    const events = await prisma.event.findMany({
      where: {
        date: search ? undefined : { gte: new Date() }, // Se buscar pelo nome, mostra eventos passados tbm (opcional), mas vamos manter futuro ou ignorar?
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { location: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
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
