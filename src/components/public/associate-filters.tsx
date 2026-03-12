"use client";

import { Check, ChevronsUpDown, Search } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface AssociateFiltersProps {
  products: { id: string; name: string; slug: string }[];
  placeholder?: string;
  className?: string;
}

export function AssociateFilters({
  products,
  placeholder = "Buscar produtores...",
  className,
}: AssociateFiltersProps) {
  const [query, setQuery] = useQueryState("q", {
    defaultValue: "",
    shallow: false,
  });

  const [productSlug, setProductSlug] = useQueryState("product", {
    defaultValue: "",
    shallow: false,
  });

  // Estado local para o input não ter lag enquanto digita
  const [localQuery, setLocalQuery] = useState(query);
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

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

  const selectedProductLabel =
    productSlug && productSlug !== "all"
      ? products.find((p) => p.slug === productSlug)?.name
      : "Todos os produtos";

  return (
    <div
      className={cn(
        "relative w-full shadow-lg rounded-2xl md:rounded-full overflow-hidden bg-background/95 backdrop-blur-md flex flex-col md:flex-row items-center p-2 gap-2",
        className,
      )}
    >
      <div className="relative flex-1 w-full">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          className="pl-12 h-12 text-lg border-0 ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
          value={localQuery || ""}
          onChange={(e) => setLocalQuery(e.target.value)}
        />
        {isPending && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        )}
      </div>

      <div className="hidden md:block w-px h-8 bg-border" />
      <div className="w-full md:w-auto h-px md:hidden bg-border my-1" />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className="w-full md:w-[250px] justify-between h-12 border-0 bg-transparent focus:ring-0 focus:ring-offset-0 text-base font-normal hover:bg-transparent"
          >
            <span className="truncate">{selectedProductLabel}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0" align="end">
          <Command>
            <CommandInput placeholder="Buscar produto..." />
            <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                <CommandItem
                  value="all"
                  onSelect={() => {
                    startTransition(() => {
                      setProductSlug(null);
                    });
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      !productSlug || productSlug === "all"
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  Todos os produtos
                </CommandItem>
                {products.map((p) => (
                  <CommandItem
                    key={p.id}
                    value={p.name}
                    onSelect={() => {
                      startTransition(() => {
                        setProductSlug(p.slug);
                      });
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        productSlug === p.slug ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {p.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
