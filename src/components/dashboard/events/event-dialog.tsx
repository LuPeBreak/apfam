"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createEvent } from "@/actions/dashboard/events/create-event";
import { updateEvent } from "@/actions/dashboard/events/update-event";
import { ImageUpload } from "@/components/dashboard/image-upload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { type EventFormData, eventSchema } from "@/lib/validations/event";
import type { EventRow } from "./event-columns";

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: EventRow;
}

export function EventDialog({
  open,
  onOpenChange,
  initialData,
}: EventDialogProps) {
  const isEditing = !!initialData;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: "",
      description: "",
      date: "",
      location: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: initialData?.name ?? "",
        description: initialData?.description ?? "",
        // Formata data ISO para xxxx-xx-xxTxx:xx que é esperado pelo input datetime-local
        date: initialData?.date
          ? format(new Date(initialData.date), "yyyy-MM-dd'T'HH:mm")
          : "",
        location: initialData?.location ?? "",
        imageUrl: initialData?.imageUrl ?? "",
      });
    }
  }, [open, initialData, reset]);

  async function onSubmit(data: EventFormData) {
    const result = isEditing
      ? await updateEvent(initialData.id, data)
      : await createEvent(data);

    if (result && "error" in result) {
      toast.error("Erro ao salvar evento. Verifique os dados.");
      return;
    }

    toast.success(isEditing ? "Evento atualizado!" : "Evento criado!");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>
            {isEditing ? "Editar evento" : "Novo evento"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <form
            id="event-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 py-4"
          >
            <Controller
              name="imageUrl"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Capa (Opcional)</FieldLabel>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    entity="events"
                    maxSizeMB={5}
                    maxWidth={1000}
                  />
                  <FieldDescription>
                    Imagem JPG, PNG ou WebP. Será comprimida p/ WebP.
                  </FieldDescription>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Nome do Evento *</FieldLabel>
                  <Input
                    {...field}
                    disabled={isSubmitting}
                    placeholder="Ex: Feira de Orgânicos..."
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="date"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Data e Hora *</FieldLabel>
                    <Input
                      type="datetime-local"
                      {...field}
                      disabled={isSubmitting}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="location"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Localização *</FieldLabel>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Ex: Praça Central"
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Descrição *</FieldLabel>
                  <Textarea
                    {...field}
                    className="h-28 resize-none"
                    placeholder="Descreva sobre o evento..."
                    disabled={isSubmitting}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </form>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t bg-muted/30">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" form="event-form" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 mr-2 animate-spin" />}
            {isEditing ? "Salvar alterações" : "Criar evento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
