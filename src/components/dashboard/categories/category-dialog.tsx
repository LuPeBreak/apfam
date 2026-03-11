"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createCategory } from "@/actions/dashboard/categories/create-category";
import { updateCategory } from "@/actions/dashboard/categories/update-category";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  type CategoryFormData,
  categorySchema,
} from "@/lib/validations/category";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Category;
}

export function CategoryDialog({
  open,
  onOpenChange,
  initialData,
}: CategoryDialogProps) {
  const isEditing = !!initialData;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  });

  // Preenche o formulário com dados existentes ao abrir no modo edição
  useEffect(() => {
    if (open) {
      reset({ name: initialData?.name ?? "" });
    }
  }, [open, initialData, reset]);

  async function onSubmit(data: CategoryFormData) {
    const result = isEditing
      ? await updateCategory(initialData.id, data)
      : await createCategory(data);

    if (result && "error" in result) {
      toast.error("Erro ao salvar categoria. Verifique os dados.");
      return;
    }

    toast.success(isEditing ? "Categoria atualizada!" : "Categoria criada!");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar categoria" : "Nova categoria"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Nome</FieldLabel>
                <Input
                  {...field}
                  placeholder="Ex: Laticínios"
                  disabled={isSubmitting}
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 mr-2 animate-spin" />}
              {isEditing ? "Salvar alterações" : "Criar categoria"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
