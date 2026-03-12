"use server";

import { prisma } from "@/lib/prisma";

export async function getPublicEvents({
  limit = 100,
  search,
  dateFilter = "future",
}: {
  limit?: number;
  search?: string;
  dateFilter?: "all" | "today" | "week" | "month" | "future" | string;
} = {}) {
  try {
    const now = new Date();

    // Configurando datas limites baseadas no timezone UTC para bater com DB
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const endOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    );

    const endOfWeek = new Date(startOfToday);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    let dateCondition:
      | import("@/lib/prisma/generated/client").Prisma.DateTimeFilter
      | undefined;
    if (dateFilter === "future") {
      dateCondition = { gte: now };
    } else if (dateFilter === "today") {
      dateCondition = { gte: startOfToday, lte: endOfToday };
    } else if (dateFilter === "week") {
      dateCondition = { gte: startOfToday, lte: endOfWeek };
    } else if (dateFilter === "month") {
      dateCondition = { gte: startOfMonth, lte: endOfMonth };
    } else if (dateFilter === "all") {
      // Sem filtro de data
      dateCondition = undefined;
    } else if (dateFilter?.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // Filtro por data específica (YYYY-MM-DD)
      const specificDate = new Date(`${dateFilter}T00:00:00`);
      const nextDay = new Date(specificDate);
      nextDay.setDate(specificDate.getDate() + 1);
      dateCondition = { gte: specificDate, lt: nextDay };
    } else {
      dateCondition = { gte: now }; // default
    }

    const events = await prisma.event.findMany({
      where: {
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { location: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(dateCondition ? { date: dateCondition } : {}),
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
