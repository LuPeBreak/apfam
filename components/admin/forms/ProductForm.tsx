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
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/multi-select";
import { ImageUpload } from "@/components/image-upload";
import { Category, Product } from "@/types";
import { useEffect } from "react";
import { slugify } from "@/lib/utils";

import { productSchema, ProductFormData } from "@/lib/schemas";

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
      slug: "",
      categoryIds: [],
      description: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        slug: initialData.slug || "",
        categoryIds: initialData.categoryIds || [],
        description: initialData.description,
        imageUrl: initialData.imageUrl || "",
      });
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Produto</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: Queijo Minas" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      if (!initialData) {
                        form.setValue("slug", slugify(e.target.value), { shouldValidate: true });
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link (Slug)</FormLabel>
                <FormControl>
                  <Input placeholder="nome-do-produto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                <Textarea 
                  placeholder="Descrição detalhada do produto" 
                  className="min-h-[100px] resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagem do Produto</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">{initialData ? "Atualizar" : "Salvar"} Produto</Button>
        </div>
      </form>
    </Form>
  );
}
