import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { env } from "../env";
import { PrismaClient } from "./generated/client";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export { prisma };
