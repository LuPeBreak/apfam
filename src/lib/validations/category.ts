import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome deve ter no máximo 50 caracteres"),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
