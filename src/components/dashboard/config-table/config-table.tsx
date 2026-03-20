"use client";

import { Edit2, Plus, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { updateSiteConfig } from "@/actions/config/update-site-config";
import { ImageUpload } from "@/components/dashboard/image-upload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

interface Config {
  key: string;
  value: string;
  type: string;
  label?: string;
  section?: string;
}

interface ConfigTableProps {
  configs: Config[];
}

const SECTION_LABELS: Record<string, string> = {
  home: "Home",
  produtos: "Produtos",
  eventos: "Eventos",
  associados: "Associados",
};

export function ConfigTable({ configs }: ConfigTableProps) {
  const router = useRouter();
  const [editingConfig, setEditingConfig] = useState<Config | null>(null);
  const [editValue, setEditValue] = useState<string | File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sectionFilter, setSectionFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConfigs = configs.filter((config) => {
    const matchesSection =
      sectionFilter === "all" || config.section === sectionFilter;
    const matchesSearch =
      searchQuery === "" ||
      (config.label ?? config.key)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesSection && matchesSearch;
  });

  const handleEdit = (config: Config) => {
    setEditingConfig(config);
    setEditValue(config.value);
  };

  const handleSave = async () => {
    if (!editingConfig) return;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("key", editingConfig.key);
    formData.append("value", editValue as string | File);

    const result = await updateSiteConfig(formData);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Configuração salva com sucesso!");
      router.refresh();
    }

    setIsSubmitting(false);
    setEditingConfig(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave();
  };

  const renderEditField = () => {
    if (!editingConfig) return null;

    const type = editingConfig.type;

    if (type === "image") {
      return (
        <ImageUpload
          value={editValue}
          onChange={setEditValue}
          entity="config"
        />
      );
    }

    if (type === "textarea") {
      return (
        <Textarea
          value={editValue as string}
          onChange={(e) => setEditValue(e.target.value)}
          rows={4}
        />
      );
    }

    if (type === "array") {
      const items = JSON.parse((editValue as string) || "[]");
      return (
        <div className="space-y-2">
          {items.map((item: string, index: number) => (
            // biome-ignore lint:suspicious/noArrayIndexKey - items are simple strings without unique IDs
            <div key={index} className="flex gap-2">
              <Input
                value={item}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index] = e.target.value;
                  setEditValue(JSON.stringify(newItems));
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newItems = items.filter(
                    (_: string, i: number) => i !== index,
                  );
                  setEditValue(JSON.stringify(newItems));
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditValue(JSON.stringify([...items, ""]))}
          >
            <Plus className="w-4 h-4 mr-2" /> Adicionar
          </Button>
        </div>
      );
    }

    return (
      <Input
        value={editValue as string}
        onChange={(e) => setEditValue(e.target.value)}
      />
    );
  };

  return (
    <>
      <div className="flex gap-4 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar campo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={sectionFilter} onValueChange={setSectionFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Todas as seções" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as seções</SelectItem>
            {Object.entries(SECTION_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Seção</TableHead>
              <TableHead>Campo</TableHead>
              <TableHead>Valor Atual</TableHead>
              <TableHead className="w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredConfigs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <span className="text-muted-foreground">
                    Nenhum config encontrado
                  </span>
                </TableCell>
              </TableRow>
            ) : (
              filteredConfigs.map((config) => (
                <TableRow key={config.key}>
                  <TableCell>
                    {SECTION_LABELS[config.section ?? ""] || config.section}
                  </TableCell>
                  <TableCell>{config.label ?? config.key}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {config.type === "image" ? (
                      <span className="text-muted-foreground italic">
                        Clique para editar imagem
                      </span>
                    ) : config.type === "array" ? (
                      <span className="text-muted-foreground">
                        {(() => {
                          try {
                            return JSON.parse(config.value || "[]").length;
                          } catch {
                            return 0;
                          }
                        })()} itens
                      </span>
                    ) : (
                      config.value
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(config)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!editingConfig}
        onOpenChange={() => setEditingConfig(null)}
      >
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                Editar {editingConfig?.label ?? editingConfig?.key}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">{renderEditField()}</div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingConfig(null)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
