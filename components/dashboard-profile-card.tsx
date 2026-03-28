"use client"

import React, { useState, useEffect } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProfilePictureUpload } from "@/components/profile-picture-upload"
import { useAuth } from "@/lib/auth-context"
import { Camera } from "lucide-react"

export function DashboardProfileCard() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [avatarRefresh, setAvatarRefresh] = useState(0)
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null)

  // Initialize avatar from user, converting relative paths to proxy URL
  useEffect(() => {
    if (user?.avatar) {
      // If avatar is a relative path (doesn't start with /) convert it to proxy URL
      const avatarUrl = user.avatar.startsWith('/') || user.avatar.startsWith('http')
        ? user.avatar
        : `/api/storage/${user.avatar}`
      console.log('[DashboardProfileCard] Initialized avatar:', avatarUrl)
      setCurrentAvatar(avatarUrl)
    }
  }, [user?.avatar])

  if (!user) return null

  const userInitials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U"

  // Use currentAvatar which gets updated after upload, with cache bust query param
  const profileImageUrl = currentAvatar ? `${currentAvatar}?t=${avatarRefresh}` : null

  return (
    <>
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Profile</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Change Photo
            </Button>
          </div>

          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-24 w-24 border-2 border-neutral-200">
                <AvatarImage src={profileImageUrl || ""} alt={user.name} onLoad={() => console.log('[DashboardProfileCard] Avatar loaded:', profileImageUrl)} onError={() => console.log('[DashboardProfileCard] Avatar failed to load:', profileImageUrl)} />
                <AvatarFallback className="bg-neutral-100 text-lg font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => setIsOpen(true)}
                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors shadow-lg"
                aria-label="Change profile picture"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 pt-2">
              <h3 className="text-lg font-semibold text-neutral-900">{user.name}</h3>
              {user.email && (
                <p className="text-sm text-neutral-600 mb-3">{user.email}</p>
              )}
              <div className="space-y-2">
                {user.role && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700">Role:</span>
                    <span className="text-sm text-neutral-600 capitalize">{user.role}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Modal Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <ProfilePictureUpload 
              onSuccess={() => {
                console.log('[DashboardProfileCard] Upload success - refreshing avatar')
                setIsOpen(false)
                
                // Read the updated user data from localStorage after upload
                const updatedUserStr = localStorage.getItem('user')
                if (updatedUserStr) {
                  try {
                    const updatedUser = JSON.parse(updatedUserStr)
                    if (updatedUser.avatar) {
                      console.log('[DashboardProfileCard] Updated avatar from localStorage:', updatedUser.avatar)
                      setCurrentAvatar(updatedUser.avatar)
                      // Force refresh avatar by updating refresh token
                      setAvatarRefresh(prev => prev + 1)
                    }
                  } catch (e) {
                    console.error('[DashboardProfileCard] Failed to parse updated user:', e)
                  }
                }
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
