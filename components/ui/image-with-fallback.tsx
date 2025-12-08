"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { User, Calendar, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
  src?: string | null;
  fallbackType: 'product' | 'associate' | 'event';
  iconClassName?: string;
}

export function ImageWithFallback({ 
  src, 
  fallbackType, 
  alt, 
  className, 
  iconClassName,
  ...props 
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setError(false);
  }

  const hasSrc = src && src.trim().length > 0;

  if (!hasSrc || error) {
    return (
      <div className={cn("flex items-center justify-center bg-muted h-full w-full", className)}>
        {fallbackType === 'associate' && <User className={cn("h-12 w-12 text-muted-foreground/50", iconClassName)} />}
        {fallbackType === 'product' && <Sprout className={cn("h-12 w-12 text-muted-foreground/50", iconClassName)} />}
        {fallbackType === 'event' && <Calendar className={cn("h-12 w-12 text-muted-foreground/50", iconClassName)} />}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
