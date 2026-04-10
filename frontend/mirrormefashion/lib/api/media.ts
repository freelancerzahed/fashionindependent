// Media API service functions for future backend integration

export interface UploadResponse {
  id: string
  url: string
  thumbnail?: string
  name: string
  type: "image" | "video"
  size: number
  uploadedAt: string
}

export interface MediaItem {
  id: string
  type: "image" | "video"
  url: string
  thumbnail?: string
  name: string
  uploadedAt: Date
  size?: string
  userId?: string
}

// Upload single file to backend
export async function uploadMediaFile(file: File): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("type", file.type.startsWith("image/") ? "image" : "video")

  const response = await fetch("/api/media/upload", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Upload failed")
  }

  return response.json()
}

// Upload multiple files
export async function uploadMultipleFiles(files: File[]): Promise<UploadResponse[]> {
  const uploadPromises = files.map((file) => uploadMediaFile(file))
  return Promise.all(uploadPromises)
}

// Get user's media items
export async function getUserMedia(userId?: string): Promise<MediaItem[]> {
  const url = userId ? `/api/media?userId=${userId}` : "/api/media"

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch media")
  }

  const data = await response.json()
  return data.items || []
}

// Delete media item
export async function deleteMediaItem(id: string): Promise<void> {
  const response = await fetch(`/api/media/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete media")
  }
}

// Update media item (rename, etc.)
export async function updateMediaItem(id: string, updates: Partial<MediaItem>): Promise<MediaItem> {
  const response = await fetch(`/api/media/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    throw new Error("Failed to update media")
  }

  return response.json()
}

// Search media items
export async function searchMedia(query: string, type?: "image" | "video"): Promise<MediaItem[]> {
  const params = new URLSearchParams({ q: query })
  if (type) params.append("type", type)

  const response = await fetch(`/api/media/search?${params}`)

  if (!response.ok) {
    throw new Error("Search failed")
  }

  const data = await response.json()
  return data.items || []
}
