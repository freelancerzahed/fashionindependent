/**
 * Calculate affiliate commission based on pledge amount
 * Business plan: $1 per pledge
 */
export function calculateAffiliateCommission(pledgeAmount: number): number {
  return 1 // Fixed $1 per pledge as per business plan
}

/**
 * Validate tech pack file
 */
export function validateTechPack(file: File): { valid: boolean; error?: string } {
  const validExtensions = [".pdf", ".doc", ".docx", ".xlsx", ".xls"]
  const fileName = file.name.toLowerCase()
  const hasValidExtension = validExtensions.some((ext) => fileName.endsWith(ext))

  if (!hasValidExtension) {
    return {
      valid: false,
      error: `Invalid file type. Accepted formats: ${validExtensions.join(", ")}`,
    }
  }

  const maxSize = 50 * 1024 * 1024 // 50MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File size exceeds 50MB limit",
    }
  }

  return { valid: true }
}

/**
 * Validate product sample or CAD file
 */
export function validateProductFile(file: File): { valid: boolean; error?: string } {
  const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".obj", ".fbx", ".gltf", ".glb"]
  const fileName = file.name.toLowerCase()
  const hasValidExtension = validExtensions.some((ext) => fileName.endsWith(ext))

  if (!hasValidExtension) {
    return {
      valid: false,
      error: `Invalid file type. Accepted formats: ${validExtensions.join(", ")}`,
    }
  }

  const maxSize = 100 * 1024 * 1024 // 100MB for 3D files
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File size exceeds 100MB limit",
    }
  }

  return { valid: true }
}

/**
 * Process file upload and return URL
 * In production, this would upload to cloud storage (Vercel Blob, S3, etc.)
 */
export async function processFileUpload(file: File): Promise<{ url: string; error?: string }> {
  try {
    // Simulate file upload - in production, use actual storage service
    const formData = new FormData()
    formData.append("file", file)

    // For now, return a mock URL
    const mockUrl = URL.createObjectURL(file)
    console.log("[v0] File uploaded:", file.name, "Mock URL:", mockUrl)

    return { url: mockUrl }
  } catch (error) {
    return {
      url: "",
      error: `Failed to upload file: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

/**
 * Calculate platform revenue breakdown
 */
export function calculateRevenueBreakdown(
  totalDonations: number,
  manufacturingCost: number,
): {
  platformFee: number
  creatorPayout: number
  manufacturingCost: number
} {
  const platformFee = totalDonations * 0.1 // 10% platform fee
  const creatorPayout = totalDonations - platformFee - manufacturingCost

  return {
    platformFee,
    creatorPayout: Math.max(0, creatorPayout), // Ensure non-negative
    manufacturingCost,
  }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

/**
 * Calculate campaign progress percentage
 */
export function calculateProgressPercentage(currentAmount: number, goalAmount: number): number {
  if (goalAmount === 0) return 0
  return Math.min((currentAmount / goalAmount) * 100, 100)
}
