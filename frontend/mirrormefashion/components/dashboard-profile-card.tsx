"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"
import { useState } from "react"
import ProfileImageUpload from "@/components/profile-image-upload"

export interface DashboardProfileCardProps {
  name?: string
  email?: string
  avatar?: string | null
  onImageUpdate?: (imageUrl: string) => void
}

export default function DashboardProfileCard({
  name = "User",
  email = "user@example.com",
  avatar = null,
  onImageUpdate,
}: DashboardProfileCardProps) {
  const [showUploadModal, setShowUploadModal] = useState(false)

  const userInitials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  if (showUploadModal) {
    return (
      <Card className="mb-6 border-primary-200">
        <CardContent className="p-6">
          <div className="mb-4">
            <Button
              variant="outline"
              onClick={() => setShowUploadModal(false)}
              className="text-sm"
            >
              ← Back to Dashboard
            </Button>
          </div>
          <ProfileImageUpload
            currentImage={avatar}
            onUploadSuccess={(imageUrl) => {
              setShowUploadModal(false)
              if (onImageUpdate) {
                onImageUpdate(imageUrl)
              }
            }}
            userName={name}
            userInitials={userInitials}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-6 bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-3 border-primary-600 shadow-md">
              <AvatarImage src={avatar || undefined} alt={name} />
              <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-primary-600 to-primary-700 text-white">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{name}</h2>
              <p className="text-sm text-gray-600">{email}</p>
              <p className="text-xs text-primary-600 mt-1">👤 Profile</p>
            </div>
          </div>
          <Button
            onClick={() => setShowUploadModal(true)}
            className="gap-2 bg-primary-600 hover:bg-primary-700 text-white"
          >
            <Camera className="w-4 h-4" />
            Change Photo
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
