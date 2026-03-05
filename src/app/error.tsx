"use client";

import { AlertCircle, RefreshCcw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log do erro para um serviço de monitoramento (opcional)
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center container mx-auto px-4 text-center">
      <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center text-destructive mb-6">
        <AlertCircle className="w-10 h-10" />
      </div>
      <h2 className="text-3xl font-bold mb-4">Ops! Algo deu errado.</h2>
      <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
        Não foi possível carregar as informações agora. Isso pode ser uma falha
        temporária na conexão com o servidor.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} size="lg" className="rounded-full">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Tentar Novamente
        </Button>
        <Button variant="outline" size="lg" className="rounded-full" asChild>
          <a href="/">Voltar para Home</a>
        </Button>
      </div>
    </div>
  );
}
