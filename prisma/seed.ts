import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { auth } from "../src/lib/auth/auth";
import { PrismaClient } from "../src/lib/prisma/generated/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando seed de produção...");

  // 1. Limpeza total do banco de dados (ordem respeitando as foreign keys)
  console.log("  → Limpando tabelas...");
  await prisma.associateProduct.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.associate.deleteMany();
  await prisma.event.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Limpeza de tabelas do Better Auth
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();

  // 2. Criar Admin Inicial a partir do ENV
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
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
      "  ℹ ADMIN_EMAIL ou ADMIN_PASSWORD não definidos no .env, pulando criação de admin.",
    );
  }

  console.log("✅ Seed de produção concluído!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
