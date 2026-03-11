"use server";

import { withPermissions } from "@/lib/auth/with-permissions";
import { prisma } from "@/lib/prisma";

export const getUsers = withPermissions(
  [{ resource: "user", action: ["list"] }],
  async (_session) => {
    if (_session.user.role !== "admin") {
      throw new Error("Acesso negado");
    }

    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        banned: true,
        createdAt: true,
      },
    });
  },
);
