export interface ProductImage {
  id: string
  type: "front" | "back" | "additional"
  file?: File
  url?: string
  preview: string
  width?: number
  height?: number
  uploadedAt?: string
}

export interface ProductSize {
  classification: string  // e.g., "US 0 - 2 (Extra Small)"
  measurement: string     // e.g., "34 - 38cm" - measurements in cm
  sizeKey?: string        // optional key for standard sizes like "xs", "s", "m", "l"
}
