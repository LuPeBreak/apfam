"use server";

import * as fs from "node:fs/promises";
import * as path from "node:path";
import { withPermissions } from "@/lib/auth/with-permissions";

export const deleteImage = withPermissions(
  [{ resource: "image", action: ["delete"] }],
  async (_session, imageUrl: string) => {
    if (!imageUrl || !imageUrl.startsWith("/uploads/"))
      return { success: false };

    try {
      const filePath = path.join(process.cwd(), "public", imageUrl);
      await fs.unlink(filePath);
      return { success: true };
    } catch (err) {
      console.error("Erro ao deletar imagem:", err);
      return { error: "Não foi possível remover a imagem física do disco" };
    }
  },
);
