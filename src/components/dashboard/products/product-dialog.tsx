"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createProduct } from "@/actions/dashboard/products/create-product";
import { updateProduct } from "@/actions/dashboard/products/update-product";
import { ImageUpload } from "@/components/dashboard/image-upload";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { type ProductFormData, productSchema } from "@/lib/validations/product";
import type { AssociateRow } from "../associates/associate-columns";
import type { ProductRow } from "./product-columns";

type Category = { id: string; name: string };

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ProductRow;
  categories: Category[];
  associates: AssociateRow[];
}

export function ProductDialog({
  open,
  onOpenChange,
  initialData,
  categories,
  associates,
}: ProductDialogProps) {
  const isEditing = !!initialData;
  const [openCategories, setOpenCategories] = useState(false);
  const [openAssociates, setOpenAssociates] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      featured: false,
      categoryIds: [],
      associateIds: [],
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: initialData?.name ?? "",
        description: initialData?.description ?? "",
        imageUrl: initialData?.imageUrl ?? "",
        featured: initialData?.featured ?? false,
        categoryIds: initialData?.categories?.map((c) => c.category.id) ?? [],
        associateIds: initialData?.associates?.map((a) => a.associate.id) ?? [],
      });
    }
  }, [open, initialData, reset]);

  async function onSubmit(data: ProductFormData) {
    const result = isEditing
      ? await updateProduct(initialData.id, data)
      : await createProduct(data);

    if (result && "error" in result) {
      toast.error("Erro ao salvar produto. Verifique os dados.");
      return;
    }

    toast.success(isEditing ? "Produto atualizado!" : "Produto criado!");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>
            {isEditing ? "Editar produto" : "Novo produto"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0 px-6">
          <form
            id="product-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 py-4"
          >
            <Controller
              name="imageUrl"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Foto do Produto</FieldLabel>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    entity="products"
                    maxSizeMB={5}
                    maxWidth={1000}
                  />
                  <FieldDescription>
                    Imagem clara e nítida do produto será convertida para WebP.
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
                    <FieldLabel>Nome do Produto *</FieldLabel>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Ex: Queijo Minas Frescal"
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="featured"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-row items-start space-x-3 mt-8">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                      id="featured"
                      className="mt-0.5 shrink-0"
                    />
                    <div className="space-y-1.5 leading-none">
                      <label
                        htmlFor="featured"
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        Produto em Destaque
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Mostrará na vitrine da página inicial
                      </p>
                    </div>
                  </div>
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
                    className="h-24 resize-none"
                    placeholder="Descreva o produto com detalhes atrativos..."
                    disabled={isSubmitting}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Categorias */}
              <Controller
                name="categoryIds"
                control={control}
                render={({ field, fieldState }) => (
                  <Field className="flex flex-col">
                    <FieldLabel>Categorias *</FieldLabel>
                    <Popover
                      open={openCategories}
                      onOpenChange={setOpenCategories}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openCategories}
                          className="justify-between min-h-[40px] h-auto p-2 w-full font-normal"
                          disabled={isSubmitting}
                        >
                          {(field.value || []).length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {(field.value || []).map((id) => {
                                const category = categories.find(
                                  (c) => c.id === id,
                                );
                                return category ? (
                                  <Badge
                                    variant="secondary"
                                    key={id}
                                    className="mr-1"
                                  >
                                    {category.name}
                                  </Badge>
                                ) : null;
                              })}
                            </div>
                          ) : (
                            <span className="text-muted-foreground px-2 text-sm">
                              Selecione categorias...
                            </span>
                          )}
                          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[--radix-popover-trigger-width] max-w-sm p-0"
                        align="start"
                      >
                        <Command>
                          <CommandInput placeholder="Buscar categoria..." />
                          <CommandList>
                            <CommandEmpty>
                              Nenhuma categoria encontrada.
                            </CommandEmpty>
                            <CommandGroup>
                              {categories.map((cat) => {
                                const isSelected = (field.value || []).includes(
                                  cat.id,
                                );
                                return (
                                  <CommandItem
                                    key={cat.id}
                                    onSelect={() => {
                                      const newValues = isSelected
                                        ? (field.value || []).filter(
                                            (val) => val !== cat.id,
                                          )
                                        : [...(field.value || []), cat.id];
                                      field.onChange(newValues);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 size-4",
                                        isSelected
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    {cat.name}
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              {/* Associados */}
              <Controller
                name="associateIds"
                control={control}
                render={({ field, fieldState }) => (
                  <Field className="flex flex-col">
                    <FieldLabel>Associados (Produtores)</FieldLabel>
                    <Popover
                      open={openAssociates}
                      onOpenChange={setOpenAssociates}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openAssociates}
                          className="justify-between min-h-[40px] h-auto p-2 w-full font-normal"
                          disabled={isSubmitting}
                        >
                          {(field.value || []).length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {(field.value || []).map((id) => {
                                const assoc = associates.find(
                                  (a) => a.id === id,
                                );
                                return assoc ? (
                                  <Badge
                                    variant="secondary"
                                    key={id}
                                    className="mr-1"
                                  >
                                    {assoc.name}
                                  </Badge>
                                ) : null;
                              })}
                            </div>
                          ) : (
                            <span className="text-muted-foreground px-2 text-sm">
                              Selecione produtores...
                            </span>
                          )}
                          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[--radix-popover-trigger-width] max-w-sm p-0"
                        align="start"
                      >
                        <Command>
                          <CommandInput placeholder="Buscar produtor..." />
                          <CommandList>
                            <CommandEmpty>
                              Nenhum produtor encontrado.
                            </CommandEmpty>
                            <CommandGroup>
                              {associates.map((assoc) => {
                                const isSelected = (field.value || []).includes(
                                  assoc.id,
                                );
                                return (
                                  <CommandItem
                                    key={assoc.id}
                                    onSelect={() => {
                                      const newValues = isSelected
                                        ? (field.value || []).filter(
                                            (val) => val !== assoc.id,
                                          )
                                        : [...(field.value || []), assoc.id];
                                      field.onChange(newValues);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 size-4",
                                        isSelected
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    {assoc.name}
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FieldDescription>
                      Opcional: vincule quem produz este item.
                    </FieldDescription>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </div>
          </form>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-muted/30">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" form="product-form" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 mr-2 animate-spin" />}
            {isEditing ? "Salvar alterações" : "Criar produto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
