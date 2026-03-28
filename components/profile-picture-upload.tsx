"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { Upload, X, AlertCircle, CheckCircle } from "lucide-react"
import { BACKEND_URL } from "@/config"

interface ProfilePictureUploadProps {
  onSuccess?: () => void
}

export function ProfilePictureUpload({ onSuccess }: ProfilePictureUploadProps = {}) {
  const { user, token } = useAuth()
  const [preview, setPreview] = useState<string | null>(user?.avatar || null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setSuccess(null)

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB")
      return
    }

    // Set preview and file
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setPreview(result)
    }
    reader.readAsDataURL(file)
    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile || !token) {
      setError("Missing file or authentication token")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append("image", selectedFile)

      console.log("[ProfilePictureUpload] FormData created")

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 15, 90))
      }, 200)

      const uploadUrl = `${BACKEND_URL}/auth/profile/image/upload`
      console.log("[ProfilePictureUpload] ===== UPLOAD REQUEST =====")
      console.log("[ProfilePictureUpload] URL:", uploadUrl)
      console.log("[ProfilePictureUpload] Method: POST")
      console.log("[ProfilePictureUpload] File: " + selectedFile.name + " (" + selectedFile.size + " bytes, " + selectedFile.type + ")")
      console.log("[ProfilePictureUpload] Auth: Bearer [token length: " + token.length + "]")

      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      clearInterval(progressInterval)

      console.log("[ProfilePictureUpload] ===== UPLOAD RESPONSE =====")
      console.log("[ProfilePictureUpload] Status:", response.status, response.statusText)
      console.log("[ProfilePictureUpload] Content-Type:", response.headers.get("content-type"))

      // Check content type before trying to parse
      let data: any = {}
      const contentType = response.headers.get("content-type")
      const isJsonResponse = contentType && contentType.includes("application/json")

      try {
        if (isJsonResponse) {
          console.log("[ProfilePictureUpload] Response is JSON, parsing...")
          data = await response.json()
          console.log("[ProfilePictureUpload] JSON response:", data)
        } else {
          console.log("[ProfilePictureUpload] Response is not JSON, reading as text...")
          const responseText = await response.text()
          console.log("[ProfilePictureUpload] Raw response:", responseText.substring(0, 300))
          
          if (responseText) {
            try {
              data = JSON.parse(responseText)
              console.log("[ProfilePictureUpload] Parsed JSON from text:", data)
            } catch (e) {
              console.log("[ProfilePictureUpload] Could not parse text as JSON")
              data = { error: responseText }
            }
          }
        }
      } catch (readError) {
        console.error("[ProfilePictureUpload] Error reading response:", readError)
        throw new Error(`Failed to read server response: ${readError}`)
      }

      // Check if response was successful
      if (!response.ok) {
        console.log("[ProfilePictureUpload] Response not OK (status: " + response.status + ")")
        throw new Error(data?.message || data?.error || `Upload failed: ${response.status} ${response.statusText}`)
      }

      console.log("[ProfilePictureUpload] ===== SUCCESS =====")
      console.log("[ProfilePictureUpload] Response data:", data)
      console.log("[ProfilePictureUpload] Response data.status:", data?.status)
      console.log("[ProfilePictureUpload] Response data.data:", data?.data)
      console.log("[ProfilePictureUpload] Response data.data.image_path:", data?.data?.image_path)

      if (!data.status) {
        console.log("[ProfilePictureUpload] ERROR: Response status is false")
        throw new Error(data.message || "Upload failed")
      }

      if (!data.data?.image_path) {
        console.log("[ProfilePictureUpload] ERROR: No image_path in response")
        console.log("[ProfilePictureUpload] Full response data:", JSON.stringify(data))
        throw new Error("No image path returned from server")
      }

      // Convert relative path to proxy URL
      const imagePath = data.data.image_path
      const proxyUrl = `/api/storage/${imagePath}`

      setUploadProgress(100)
      setSuccess("Profile picture updated successfully!")
      setSelectedFile(null)

      console.log("[ProfilePictureUpload] Upload successful!")
      console.log("[ProfilePictureUpload] Image path:", imagePath)
      console.log("[ProfilePictureUpload] Proxy URL:", proxyUrl)

      // Update localStorage with new avatar
      if (user && imagePath) {
        const updatedUser = { ...user, avatar: proxyUrl }
        localStorage.setItem("user", JSON.stringify(updatedUser))
        console.log("[ProfilePictureUpload] Avatar updated:", proxyUrl)
      }

      // Call onSuccess callback
      if (onSuccess) {
        setTimeout(onSuccess, 1500)
      }

      // Reset after 2 seconds
      setTimeout(() => {
        setPreview(null)
        setUploadProgress(0)
      }, 2000)
    } catch (err) {
      let errorMessage = "Failed to upload profile picture"
      let errorStack = "N/A"
      let errorType = "Unknown"
      
      // Safely extract error information
      if (err instanceof Error) {
        errorMessage = err.message
        errorStack = err.stack || "N/A"
        errorType = err.constructor?.name || "Error"
      } else if (typeof err === "string") {
        errorMessage = err
        errorType = "String"
      } else {
        errorMessage = String(err)
        errorType = typeof err
      }
      
      // Provide helpful error messages based on error type
      let helpMessage = errorMessage
      if (errorMessage.includes("Failed to fetch")) {
        helpMessage = "Connection failed. Make sure the backend server is running. Check if Laragon Apache is active."
      } else if (errorMessage.includes("Unauthorized")) {
        helpMessage = "Authentication failed. Your session may have expired. Please log out and log back in."
      } else if (errorMessage.includes("422")) {
        helpMessage = "Invalid file. Make sure it's an image file less than 5MB."
      } else if (errorMessage.includes("Unexpected end of JSON input") || errorMessage.includes("Invalid response")) {
        helpMessage = "Backend returned invalid response. Check if the API endpoint exists or if there's a server error."
      }
      
      // Simple, reliable error logging
      console.log("[ProfilePictureUpload] === ERROR ===")
      console.log("[ProfilePictureUpload] Type: " + errorType)
      console.log("[ProfilePictureUpload] Message: " + errorMessage)
      console.log("[ProfilePictureUpload] Suggested fix: " + helpMessage)
      console.log("[ProfilePictureUpload] Stack trace: " + errorStack)
      console.log("[ProfilePictureUpload] === DIAGNOSTICS ===")
      console.log("[ProfilePictureUpload] Backend URL: " + BACKEND_URL)
      console.log("[ProfilePictureUpload] Token: " + (token ? "✓ Present (" + token.length + " chars)" : "✗ Missing"))
      console.log("[ProfilePictureUpload] File: " + (selectedFile ? "✓ " + selectedFile.name + " (" + selectedFile.size + " bytes)" : "✗ Missing"))
      console.log("[ProfilePictureUpload] === NEXT STEPS ===")
      console.log("[ProfilePictureUpload] 1. Review error details above")
      console.log("[ProfilePictureUpload] 2. Go to Settings > Profile Picture Upload Issues?")
      console.log("[ProfilePictureUpload] 3. Click 'Run Diagnostics' or 'Test Upload'")
      
      setError(helpMessage)
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

        <div className="space-y-3 flex-1">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

          {/* Error Message */}
          {error && (
            <div className="flex gap-2 items-start p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex gap-2 items-start p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {/* Progress Bar */}
          {isLoading && uploadProgress > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-neutral-600">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Choose Photo
          </Button>

          {selectedFile && !isLoading && (
            <div className="flex gap-2">
              <Button size="sm" onClick={handleUpload} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                Save Photo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemove}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-neutral-500">
        Recommended: Square image, at least 400x400px. Max file size: 5MB
      </p>
    </div>
  )
}
