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
import { MultiSelect } from "@/components/custom/multi-select";
import { ImageUpload } from "@/components/custom/image-upload";
import { Product, Associate } from "@/types";
import { useEffect } from "react";

export const associateSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  bio: z.string().min(10, "A biografia deve ter pelo menos 10 caracteres."),
  location: z.string().min(2, "A localização deve ter pelo menos 2 caracteres."),
  productIds: z.array(z.string()),
  avatarUrl: z.string().optional(),
});

export type AssociateFormData = z.infer<typeof associateSchema>;

interface AssociateFormProps {
  onSubmit: (data: AssociateFormData) => void;
  initialData?: Associate;
  catalog: Product[];
}

export function AssociateForm({ onSubmit, initialData, catalog }: AssociateFormProps) {
  const form = useForm<AssociateFormData>({
    resolver: zodResolver(associateSchema),
    defaultValues: {
      name: "",
      bio: "",
      location: "",
      productIds: [],
      avatarUrl: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        bio: initialData.bio,
        location: initialData.location,
        productIds: initialData.products.map((p: Product) => p.id),
        avatarUrl: initialData.avatarUrl || "",
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
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do associado" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Localização</FormLabel>
                <FormControl>
                  <Input placeholder="Rua das Flores, 123 - Centro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biografia</FormLabel>
              <FormControl>
                <Input placeholder="Breve história do produtor" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar</FormLabel>
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
        
        <div className="border-t pt-4 mt-4">
          <h4 className="text-sm font-medium mb-2">Produtos Disponíveis</h4>
          <FormField
            control={form.control}
            name="productIds"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <MultiSelect
                    options={catalog.map(p => ({ label: p.name, value: p.id }))}
                    selected={field.value}
                    onChange={field.onChange}
                    placeholder="Selecione os produtos..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Pesquise e selecione os produtos do catálogo.
          </p>
        </div>

        <div className="flex justify-end">
          <Button type="submit">{initialData ? "Atualizar" : "Salvar"} Associado</Button>
        </div>
      </form>
    </Form>
  );
}
