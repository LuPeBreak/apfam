"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { Calendar, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";
import { InitialsAvatar } from "@/components/ui/initials-avatar";

interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
  src?: string | null;
  fallbackType: 'product' | 'associate' | 'event';
  iconClassName?: string;
  name?: string; // used for associate initials fallback
}

export function ImageWithFallback({ 
  src, 
  fallbackType, 
  alt, 
  className, 
  iconClassName,
  name,
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
        {fallbackType === 'associate' && name ? (
          <InitialsAvatar name={name} size="xl" className={iconClassName} />
        ) : fallbackType === 'associate' ? (
          // fallback icon if no name provided (shouldn't happen for associates)
          <span className={cn("text-4xl font-bold text-muted-foreground/30", iconClassName)}>?</span>
        ) : null}
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
