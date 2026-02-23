"use client";

import { useState } from "react";
import Link from "next/link";

import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Producer {
  id: string;
  name: string;
  slug: string;
  location?: string | null;
  avatar_url?: string | null;
}

interface ProducerListProps {
  associates: Producer[];
}

export function ProducerList({ associates }: ProducerListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_COUNT = 3;

  const displayedAssociates = isExpanded ? associates : associates.slice(0, INITIAL_COUNT);
  const hasMore = associates.length > INITIAL_COUNT;

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Produzido por {associates.length > 1 ? `(${associates.length})` : ""}
      </p>
      <div className="grid gap-3">
        {displayedAssociates.map((associate) => (
          <Link 
            key={associate.id}
            href={`/associados/${associate.slug}`} 
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group border border-transparent hover:border-border"
          >
            <div className="relative h-10 w-10 rounded-full overflow-hidden border shrink-0">
              <ImageWithFallback 
                src={associate.avatar_url} 
                fallbackType="associate"
                alt={associate.name}
                fill
                className="object-cover"
                iconClassName="h-5 w-5"
              />
            </div>
            <div>
              <p className="font-medium group-hover:text-primary transition-colors">{associate.name}</p>
              {associate.location && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {associate.location}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
      
      {hasMore && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-muted-foreground hover:text-primary"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" />
              Mostrar menos
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" />
              Ver mais {associates.length - INITIAL_COUNT} produtores
            </>
          )}
        </Button>
      )}
    </div>
  );
}
