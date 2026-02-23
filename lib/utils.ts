import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD") // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .trim()
    .replace(/[^a-z0-9 -]/g, "") // Remove invalid characters
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/-+/g, "-"); // Replace multiple - with single -
}
