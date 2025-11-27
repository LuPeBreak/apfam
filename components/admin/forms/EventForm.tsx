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
import { useEffect } from "react";

const eventSchema = z.object({
  title: z.string().min(2, "O título deve ter pelo menos 2 caracteres."),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Data inválida."),
  location: z.string().min(2, "O local deve ter pelo menos 2 caracteres."),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres."),
});

interface EventFormProps {
  onSubmit: (data: z.infer<typeof eventSchema>) => void;
  initialData?: any;
}

export function EventForm({ onSubmit, initialData }: EventFormProps) {
  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema) as any,
    defaultValues: {
      title: "",
      date: "",
      location: "",
      description: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        date: initialData.date,
        location: initialData.location,
        description: initialData.description,
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
        <div className="space-y-2">
          <FormLabel>Imagem de Capa</FormLabel>
          <Input type="file" accept="image/*" />
        </div>
        <div className="flex justify-end">
          <Button type="submit">{initialData ? "Atualizar" : "Salvar"} Evento</Button>
        </div>
      </form>
    </Form>
  );
}
