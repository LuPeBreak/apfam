"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Product, Associate } from "@/types";
import { useEffect } from "react";
import { slugify } from "@/lib/utils";

import { associateSchema, AssociateFormData } from "@/lib/schemas";

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
      slug: "",
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
        slug: initialData.slug || "",
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
                  <Input 
                    placeholder="Nome do associado" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      // Only auto-update slug if we are creating a new associate
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
                  <Input placeholder="nome-do-associado" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
        
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biografia</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="História do produtor e detalhes sobre sua produção" 
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
          name="avatarUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Foto do Associado</FormLabel>
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
