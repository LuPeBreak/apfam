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
import { ImageUpload } from "@/components/image-upload";
import { useEffect } from "react";

export const eventSchema = z.object({
  title: z.string().min(2, "O título deve ter pelo menos 2 caracteres."),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Data inválida."),
  location: z.string().min(2, "O local deve ter pelo menos 2 caracteres."),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres."),
  imageUrl: z.string().optional(),
});

export type EventFormData = z.infer<typeof eventSchema>;

import { Event } from "@/types";

interface EventFormProps {
  onSubmit: (data: EventFormData) => void;
  initialData?: Partial<Event>;
}

export function EventForm({ onSubmit, initialData }: EventFormProps) {
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      date: "",
      location: "",
      description: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      // Format date for datetime-local input (YYYY-MM-DDThh:mm)
      let formattedDate = "";
      if (initialData.date) {
        const date = new Date(initialData.date);
        if (!isNaN(date.getTime())) {
          formattedDate = date.toISOString().slice(0, 16);
        }
      }

      form.reset({
        title: initialData.title || "",
        date: formattedDate,
        location: initialData.location || "",
        description: initialData.description || "",
        imageUrl: initialData.imageUrl || "",
      });
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Título do evento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
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
                <FormLabel>Local</FormLabel>
                <FormControl>
                  <Input placeholder="Local do evento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Detalhes do evento" 
                  className="resize-none" 
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
              <FormLabel>Imagem do Evento</FormLabel>
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
          <Button type="submit">{initialData ? "Atualizar" : "Salvar"} Evento</Button>
        </div>
      </form>
    </Form>
  );
}
