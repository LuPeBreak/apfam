import { z } from "zod";

export const eventSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),
  date: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
    message: "Data e hora inválidas",
  }),
  location: z.string().min(2, "O local é obrigatório"),
  imageUrl: z
    .union([z.string(), z.instanceof(File)])
    .optional()
    .nullable(),
});

export type EventFormData = z.infer<typeof eventSchema>;
