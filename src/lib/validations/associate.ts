import { z } from "zod";

export const associateSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  bio: z.string().min(10, "Biografia deve ter pelo menos 10 caracteres"),
  location: z.string().min(2, "Localização é obrigatória"),
  avatarUrl: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z
    .union([z.literal(""), z.string().email("Email inválido")])
    .optional()
    .nullable(),
});

export type AssociateFormData = z.infer<typeof associateSchema>;
