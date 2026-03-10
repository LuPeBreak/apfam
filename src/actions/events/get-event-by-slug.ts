"use server";

import { prisma } from "@/lib/prisma";

export async function getEventBySlug(slug: string) {
  if (!slug) return null;

  try {
    const event = await prisma.event.findUnique({
      where: {
        slug,
      },
    });

    return event;
  } catch (error) {
    console.error(`Error fetching event by slug ${slug}:`, error);
    return null;
  }
}
