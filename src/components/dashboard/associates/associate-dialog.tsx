"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createAssociate } from "@/actions/dashboard/associates/create-associate";
import { updateAssociate } from "@/actions/dashboard/associates/update-associate";
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
import {
  type AssociateFormData,
  associateSchema,
} from "@/lib/validations/associate";
import type { AssociateRow } from "./associate-columns";

interface AssociateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: AssociateRow;
}

export function AssociateDialog({
  open,
  onOpenChange,
  initialData,
}: AssociateDialogProps) {
  const isEditing = !!initialData;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<AssociateFormData>({
    resolver: zodResolver(associateSchema),
    defaultValues: {
      name: "",
      bio: "",
      location: "",
      avatarUrl: "",
      whatsapp: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: initialData?.name ?? "",
        bio: initialData?.bio ?? "",
        location: initialData?.location ?? "",
        avatarUrl: initialData?.avatarUrl ?? "",
        whatsapp: initialData?.whatsapp ?? "",
        email: initialData?.email ?? "",
        phone: initialData?.phone ?? "",
      });
    }
  }, [open, initialData, reset]);

  async function onSubmit(data: AssociateFormData) {
    const result = isEditing
      ? await updateAssociate(initialData.id, data)
      : await createAssociate(data);

    if (result && "error" in result) {
      toast.error("Erro ao salvar associado. Verifique os dados.");
      return;
    }

    toast.success(isEditing ? "Associado atualizado!" : "Associado criado!");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>
            {isEditing ? "Editar associado" : "Novo associado"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <form
            id="associate-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5 py-4"
          >
            <Controller
              name="avatarUrl"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Foto (Opcional)</FieldLabel>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    entity="associates"
                    maxSizeMB={5}
                    maxWidth={800}
                  />
                  <FieldDescription>
                    Imagem JPG, PNG ou WebP. Será comprimida automaticamente.
                  </FieldDescription>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Nome *</FieldLabel>
                    <Input {...field} disabled={isSubmitting} />
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
                      placeholder="Ex: Sítio São José"
                      disabled={isSubmitting}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="bio"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Biografia *</FieldLabel>
                  <Textarea
                    {...field}
                    className="h-24 resize-none"
                    placeholder="Conte um pouco sobre a história do produtor..."
                    disabled={isSubmitting}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="whatsapp"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>WhatsApp</FieldLabel>
                    <Input
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="(24) 99999-9999"
                      disabled={isSubmitting}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="seu@email.com"
                      disabled={isSubmitting}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </div>
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
          <Button type="submit" form="associate-form" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 mr-2 animate-spin" />}
            {isEditing ? "Salvar alterações" : "Criar associado"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
