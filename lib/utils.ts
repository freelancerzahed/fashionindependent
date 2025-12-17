import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// -------------------------------------
// 📌 Step Generator Utility
// -------------------------------------
export function generateStep(ticks: number, min: number = 0, max: number = 1): number {
   if (ticks <= 1) return 1 // avoid divide-by-zero
  const range = max - min
  return Number((range / (ticks - 1)).toFixed(4)) // ✅ use (ticks - 1)
}