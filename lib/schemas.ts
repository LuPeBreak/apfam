import * as z from "zod";

export const associateSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  slug: z.string().min(2, "O link personalizado é obrigatório.").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "O link deve conter apenas letras minúsculas, números e hifens."),
  bio: z.string().min(10, "A biografia deve ter pelo menos 10 caracteres."),
  location: z.string().min(2, "A localização deve ter pelo menos 2 caracteres."),
  productIds: z.array(z.string()),
  avatarUrl: z.string().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
});

export const eventSchema = z.object({
  title: z.string().min(2, "O título deve ter pelo menos 2 caracteres."),
  slug: z.string().min(2, "O link personalizado é obrigatório.").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "O link deve conter apenas letras minúsculas, números e hifens."),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Data inválida."),
  location: z.string().min(2, "O local deve ter pelo menos 2 caracteres."),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres."),
  imageUrl: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  slug: z.string().min(2, "O link personalizado é obrigatório.").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "O link deve conter apenas letras minúsculas, números e hifens."),
  categoryIds: z.array(z.string()).min(1, "Selecione pelo menos uma categoria."),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres."),
  imageUrl: z.string().optional(),
});

export type AssociateFormData = z.infer<typeof associateSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type EventFormData = z.infer<typeof eventSchema>;
export type ProductFormData = z.infer<typeof productSchema>;

export const profileSchema = z.object({
  fullName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
  password: z.string().optional().or(z.literal("")),
  confirmPassword: z.string().optional().or(z.literal("")),
}).refine((data) => {
  if (data.password && data.password.length > 0) {
    if (data.password.length < 6) return false;
  }
  return true;
}, {
  message: "A senha deve ter pelo menos 6 caracteres",
  path: ["password"],
}).refine((data) => {
  if (data.password && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});

export type ProfileFormData = z.infer<typeof profileSchema>;
