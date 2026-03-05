import { cn, getInitials } from "@/lib/utils";

interface ImagePlaceholderProps {
  name: string;
  className?: string;
  textClassName?: string;
}

export function ImagePlaceholder({
  name,
  className,
  textClassName,
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-muted",
        className,
      )}
    >
      <span
        className={cn(
          "font-bold uppercase text-muted-foreground",
          textClassName,
        )}
      >
        {getInitials(name)}
      </span>
    </div>
  );
}
