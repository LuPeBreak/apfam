"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { withPermissions } from "@/lib/auth/with-permissions";
import { removeImage } from "@/lib/file-upload/remove-image";
import { saveImage } from "@/lib/file-upload/save-image";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations/product";

export const updateProduct = withPermissions(
  [{ resource: "product", action: ["update"] }],
  async (_session, id: string, formData: unknown) => {
    try {
      const parsed = productSchema.safeParse(formData);
      if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors };
      }

      const { categoryIds, associateIds, imageUrl, ...data } = parsed.data;
      const slug = slugify(data.name, { lower: true, strict: true });

      const oldProd = await prisma.product.findUnique({ where: { id } });

      let finalImageUrl = null;

      if (imageUrl instanceof File) {
        // Nova imagem foi enviada
        finalImageUrl = await saveImage(imageUrl, "products", slug);
        if (oldProd?.imageUrl) {
          await removeImage(oldProd.imageUrl); // Limpa a velha
        }
      } else if (typeof imageUrl === "string") {
        // Mesma imagem mantida
        finalImageUrl = imageUrl;
      } else if (!imageUrl && oldProd?.imageUrl) {
        // Usuário apagou a imagem, limpamos do server
        await removeImage(oldProd.imageUrl);
      }

      await prisma.product.update({
        where: { id },
        data: {
          ...data,
          slug,
          imageUrl: finalImageUrl,
          categories: {
            deleteMany: {},
            create: categoryIds.map((catId) => ({ categoryId: catId })),
          },
          associates: {
            deleteMany: {},
            create: associateIds
              ? associateIds.map((assocId) => ({ associateId: assocId }))
              : [],
          },
        },
      });

      revalidatePath("/dashboard/produtos");
      return { success: true };
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      return {
        error:
          (error as Error).message ||
          "Não foi possível salvar as alterações no momento.",
      };
    }
  },
);
