import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { auth } from "../src/lib/auth/auth";
import { PrismaClient } from "../src/lib/prisma/generated/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando seed...");

  // 1. Criar Admin Inicial a partir do ENV (se não existir)
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: process.env.ADMIN_EMAIL },
    });

    if (!existingAdmin) {
      console.log(`  → Criando admin inicial (${process.env.ADMIN_EMAIL})...`);
      await auth.api.createUser({
        body: {
          name: "Administrador",
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD,
          role: "admin",
        },
      });
      console.log(`  ✓ Admin criado com sucesso: ${process.env.ADMIN_EMAIL}`);
    } else {
      console.log(
        `  ℹ Admin já existe: ${process.env.ADMIN_EMAIL}, pulando criação.`,
      );
    }
  } else {
    console.log(
      "  ℹ ADMIN_EMAIL ou ADMIN_PASSWORD não definidos no .env, pulando criação de admin.",
    );
  }

  console.log("✅ Seed concluído!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
