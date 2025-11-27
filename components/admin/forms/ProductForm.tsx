"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { Category, Product } from "@/types";
import { useEffect } from "react";

export const productSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  categoryIds: z.array(z.string()).min(1, "Selecione pelo menos uma categoria."),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres."),
});

export type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => void;
  initialData?: Product;
  categories: Category[];
}

export function ProductForm({ onSubmit, initialData, categories }: ProductFormProps) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      categoryIds: [],
      description: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        categoryIds: initialData.categoryIds || (initialData.categoryId ? [initialData.categoryId] : []),
        description: initialData.description,
      });
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Produto</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Queijo Minas" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categorias</FormLabel>
              <FormControl>
                <MultiSelect
                  options={categories.map(c => ({ label: c.name, value: c.id }))}
                  selected={field.value}
                  onChange={field.onChange}
                  placeholder="Selecione as categorias..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Breve descrição do produto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <FormLabel>Imagem</FormLabel>
          <Input type="file" accept="image/*" />
        </div>
        <div className="flex justify-end">
          <Button type="submit">{initialData ? "Atualizar" : "Salvar"} Produto</Button>
        </div>
      </form>
    </Form>
  );
}
