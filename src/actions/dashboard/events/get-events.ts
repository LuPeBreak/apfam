"use server";

import { withPermissions } from "@/lib/auth/with-permissions";
import { prisma } from "@/lib/prisma";

export const getEvents = withPermissions(
  [{ resource: "event", action: ["list"] }],
  async (_session) => {
    return prisma.event.findMany({
      orderBy: { date: "desc" },
    });
  },
);
