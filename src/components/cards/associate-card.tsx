import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import type { AssociateModel } from "@/types/models";

export function AssociateCard({
  associate,
  variant = "default",
}: {
  associate: AssociateModel;
  variant?: "default" | "home";
}) {
  const isHome = variant === "home";

  return (
    <Link href={`/associados/${associate.slug}`} className="block group h-full">
      <div
        className={`rounded-2xl p-6 border transition-all text-center h-full flex flex-col items-center ${
          isHome
            ? "bg-white/10 backdrop-blur-md border-white/10 hover:bg-white/20"
            : "bg-primary/5 border-border/50 group-hover:border-primary/30 hover:shadow-md"
        }`}
      >
        {/* Avatar Circular */}
        <div
          className={`relative w-24 h-24 mb-4 rounded-full overflow-hidden flex items-center justify-center border-4 group-hover:scale-105 transition-transform duration-300 shadow-sm ${
            isHome
              ? "bg-white/20 border-white/30"
              : "bg-primary/10 border-background"
          }`}
        >
          {associate.avatarUrl ? (
            <Image
              src={associate.avatarUrl}
              alt={associate.name}
              fill
              className="object-cover"
            />
          ) : (
            <ImagePlaceholder
              name={associate.name}
              className="absolute inset-0"
              textClassName={`text-3xl ${isHome ? "text-white/60" : "text-primary/60"}`}
            />
          )}
        </div>

        <h3
          className={`text-lg font-bold mb-2 transition-colors ${
            isHome
              ? "text-white group-hover:text-white/90"
              : "text-foreground group-hover:text-primary"
          }`}
        >
          {associate.name}
        </h3>

        {associate.location && (
          <div
            className={`mt-auto flex items-center justify-center gap-2 text-sm ${
              isHome ? "text-white/80" : "text-muted-foreground"
            }`}
          >
            <MapPin
              className={`w-4 h-4 shrink-0 ${isHome ? "text-white/80" : "text-primary/70"}`}
            />
            <span className="line-clamp-1">{associate.location}</span>
          </div>
        )}

        {associate.bio && !isHome && (
          <p className="text-sm text-foreground/70 line-clamp-2 mt-3">
            {associate.bio}
          </p>
        )}
      </div>
    </Link>
  );
}
