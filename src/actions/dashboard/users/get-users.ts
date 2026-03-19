"use server";

import { withPermissions } from "@/lib/auth/with-permissions";
import { prisma } from "@/lib/prisma";

export const getUsers = withPermissions(
  [{ resource: "user", action: ["list"] }],
  async () => {
    try {
      const users = await prisma.user.findMany({
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
      return users;
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return { error: "Não foi possível carregar a lista de usuários." };
    }
  },
);
