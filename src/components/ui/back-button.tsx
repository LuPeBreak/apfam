"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  href: string;
  label: string;
  className?: string;
  variant?: "hero" | "default";
}

export function BackButton({
  href,
  label,
  className,
  variant = "default",
}: BackButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      asChild
      className={cn(
        "group h-10 px-4 rounded-full transition-all duration-300",
        variant === "hero"
          ? "bg-background/20 hover:bg-background/40 text-white border-white/20 backdrop-blur-md hover:border-white/40 shadow-lg"
          : "bg-background hover:bg-muted text-muted-foreground hover:text-foreground border-border/50 shadow-sm",
        className,
      )}
    >
      <Link href={href}>
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        <span className="font-semibold">{label}</span>
      </Link>
    </Button>
  );
}
