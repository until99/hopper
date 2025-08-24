import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names and merges Tailwind CSS classes
 * @param {...(string | object | undefined)} inputs - Class names to combine
 * @returns {string} Combined class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
