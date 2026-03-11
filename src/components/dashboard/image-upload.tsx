"use client";

import { ImageIcon, Loader2, X } from "lucide-react";
import Image from "next/image";
import { type ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { uploadImage } from "@/actions/dashboard/upload-image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  entity: "associates" | "events" | "products";
  maxSizeMB?: number; // padrão 5MB
  maxWidth?: number; // padrão 1000px
}

export function ImageUpload({
  value,
  onChange,
  entity,
  maxSizeMB = 5,
  maxWidth = 1000,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("O arquivo deve ser uma imagem válida");
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`A imagem deve ter no máximo ${maxSizeMB}MB`);
      return;
    }

    setIsUploading(true);

    try {
      // 1. Compressão local com Canvas Web API
      const compressedBlob = await compressImage(file, maxWidth);

      // 2. Transforma em File denovo
      const newFile = new File(
        [compressedBlob],
        `${file.name.replace(/\.[^/.]+$/, "")}.webp`,
        {
          type: "image/webp",
        },
      );

      // 3. Upload Action
      const formData = new FormData();
      formData.append("file", newFile);

      const result = await uploadImage(formData, entity);

      if (!result || "error" in result) {
        toast.error(result?.error || "Falha ao enviar imagem");
      } else if (result.url) {
        // Sucesso
        onChange(result.url);
      }
    } catch (err) {
      console.error(err);
      toast.error("Ocorreu um erro ao processar a imagem.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function removeImage() {
    // Não vamos deletar do disco aqui imediatamente (fazer no submit/update da controller action é mais seguro contra abandonos de form),
    // apenas removemos do state do formulário. A imagem ficará orfã no diretório se não submeter (limpeza cron pode apagar dps).
    // Ou podemos deletar do disco, mas corremos risco se o user não salvar o form e a pagina já apagou a imagem q tava no BD de qlqr forma.
    // Melhor approach sem AWS/Crony: Apagamos do field no client, o Update Action do Prisma checa se o db.url != new.url e remove o antigo.
    onChange(null);
  }

  function compressImage(file: File, maxW: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > maxW) {
            height = Math.round((height * maxW) / width);
            width = maxW;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) return reject("Canvas não suportado");

          ctx.drawImage(img, 0, 0, width, height);

          // WebP 80% qualidade
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject("Erro ao converter para Blob");
              }
            },
            "image/webp",
            0.8,
          );
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Exibição */}
      {value ? (
        <div className="relative h-40 w-full overflow-hidden rounded-md border bg-muted group">
          <Image
            src={value}
            alt="Upload preview"
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={removeImage}
              className="size-8"
              disabled={isUploading}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      ) : (
        <label
          className={cn(
            "flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors",
            isUploading && "pointer-events-none opacity-50",
          )}
        >
          {isUploading ? (
            <Loader2 className="size-8 animate-spin text-primary" />
          ) : (
            <>
              <ImageIcon className="size-8" />
              <span className="text-sm font-medium">
                Cliquar para fazer upload
              </span>
              <span className="text-xs">
                Máximo {maxSizeMB}MB (será otimizada para WebP)
              </span>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      )}
    </div>
  );
}
