"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ImageCropper from "@/components/image-cropper"
import { compressImage, formatFileSize } from "@/lib/image-utils"
import { Upload, X, Camera, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost/mirrormefashion/api/v2"

export interface ProfileImageUploadProps {
  currentImage?: string | null
  onUploadSuccess?: (imageUrl: string) => void
  onUploadError?: (error: string) => void
  userName?: string
  userInitials?: string
}

export default function ProfileImageUpload({
  currentImage = null,
  onUploadSuccess,
  onUploadError,
  userName = "User",
  userInitials = "U",
}: ProfileImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragAreaRef = useRef<HTMLDivElement>(null)

  const [image, setImage] = useState<string | null>(currentImage)
  const [sourceImage, setSourceImage] = useState<string | null>(null)
  const [isShowingCropper, setIsShowingCropper] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [fileInfo, setFileInfo] = useState<{ size: string; name: string } | null>(null)

  // Sync internal image state with prop changes (for profile updates)
  useEffect(() => {
    console.log('[ProfileImageUpload] useEffect - currentImage changed:', currentImage)
    console.log('[ProfileImageUpload] current image state:', image)
    if (currentImage && currentImage !== image) {
      console.log('[ProfileImageUpload] Updating image from prop:', currentImage)
      setImage(currentImage)
    }
  }, [currentImage, image])

  const handleFileSelect = async (file: File) => {
    setError(null)
    setSuccess(null)

    try {
      // Validate file
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
      if (!validTypes.includes(file.type)) {
        setError("Please select a valid image file (JPEG, PNG, GIF, or WebP)")
        return
      }

      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        setError(`File size must be less than 5MB (current: ${formatFileSize(file.size)})`)
        return
      }

      // Read file
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        setSourceImage(imageData)
        setFileInfo({
          size: formatFileSize(file.size),
          name: file.name,
        })
        setIsShowingCropper(true)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setError("Failed to read file")
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    dragAreaRef.current?.classList.add("border-primary-600", "bg-primary-50")
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    dragAreaRef.current?.classList.remove("border-primary-600", "bg-primary-50")
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    dragAreaRef.current?.classList.remove("border-primary-600", "bg-primary-50")

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleCropComplete = async (croppedBlob: Blob) => {
    setIsShowingCropper(false)
    setIsUploading(true)
    setError(null)
    setSuccess(null)
    setUploadProgress(0)

    try {
      // Compress the cropped image
      const compressedBlob = await compressImage(new File([croppedBlob], "avatar.jpg"), {
        quality: 0.85,
        maxWidth: 500,
        maxHeight: 500,
      })

      // Show preview
      const previewUrl = URL.createObjectURL(compressedBlob)
      setImage(previewUrl)

      // Upload to server
      const formData = new FormData()
      formData.append("image", new File([compressedBlob], "avatar.jpg", { type: "image/jpeg" }))

      // Simulate progress
      let progress = 0
      const progressInterval = setInterval(() => {
        progress = Math.min(progress + 15, 90)
        setUploadProgress(progress)
      }, 100)

      const token = localStorage.getItem("token")
      const response = await fetch(`${BACKEND_URL}/auth/profile/image/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Upload failed")
      }

      const data = await response.json()
      setUploadProgress(100)
      setSuccess("Profile image updated successfully!")

      // Call callback with the image URL - convert path to /api/storage format
      if (onUploadSuccess && data.data?.image_path) {
        const imageUrl = `/api/storage/${data.data.image_path}`
        onUploadSuccess(imageUrl)
      }

      // Reset progress after 2 seconds
      setTimeout(() => {
        setUploadProgress(0)
      }, 2000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to upload image"
      setError(errorMessage)
      if (onUploadError) {
        onUploadError(errorMessage)
      }
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = async () => {
    try {
      setIsUploading(true)
      const token = localStorage.getItem("token")

      const response = await fetch(`${BACKEND_URL}/auth/profile/image/remove`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to remove image")
      }

      setImage(null)
      setSuccess("Profile image removed successfully")
      if (onUploadSuccess) {
        onUploadSuccess("")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to remove image"
      setError(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  if (isShowingCropper && sourceImage) {
    return (
      <ImageCropper
        image={sourceImage}
        cropShape="circle"
        onCropComplete={handleCropComplete}
        onCancel={() => {
          setIsShowingCropper(false)
          setSourceImage(null)
        }}
      />
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-primary-600">Profile Picture</CardTitle>
        <CardDescription>Upload and manage your profile image</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Avatar Display */}
        <div className="flex justify-center">
          <Avatar className="w-32 h-32 border-4 border-primary-600 shadow-lg">
            <AvatarImage src={image || currentImage || undefined} alt={userName} onError={() => console.log('[Avatar] Image failed to load from:', image || currentImage)} onLoad={() => console.log('[Avatar] Image loaded successfully from:', image || currentImage)} />
            <AvatarFallback className="text-2xl bg-gradient-to-br from-primary-600 to-primary-700 text-white">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Debug URLs */}
        {(image || currentImage) && (
          <div className="text-xs text-gray-500 text-center bg-gray-50 p-2 rounded">
            <p>Image state: {image ? '✓ LOCAL' : '✗ EMPTY'}</p>
            <p>CurrentImage prop: {currentImage ? '✓ SET' : '✗ EMPTY'}</p>
            <p className="font-mono break-all text-blue-600">
              Using: {image || currentImage}
            </p>
          </div>
        )}

        {/* File Info */}
        {fileInfo && (
          <div className="text-sm text-gray-600 text-center">
            <p>
              <strong>File:</strong> {fileInfo.name}
            </p>
            <p>
              <strong>Size:</strong> {fileInfo.size}
            </p>
          </div>
        )}

        {/* Alert Messages */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Progress Bar */}
        {isUploading && uploadProgress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading...</span>
              <span className="font-semibold">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Drag and Drop Area */}
        <div
          ref={dragAreaRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-all duration-200 hover:border-primary-600 hover:bg-primary-50"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            disabled={isUploading}
          />

          <div className="space-y-2">
            <div className="flex justify-center">
              {isUploading ? (
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-700">Drag and drop your image</p>
              <p className="text-sm text-gray-500">or click to select from your computer</p>
            </div>
            <p className="text-xs text-gray-400">Supported formats: JPEG, PNG, GIF, WebP (Max 5MB)</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex-1 gap-2 bg-primary-600 hover:bg-primary-700"
          >
            <Camera className="w-4 h-4" />
            Change Image
          </Button>

          {image && (
            <Button
              onClick={handleRemoveImage}
              disabled={isUploading}
              variant="outline"
              className="flex-1 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <X className="w-4 h-4" />
              Remove
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
