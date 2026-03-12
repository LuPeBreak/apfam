"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Search } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function EventFilters({
  placeholder = "Buscar eventos...",
  className,
}: {
  placeholder?: string;
  className?: string;
}) {
  const [query, setQuery] = useQueryState("q", {
    defaultValue: "",
    shallow: false,
  });

  const [dateFilter, setDateFilter] = useQueryState("date", {
    defaultValue: "future",
    shallow: false,
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

  const isExactDate =
    dateFilter &&
    !["all", "future", "today", "week", "month"].includes(dateFilter);
  const exactDateValue = isExactDate ? new Date(dateFilter) : undefined;

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

      <Select
        value={isExactDate ? "custom" : dateFilter || "future"}
        onValueChange={(val) => {
          if (val === "custom") return; // Mantém no estado atual se clicar
          startTransition(() => {
            setDateFilter(val === "future" ? null : val);
          });
        }}
      >
        <SelectTrigger className="w-full md:w-[180px] h-12 border-0 bg-transparent focus:ring-0 focus:ring-offset-0 text-base">
          <SelectValue placeholder="Data" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as Datas</SelectItem>
          <SelectItem value="future">Próximos Eventos</SelectItem>
          <SelectItem value="today">Hoje</SelectItem>
          <SelectItem value="week">Próximos 7 Dias</SelectItem>
          <SelectItem value="month">Este Mês</SelectItem>
          {isExactDate && (
            <SelectItem value="custom">Data Específica</SelectItem>
          )}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full md:w-auto h-12 border-0 bg-transparent hover:bg-muted font-normal text-base",
              isExactDate && "text-primary font-medium",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {isExactDate && exactDateValue
              ? format(exactDateValue, "dd/MM/yyyy")
              : "Escolher Data"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={exactDateValue}
            onSelect={(date) => {
              startTransition(() => {
                if (date) {
                  setDateFilter(format(date, "yyyy-MM-dd"));
                } else {
                  setDateFilter(null);
                }
              });
            }}
            initialFocus
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
