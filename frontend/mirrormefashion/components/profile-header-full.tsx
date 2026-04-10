"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { Camera, MapPin, Calendar, Edit, Share, X, Check, Globe, Mail } from 'lucide-react'
import Image from "next/image"

interface User {
  id: number
  name: string
  email: string
  avatar: string
  verified: boolean
  bio?: string
  location?: string
  website?: string
  phone?: string
  coverPhoto?: string
}

interface ProfileHeaderProps {
  user: User
  onUserUpdate: (user: User) => void
}

export default function ProfileHeader({ user, onUserUpdate }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: user.name || "",
    bio:
      user.bio ||
      "Fashion enthusiast & style creator. Sharing my daily outfits and fashion tips. DM for collaborations! ✨",
    location: user.location || "New York, NY",
    website: user.website || "zahed-fashion.com",
    phone: user.phone || "",
  })
  const [isUploading, setIsUploading] = useState(false)
  const [isCoverUploading, setIsCoverUploading] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const profileStats = {
    posts: 24,
    followers: 1250,
    following: 890,
    likes: 4560,
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const imageUrl = URL.createObjectURL(file)
      const updatedUser = { ...user, avatar: imageUrl }
      onUserUpdate(updatedUser)

      toast({
        title: "Profile picture updated!",
        description: "Your new profile picture has been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to update profile picture. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive",
      })
      return
    }

    setIsCoverUploading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const imageUrl = URL.createObjectURL(file)
      const updatedUser = { ...user, coverPhoto: imageUrl }
      onUserUpdate(updatedUser)

      toast({
        title: "Cover photo updated!",
        description: "Your new cover photo has been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to update cover photo. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCoverUploading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedUser = { ...user, ...editForm }
      onUserUpdate(updatedUser)
      setIsEditing(false)

      toast({
        title: "Profile updated!",
        description: "Your profile information has been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: `${user.name}'s Profile`,
      text: `Check out ${user.name}'s profile on Mirrr!`,
      url: window.location.href,
    }

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        if (error.name !== "AbortError") {
          fallbackShare()
        }
      }
    } else {
      fallbackShare()
    }
  }

  const fallbackShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied!",
      description: "Profile link has been copied to your clipboard.",
    })
  }

  return (
    <Card className="overflow-hidden shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      {/* Cover Photo */}
      <div className="relative h-40 md:h-56 bg-gradient-to-r from-brand-primary via-brand-primary to-brand-primary-dark">
        {user.coverPhoto ? (
          <Image src={user.coverPhoto || "/placeholder.svg"} alt="Cover photo" fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary via-brand-primary to-brand-primary-dark opacity-90" />
        )}

        {/* Cover upload overlay */}
        {isCoverUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto mb-2"></div>
              <p className="text-sm">Updating cover photo...</p>
            </div>
          </div>
        )}

        <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />

        <Button
          variant="secondary"
          size="sm"
          onClick={() => coverInputRef.current?.click()}
          disabled={isCoverUploading}
          className="absolute bottom-4 right-4 gap-2 text-xs md:text-sm h-9 bg-white/90 hover:bg-white backdrop-blur-sm border-0 shadow-lg"
        >
          <Camera className="h-4 w-4" />
          <span className="hidden sm:inline">Edit Cover</span>
        </Button>
      </div>

      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col space-y-6">
          {/* Profile Picture & Basic Info */}
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            {/* Avatar */}
            <div className="relative -mt-16 md:-mt-20 flex-shrink-0 mx-auto md:mx-0">
              <div className="relative">
                <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-xl ring-4 ring-brand-primary-10">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xl md:text-3xl font-bold bg-gradient-to-br from-brand-primary to-brand-primary-dark text-white">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                {/* Upload overlay */}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                  </div>
                )}
              </div>

              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />

              <Button
                variant="secondary"
                size="sm"
                onClick={() => avatarInputRef.current?.click()}
                disabled={isUploading}
                className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 bg-white hover:bg-gray-50 shadow-lg border-2 border-white"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{user.name}</h1>
                  {user.verified && (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 self-center md:self-auto">
                      ✓ Verified
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 mb-3 font-medium">@{user.name.toLowerCase().replace(" ", "")}</p>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed max-w-2xl mx-auto md:mx-0">
                  {user.bio ||
                    "Fashion enthusiast & style creator. Sharing my daily outfits and fashion tips. DM for collaborations! ✨"}
                </p>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 text-sm text-gray-600">
                {user.location && (
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <MapPin className="h-4 w-4 text-brand-primary" />
                    <span>{user.location}</span>
                  </div>
                )}
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Calendar className="h-4 w-4 text-brand-primary" />
                  <span>Joined March 2023</span>
                </div>
                {user.website && (
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Globe className="h-4 w-4 text-brand-primary" />
                    <a href={`https://${user.website}`} className="text-brand-primary hover:underline font-medium">
                      {user.website}
                    </a>
                  </div>
                )}
                {user.email && (
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Mail className="h-4 w-4 text-brand-primary" />
                    <span>{user.email}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-6 py-4 border-t border-gray-100">
                <div className="text-center">
                  <div className="font-bold text-xl md:text-2xl text-gray-900">{profileStats.posts}</div>
                  <div className="text-xs md:text-sm text-gray-600 font-medium">Posts</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl md:text-2xl text-gray-900">
                    {profileStats.followers.toLocaleString()}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600 font-medium">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl md:text-2xl text-gray-900">{profileStats.following}</div>
                  <div className="text-xs md:text-sm text-gray-600 font-medium">Following</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl md:text-2xl text-gray-900">
                    {profileStats.likes.toLocaleString()}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600 font-medium">Likes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button className="bg-brand-primary hover-brand-primary-dark gap-2 flex-1 h-12 font-medium shadow-lg hover:shadow-xl transition-all duration-200">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Edit className="h-5 w-5" />
                    Edit Profile
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      placeholder="Where are you located?"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={editForm.website}
                      onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                      placeholder="your-website.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} className="flex-1 bg-brand-primary hover-brand-primary-dark">
                    <Check className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              onClick={handleShare}
              className="flex-1 h-12 font-medium border-2 hover:bg-gray-50 transition-all duration-200 bg-transparent"
            >
              <Share className="h-4 w-4 mr-2" />
              Share Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
