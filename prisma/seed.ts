import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import slugify from "slugify";
import { auth } from "../src/lib/auth/auth";
import { PrismaClient } from "../src/lib/prisma/generated/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function toSlug(text: string): string {
  return slugify(text, { lower: true, strict: true, locale: "pt" });
}

async function main() {
  console.log("🌱 Iniciando seed...");

  // ── Limpar tabelas de negócio (mantém dados de auth) ──────────────────────
  await prisma.associateProduct.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.associate.deleteMany();
  await prisma.event.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // ── Categorias ───────────────────────────────────────────────────────────
  console.log("  → Criando categorias...");

  const [laticinios, verduras, processados] = await Promise.all([
    prisma.category.create({
      data: { name: "Laticínios", slug: toSlug("Laticínios") },
    }),
    prisma.category.create({
      data: { name: "Verduras e Legumes", slug: toSlug("Verduras e Legumes") },
    }),
    prisma.category.create({
      data: {
        name: "Processados Artesanais",
        slug: toSlug("Processados Artesanais"),
      },
    }),
  ]);

  // ── Produtos ─────────────────────────────────────────────────────────────
  console.log("  → Criando produtos...");

  const [queijo, iogurte, alface, tomate, geleia] = await Promise.all([
    prisma.product.create({
      data: {
        name: "Queijo Minas Artesanal",
        slug: toSlug("Queijo Minas Artesanal"),
        description:
          "Queijo minas frescal produzido de forma artesanal com leite integral da própria fazenda. Textura cremosa e sabor suave.",
        featured: true,
      },
    }),
    prisma.product.create({
      data: {
        name: "Iogurte Natural",
        slug: toSlug("Iogurte Natural"),
        description:
          "Iogurte natural integral feito com fermentos artesanais. Rico em probióticos e sem conservantes.",
        featured: false,
      },
    }),
    prisma.product.create({
      data: {
        name: "Alface Crespa Orgânica",
        slug: toSlug("Alface Crespa Orgânica"),
        description:
          "Alface crespa cultivada sem agrotóxicos, colhida fresquinha e entregue diretamente do sítio.",
        featured: true,
      },
    }),
    prisma.product.create({
      data: {
        name: "Tomate Cereja",
        slug: toSlug("Tomate Cereja"),
        description:
          "Tomate cereja doce e suculento, cultivado em estufa orgânica. Ideal para saladas e petiscos.",
        featured: false,
      },
    }),
    prisma.product.create({
      data: {
        name: "Geleia de Goiaba",
        slug: toSlug("Geleia de Goiaba"),
        description:
          "Geleia artesanal de goiaba sem conservantes, preparada em tacho de cobre com frutas do sítio. Pote de 300g.",
        featured: true,
      },
    }),
  ]);

  // ── Associados ───────────────────────────────────────────────────────────
  console.log("  → Criando associados...");

  const [maria, jose, ana] = await Promise.all([
    prisma.associate.create({
      data: {
        name: "Maria das Graças",
        slug: toSlug("Maria das Gracas"),
        bio: "Produtora de laticínios artesanais há mais de 20 anos. Criou a Fazendinha Boa Vista em 1998 e hoje é referência regional em queijos e iogurtes.",
        location: "Fazendinha Boa Vista, Santa Rita de Cássia",
        whatsapp: "5524998000001",
        phone: "552433000001",
        email: "maria.gracas@exemplo.com",
      },
    }),
    prisma.associate.create({
      data: {
        name: "José Carlos",
        slug: toSlug("Jose Carlos"),
        bio: "Horticultor orgânico certificado. Cultiva verduras e legumes sem agrotóxicos no Sítio São João, abastecendo feiras locais há 15 anos.",
        location: "Sítio São João, Barra Mansa/RJ",
        whatsapp: "5524998000002",
      },
    }),
    prisma.associate.create({
      data: {
        name: "Ana Paula",
        slug: toSlug("Ana Paula"),
        bio: "Especialista em conservas e doces artesanais. Fundou a marca Doces da Roça para valorizar as receitas tradicionais da região serrana.",
        location: "Doces da Roça, Volta Redonda/RJ",
        whatsapp: "5524998000003",
      },
    }),
  ]);

  // ── Eventos ──────────────────────────────────────────────────────────────
  console.log("  → Criando eventos...");

  await Promise.all([
    prisma.event.create({
      data: {
        name: "Feira da Agricultura Familiar 2025",
        slug: toSlug("Feira da Agricultura Familiar 2025"),
        description:
          "A maior feira de agricultura familiar da região, reunindo produtores de toda a Serra Fluminense. Apresentações culturais, gastronomia regional e venda direta ao consumidor.",
        date: new Date("2025-06-14T09:00:00-03:00"),
        location: "Praça Central, Santa Rita de Cássia — Barra Mansa/RJ",
      },
    }),
    prisma.event.create({
      data: {
        name: "Workshop de Técnicas de Conservação",
        slug: toSlug("Workshop de Tecnicas de Conservacao"),
        description:
          "Oficina prática de conservas artesanais, geléias e picles. Aprenda técnicas de conservação que valorizam os produtos da estação e reduzem o desperdício.",
        date: new Date("2024-11-23T14:00:00-03:00"),
        location: "Sede da APFAM, Estrada da Granja n 40 — Barra Mansa/RJ",
      },
    }),
  ]);

  // ── Vínculos N:N ─────────────────────────────────────────────────────────
  console.log("  → Criando vínculos N:N...");

  await prisma.productCategory.createMany({
    data: [
      { productId: queijo.id, categoryId: laticinios.id },
      { productId: iogurte.id, categoryId: laticinios.id },
      { productId: alface.id, categoryId: verduras.id },
      { productId: tomate.id, categoryId: verduras.id },
      { productId: geleia.id, categoryId: processados.id },
    ],
  });

  await prisma.associateProduct.createMany({
    data: [
      { associateId: maria.id, productId: queijo.id },
      { associateId: maria.id, productId: iogurte.id },
      { associateId: jose.id, productId: alface.id },
      { associateId: jose.id, productId: tomate.id },
      { associateId: ana.id, productId: geleia.id },
    ],
  });

  // ── Admin padrão ─────────────────────────────────────────────────────────
  console.log("  → Verificando admin...");

  const existingAdmin = await prisma.user.findUnique({
    where: { email: "lfbmrj15@gmail.com" },
  });

  if (!existingAdmin) {
    await auth.api.createUser({
      body: {
        name: "Administrador",
        email: "lfbmrj15@gmail.com",
        password: "12345678",
        role: "admin",
      },
    });
    console.log("  ✓ Admin criado: lfbmrj15@gmail.com");
  } else {
    console.log("  ℹ Admin já existe, pulando.");
  }

  console.log("✅ Seed concluído!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(() => {
    pool.end();
  });
