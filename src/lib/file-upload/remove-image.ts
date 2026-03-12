import * as fs from "node:fs/promises";
import * as path from "node:path";

export async function removeImage(
  url: string | null | undefined,
): Promise<void> {
  if (!url || !url.startsWith("/uploads/")) {
    return;
  }

  try {
    const filePath = path.join(process.cwd(), "public", url);
    await fs.unlink(filePath);
  } catch (err) {
    console.error(
      "Erro ao deletar imagem física (provavelmente já não existia):",
      err,
    );
  }
}
