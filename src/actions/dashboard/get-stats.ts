"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/login");
  }

  const [products, events, associates, categories] = await Promise.all([
    prisma.product.count(),
    prisma.event.count(),
    prisma.associate.count(),
    prisma.category.count(),
  ]);

  return { products, events, associates, categories };
}
