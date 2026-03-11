import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),
  imageUrl: z.string().optional().nullable(),
  featured: z.boolean().optional(),
  categoryIds: z.array(z.string()).min(1, "Selecione pelo menos uma categoria"),
  associateIds: z.array(z.string()).optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
