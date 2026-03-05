"use client";

import { Search } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";

export function SearchInput({
  placeholder = "Buscar...",
  className,
}: {
  placeholder?: string;
  className?: string;
}) {
  const [query, setQuery] = useQueryState("q", {
    defaultValue: "",
    shallow: false, // Força a requisição ao servidor para pegar os novos dados
  });

  // Estado local para o input não ter lag enquanto digita
  const [localQuery, setLocalQuery] = useState(query);
  const [isPending, startTransition] = useTransition();

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localQuery !== query) {
        startTransition(() => {
          setQuery(localQuery || null);
        });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [localQuery, query, setQuery]);

  return (
    <div
      className={`relative w-full shadow-lg rounded-full overflow-hidden ${className || ""}`}
    >
      <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-14 pr-12 h-16 text-lg bg-background/95 backdrop-blur-md border-0 ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
        value={localQuery || ""}
        onChange={(e) => setLocalQuery(e.target.value)}
      />
      {isPending && (
        <div className="absolute right-6 top-1/2 -translate-y-1/2">
          <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      )}
    </div>
  );
}
