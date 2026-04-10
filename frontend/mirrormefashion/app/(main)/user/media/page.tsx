"use client"

import { Label } from "@/components/ui/label"
import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Upload, ImageIcon, Video, Trash2 } from "lucide-react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

interface MediaItem {
  id: string
  type: "image" | "video"
  url: string
  thumbnail?: string
  name: string
  uploadedAt: Date
  size?: string
}

const mockMedia: MediaItem[] = [
  {
    id: "1",
    type: "image",
    url: "/placeholder.svg?height=400&width=600",
    name: "Fashion Shoot 1",
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    size: "2.4 MB",
  },
  {
    id: "2",
    type: "video",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "/placeholder.svg?height=400&width=600",
    name: "Style Vlog Episode 1",
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    size: "15.2 MB",
  },
  {
    id: "3",
    type: "image",
    url: "/placeholder.svg?height=400&width=600",
    name: "Outfit of the Day",
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    size: "1.8 MB",
  },
  {
    id: "4",
    type: "image",
    url: "/placeholder.svg?height=400&width=600",
    name: "Summer Collection",
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    size: "3.1 MB",
  },
  {
    id: "5",
    type: "video",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "/placeholder.svg?height=400&width=600",
    name: "Behind the Scenes",
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    size: "22.5 MB",
  },
]

export default function MediaPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [activeTab, setActiveTab] = useState<"all" | "images" | "videos">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setMediaItems(mockMedia.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()))
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const filteredMedia = mediaItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = activeTab === "all" || item.type === activeTab.slice(0, -1)
    return matchesSearch && matchesType
  })

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        // Future API integration point
        // await deleteMediaItem(id)

        setMediaItems((prev) => prev.filter((item) => item.id !== id))
        toast({
          title: "Media deleted",
          description: "The media item has been successfully deleted.",
        })
      } catch (error) {
        toast({
          title: "Delete failed",
          description: "Failed to delete media item. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      // Validate files before upload
      const validFiles = Array.from(files).filter((file) => {
        const isValidType = file.type.startsWith("image/") || file.type.startsWith("video/")
        const isValidSize = file.size <= 50 * 1024 * 1024 // 50MB limit

        if (!isValidType) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not a valid image or video file.`,
            variant: "destructive",
          })
          return false
        }

        if (!isValidSize) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds the 50MB size limit.`,
            variant: "destructive",
          })
          return false
        }

        return true
      })

      if (validFiles.length === 0) {
        setUploading(false)
        return
      }

      // Future API integration point - replace this section
      // const uploadPromises = validFiles.map(file => uploadMediaFile(file))
      // const uploadResults = await Promise.all(uploadPromises)

      // Simulate API upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Process uploaded files (this will be replaced with API response data)
      const newMediaItems: MediaItem[] = validFiles.map((file) => {
        const fileUrl = URL.createObjectURL(file)
        return {
          id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
          type: file.type.startsWith("image/") ? "image" : "video",
          url: fileUrl,
          thumbnail: file.type.startsWith("video/") ? fileUrl : undefined,
          name: file.name.replace(/\.[^/.]+$/, ""),
          uploadedAt: new Date(),
          size: formatFileSize(file.size),
        }
      })

      setMediaItems((prev) => [...newMediaItems, ...prev])

      toast({
        title: "Upload successful",
        description: `${validFiles.length} file${validFiles.length > 1 ? "s" : ""} uploaded successfully.`,
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your files. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      event.target.value = ""
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6 pb-24 md:pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600 mt-1">Manage your images and videos</p>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            type="file"
            multiple
            className="hidden"
            id="media-upload-input"
            onChange={handleUpload}
            accept="image/*,video/*"
            disabled={uploading}
          />
          <Label htmlFor="media-upload-input" className="cursor-pointer">
            <Button asChild className="bg-red-600 hover:bg-red-700 text-white" disabled={uploading}>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? "Uploading..." : "Upload Media"}
              </span>
            </Button>
          </Label>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search media..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value as "all" | "images" | "videos")}>
              <TabsList className="grid w-full grid-cols-3 sm:w-auto">
                <TabsTrigger value="all">All ({mediaItems.length})</TabsTrigger>
                <TabsTrigger value="images">
                  Images ({mediaItems.filter((item) => item.type === "image").length})
                </TabsTrigger>
                <TabsTrigger value="videos">
                  Videos ({mediaItems.filter((item) => item.type === "video").length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <AspectRatio ratio={16 / 9}>
                <Skeleton className="w-full h-full rounded-t-lg" />
              </AspectRatio>
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-8 w-full mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <ImageIcon className="mx-auto h-16 w-16 mb-4" />
          <p className="text-xl font-semibold mb-2">{searchTerm ? "No media found" : "No media uploaded yet"}</p>
          <p className="text-sm">
            {searchTerm ? "Try adjusting your search or filters." : "Upload your first image or video to get started."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMedia.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <AspectRatio ratio={16 / 9}>
                {item.type === "image" ? (
                  <Image
                    src={item.url || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="relative w-full h-full bg-black flex items-center justify-center">
                    {item.thumbnail && (
                      <Image
                        src={item.thumbnail || "/placeholder.svg"}
                        alt={`${item.name} thumbnail`}
                        fill
                        className="object-cover opacity-70"
                      />
                    )}
                    <Video className="h-12 w-12 text-white absolute z-10" />
                    <iframe
                      src={item.url}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full opacity-0 hover:opacity-100 transition-opacity"
                      title={item.name}
                    ></iframe>
                  </div>
                )}
              </AspectRatio>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm truncate mb-1">{item.name}</h3>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{item.type === "image" ? "Image" : "Video"}</span>
                  <span>{item.size}</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">Uploaded {item.uploadedAt.toLocaleDateString()}</p>
                <Button variant="destructive" size="sm" className="w-full" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {uploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
              <span className="text-lg font-medium">Uploading files...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
