"use server";

import { withPermissions } from "@/lib/auth/with-permissions";
import { prisma } from "@/lib/prisma";

export const getAssociates = withPermissions(
  [{ resource: "associate", action: ["list"] }],
  async (_session) => {
    return prisma.associate.findMany({
      orderBy: { name: "asc" },
    });
  },
);
