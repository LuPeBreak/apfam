import { randomUUID } from "node:crypto";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import slugify from "slugify";

export async function saveImage(
  file: File,
  entity: "associates" | "events" | "products",
  slug: string,
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("O arquivo deve ser uma imagem válida");
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", entity);
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  // Padrão: {entity}-{slug}-{uuid}.webp
  const safeSlug = slugify(slug || "img", {
    lower: true,
    strict: true,
  }).slice(0, 60);

  // Garantindo que a ext seja a mesma do file caso não tenhamos convertido em webp
  // (Embora o frontend converterá para webp, isso nos garante segurança).
  const extension = path.extname(file.name) || ".webp";

  const fileName = `${entity}-${safeSlug}-${randomUUID()}${extension}`;
  const filePath = path.join(uploadDir, fileName);

  const arrayBuffer = await file.arrayBuffer();
  await fs.writeFile(filePath, Buffer.from(arrayBuffer));

  return `/uploads/${entity}/${fileName}`;
}
