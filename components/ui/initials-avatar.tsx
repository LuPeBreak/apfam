import { cn } from "@/lib/utils";

interface InitialsAvatarProps {
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

// Deterministic color based on name
function getColor(name: string): string {
  const colors = [
    "bg-emerald-600",
    "bg-teal-600",
    "bg-green-700",
    "bg-lime-600",
    "bg-cyan-600",
    "bg-sky-600",
    "bg-indigo-600",
    "bg-violet-600",
    "bg-amber-600",
    "bg-orange-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-xl",
  xl: "h-24 w-24 text-3xl",
};

export function InitialsAvatar({ name, className, size = "md" }: InitialsAvatarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-semibold text-white select-none shrink-0",
        sizeClasses[size],
        getColor(name),
        className
      )}
      aria-label={`Avatar de ${name}`}
    >
      {getInitials(name)}
    </div>
  );
}
