export interface ProductImage {
  id: string
  type: "front" | "back" | "additional"
  file?: File
  url?: string
  preview: string
  uploadedAt?: string
}

export interface ProductSize {
  size: string
  measurements?: Record<string, number>
}
