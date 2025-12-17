"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { Upload, X } from "lucide-react"

export function ProfilePictureUpload() {
  const { user } = useAuth()
  const [preview, setPreview] = useState<string | null>(user?.avatar || null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setPreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!preview) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update user avatar in localStorage
      if (user) {
        const updatedUser = { ...user, avatar: preview }
        localStorage.setItem("user", JSON.stringify(updatedUser))
      }

      alert("Profile picture updated successfully!")
    } catch (error) {
      console.error("Error uploading profile picture:", error)
      alert("Failed to upload profile picture")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getInitials = () => {
    if (!user?.name) return "U"
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={preview || undefined} alt={user?.name} />
          <AvatarFallback className="text-lg font-semibold">{getInitials()}</AvatarFallback>
        </Avatar>

        <div className="space-y-3">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-2">
            <Upload className="h-4 w-4" />
            Choose Photo
          </Button>

          {preview && (
            <div className="flex gap-2">
              <Button size="sm" onClick={handleUpload} disabled={isLoading} className="gap-2">
                {isLoading ? "Uploading..." : "Save Photo"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemove}
                disabled={isLoading}
                className="gap-2 bg-transparent"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-neutral-500">Recommended: Square image, at least 400x400px. Max file size: 5MB</p>
    </div>
  )
}
