"use server";

import { randomUUID } from "node:crypto";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import slugify from "slugify";
import { withPermissions } from "@/lib/auth/with-permissions";

export const uploadImage = withPermissions(
  [{ resource: "image", action: ["create"] }],
  async (
    _session,
    formData: FormData,
    entity: "associates" | "events" | "products",
    slug?: string,
  ) => {
    const file = formData.get("file") as File | null;
    if (!file) return { error: "Nenhum arquivo enviado" };

    if (!file.type.startsWith("image/"))
      return { error: "Tipo de arquivo inválido" };

    const uploadDir = path.join(process.cwd(), "public", "uploads", entity);
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    // Padrão: {entity}-{slug}-{uuid}.webp — rastreável e sanitizável
    const safeSlug = slugify(slug ?? "img", {
      lower: true,
      strict: true,
    }).slice(0, 60);
    const fileName = `${entity}-${safeSlug}-${randomUUID()}.webp`;
    const filePath = path.join(uploadDir, fileName);

    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(arrayBuffer));

    return { url: `/uploads/${entity}/${fileName}` };
  },
);
