import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currencyCode = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(amount)
}


/**
 * Converts camelCase or PascalCase to human-readable text.
 * Capitalizes each word and preserves common abbreviations (ID, URL, API, etc.).
 */
export function formatLabel(text: string): string {
  const abbreviations = ["ID", "URL", "API", "HTML", "CSS"];

  // Step 1: Add spaces before uppercase letters
  let result = text.replace(/([A-Z])/g, ' $1').trim();

  // Step 2: Capitalize first letter of each word, except known abbreviations
  result = result
    .split(' ')
    .map((word) => {
      return abbreviations.includes(word.toUpperCase()) 
        ? word.toUpperCase() 
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');

  return result;
}


// utils/shortenText.ts

/**
 * Truncate a sentence to the first 20 characters.
 * Adds "..." if the sentence is longer than 20.
 *
 * @param text - The sentence or string to shorten
 * @param limit - Optional limit (default: 20)
 * @returns Shortened text with ellipsis if needed
 */
export function shortenText(text: string, limit: number = 20): string {
  if (!text) return "";
  return text.length > limit ? text.slice(0, limit) + "..." : text;
}
