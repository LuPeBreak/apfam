import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background gap-6">
      <Image
        src="/apfam-verde.png"
        alt="APFAM"
        width={180}
        height={60}
        className="object-contain animate-pulse"
        priority
      />
      <div className="flex items-center gap-3 text-muted-foreground">
        <Loader2 className="size-5 animate-spin text-primary" />
        <p className="text-sm font-medium animate-pulse">
          Carregando plataforma...
        </p>
      </div>
    </div>
  );
}
