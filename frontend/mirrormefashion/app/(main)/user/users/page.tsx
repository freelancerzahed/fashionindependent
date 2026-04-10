"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Camera,
  MapPin,
  Calendar,
  Heart,
  MessageCircle,
  Grid3X3,
  Loader2,
  Bookmark,
  Edit,
  Share,
  Globe,
  Mail,
  Verified,
  Plus,
  TrendingUp,
  Users,
  Settings,
  Copy,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Bell,
  Shield,
  Download,
  Trash2,
} from "lucide-react"
import Image from "next/image"

interface UserProfile {
  id: string
  name: string
  username: string
  bio: string
  location: string
  website: string
  email: string
  joinDate: string
  avatar: string
  coverPhoto: string
  followers: number
  following: number
  posts: number
  verified: boolean
}

const initialProfile: UserProfile = {
  id: "1",
  name: "Jane Doe",
  username: "janedoe",
  bio: "Fashion enthusiast & style creator ✨\nSharing daily outfits and fashion tips",
  location: "New York, NY",
  website: "janedoestyle.com",
  email: "jane.doe@email.com",
  joinDate: "March 2023",
  avatar: "/placeholder.svg?height=120&width=120&text=JD",
  coverPhoto: "/placeholder.svg?height=200&width=800&text=Cover",
  followers: 1234,
  following: 567,
  posts: 127,
  verified: true,
}

const recentPosts = [
  {
    id: 1,
    image: "/placeholder.svg?height=300&width=300&text=Summer+Outfit",
    likes: 245,
    comments: 18,
    caption: "Perfect summer vibes ☀️",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=300&width=300&text=Street+Style",
    likes: 189,
    comments: 23,
    caption: "Street style inspiration",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=300&width=300&text=Evening+Look",
    likes: 312,
    comments: 34,
    caption: "Date night ready 💫",
  },
  {
    id: 4,
    image: "/placeholder.svg?height=300&width=300&text=Casual+Day",
    likes: 156,
    comments: 12,
    caption: "Casual Friday mood",
  },
  {
    id: 5,
    image: "/placeholder.svg?height=300&width=300&text=Work+Outfit",
    likes: 203,
    comments: 27,
    caption: "Office chic",
  },
  {
    id: 6,
    image: "/placeholder.svg?height=300&width=300&text=Weekend+Vibes",
    likes: 178,
    comments: 15,
    caption: "Weekend ready",
  },
]

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(initialProfile)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isUploadingCover, setIsUploadingCover] = useState(false)
  const [activeTab, setActiveTab] = useState("posts")

  const avatarInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const [editForm, setEditForm] = useState({
    name: profile.name,
    bio: profile.bio,
    location: profile.location,
    website: profile.website,
  })

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    setIsUploadingAvatar(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const newAvatarUrl = URL.createObjectURL(file)
      setProfile((prev) => ({ ...prev, avatar: newAvatarUrl }))
      toast({
        title: "Profile picture updated!",
        description: "Your new profile picture has been saved.",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive",
      })
      return
    }

    setIsUploadingCover(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const newCoverUrl = URL.createObjectURL(file)
      setProfile((prev) => ({ ...prev, coverPhoto: newCoverUrl }))
      toast({
        title: "Cover photo updated!",
        description: "Your new cover photo has been saved.",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploadingCover(false)
    }
  }

  const handleProfileSave = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setProfile((prev) => ({
        ...prev,
        name: editForm.name,
        bio: editForm.bio,
        location: editForm.location,
        website: editForm.website,
      }))
      setIsEditingProfile(false)
      toast({
        title: "Profile updated!",
        description: "Your changes have been saved.",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleShare = (platform: string) => {
    const profileUrl = `${window.location.origin}/profile/${profile.username}`
    const text = `Check out ${profile.name}'s profile!`

    switch (platform) {
      case "copy":
        navigator.clipboard.writeText(profileUrl)
        toast({
          title: "Link copied!",
          description: "Profile link has been copied to clipboard.",
        })
        break
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(profileUrl)}`,
        )
        break
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`)
        break
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`)
        break
      case "instagram":
        toast({
          title: "Instagram sharing",
          description: "Please share manually on Instagram app.",
        })
        break
    }
  }

  const handleSettingsAction = (action: string) => {
    switch (action) {
      case "notifications":
        toast({
          title: "Notification settings",
          description: "Opening notification preferences...",
        })
        break
      case "privacy":
        toast({
          title: "Privacy settings",
          description: "Opening privacy controls...",
        })
        break
      case "export":
        toast({
          title: "Export data",
          description: "Preparing your data for download...",
        })
        break
      case "delete":
        toast({
          title: "Delete account",
          description: "This action requires additional confirmation.",
          variant: "destructive",
        })
        break
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Profile Card with Reduced Spacing */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          {/* Cover Photo Section - Reduced Height */}
          <div className="relative h-32 bg-gradient-to-r from-primary-500 to-primary-700 rounded-t-xl overflow-hidden">
            {profile.coverPhoto ? (
              <Image
                src={profile.coverPhoto || "/placeholder.svg"}
                alt="Cover photo"
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-primary-500 to-primary-700" />
            )}

            {isUploadingCover && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p className="text-sm font-medium">Updating cover photo...</p>
                </div>
              </div>
            )}

            <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />

            <button
              onClick={() => coverInputRef.current?.click()}
              disabled={isUploadingCover}
              className="absolute top-2 right-2 bg-white/95 hover:bg-white text-gray-800 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-sm border border-gray-200"
            >
              <Camera className="h-3 w-3 mr-1 inline" />
              Edit Cover
            </button>
          </div>

          {/* Profile Content with Reduced Spacing */}
          <div className="px-6 pb-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-8 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                {/* Avatar - Smaller Size */}
                <div className="relative group self-center sm:self-auto">
                  <Avatar className="h-16 w-16 ring-4 ring-white shadow-lg">
                    <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                    <AvatarFallback className="text-lg font-semibold bg-primary-600 text-white">
                      {profile.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Online Status Indicator */}
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center shadow-sm">
                    <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
                  </div>

                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                    </div>
                  )}

                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />

                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    className="absolute inset-0 bg-black/0 hover:bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <Camera className="h-4 w-4 text-white" />
                  </button>
                </div>

                {/* Name and Username - Compact */}
                <div className="text-center sm:text-left bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg border-2 border-gray-300 relative z-10">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <h1 className="text-xl font-black text-black drop-shadow-sm">{profile.name}</h1>
                    {profile.verified && (
                      <Badge className="bg-blue-600 text-white border-0 shadow-sm text-xs">
                        <Verified className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-black text-gray-900 drop-shadow-sm">@{profile.username}</p>
                </div>
              </div>

              {/* Action Buttons - Compact */}
              <div className="flex gap-2 mt-4 sm:mt-0 justify-center sm:justify-end">
                <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 text-sm">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-primary-700 text-xl font-bold">Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold text-gray-800">
                          Name
                        </Label>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-sm font-semibold text-gray-800">
                          Bio
                        </Label>
                        <Textarea
                          id="bio"
                          value={editForm.bio}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          rows={3}
                          className="border-gray-300 focus:border-primary-500 focus:ring-primary-500 resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-sm font-semibold text-gray-800">
                          Location
                        </Label>
                        <Input
                          id="location"
                          value={editForm.location}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          className="border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website" className="text-sm font-semibold text-gray-800">
                          Website
                        </Label>
                        <Input
                          id="website"
                          value={editForm.website}
                          onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                          className="border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button variant="outline" onClick={() => setIsEditingProfile(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button onClick={handleProfileSave} className="flex-1 bg-primary-600 hover:bg-primary-700">
                        Save Changes
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Share Dropdown - Compact */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent px-3 py-2 text-sm"
                    >
                      <Share className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => handleShare("copy")}>
                      <Copy className="h-3 w-3 mr-2" />
                      Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("twitter")}>
                      <Twitter className="h-3 w-3 mr-2" />
                      Twitter
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("facebook")}>
                      <Facebook className="h-3 w-3 mr-2" />
                      Facebook
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("linkedin")}>
                      <Linkedin className="h-3 w-3 mr-2" />
                      LinkedIn
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("instagram")}>
                      <Instagram className="h-3 w-3 mr-2" />
                      Instagram
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Settings Dropdown - Compact */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent p-2"
                    >
                      <Settings className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => handleSettingsAction("notifications")}>
                      <Bell className="h-3 w-3 mr-2" />
                      Notifications
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSettingsAction("privacy")}>
                      <Shield className="h-3 w-3 mr-2" />
                      Privacy
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSettingsAction("export")}>
                      <Download className="h-3 w-3 mr-2" />
                      Export Data
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSettingsAction("delete")}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-3 w-3 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Bio - Compact */}
            <div className="mb-4">
              <p className="text-gray-900 leading-relaxed whitespace-pre-line text-sm font-medium">{profile.bio}</p>
            </div>

            {/* Profile Details - Compact */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-800 mb-4">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-primary-600" />
                <span className="font-semibold">{profile.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3 text-primary-600" />
                <a
                  href={`https://${profile.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 hover:underline font-semibold"
                >
                  {profile.website}
                </a>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-primary-600" />
                <span className="font-semibold">Joined {profile.joinDate}</span>
              </div>
            </div>

            {/* Stats - Compact */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-lg font-black text-black">{profile.posts}</div>
                <div className="text-xs text-gray-700 font-semibold">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-black text-black">{profile.followers.toLocaleString()}</div>
                <div className="text-xs text-gray-700 font-semibold">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-black text-black">{profile.following}</div>
                <div className="text-xs text-gray-700 font-semibold">Following</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs - Compact */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 rounded-lg p-1 mb-4">
            <TabsTrigger
              value="posts"
              className="data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700 data-[state=active]:border-primary-200 font-semibold text-sm"
            >
              <Grid3X3 className="h-3 w-3 mr-1" />
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="liked"
              className="data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700 data-[state=active]:border-primary-200 font-semibold text-sm"
            >
              <Heart className="h-3 w-3 mr-1" />
              Liked
            </TabsTrigger>
            <TabsTrigger
              value="saved"
              className="data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700 data-[state=active]:border-primary-200 font-semibold text-sm"
            >
              <Bookmark className="h-3 w-3 mr-1" />
              Saved
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700 data-[state=active]:border-primary-200 font-semibold text-sm"
            >
              <Users className="h-3 w-3 mr-1" />
              About
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="group relative bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md hover:border-primary-200 transition-all duration-200 cursor-pointer"
                >
                  <div className="aspect-square relative">
                    <Image src={post.image || "/placeholder.svg"} alt={post.caption} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                    <div className="absolute bottom-2 left-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <p className="text-xs font-semibold mb-1 line-clamp-1">{post.caption}</p>
                      <div className="flex items-center gap-3 text-xs font-medium">
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {post.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {post.comments}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="aspect-square bg-primary-50 border-2 border-dashed border-primary-300 rounded-lg flex flex-col items-center justify-center hover:border-primary-400 hover:bg-primary-100 transition-colors cursor-pointer">
                <Plus className="h-6 w-6 text-primary-500 mb-1" />
                <span className="text-xs text-primary-700 font-semibold">Add Post</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="liked" className="mt-0">
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <Heart className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-gray-900 mb-1">No liked posts yet</h3>
              <p className="text-sm text-gray-600">Posts you like will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-0">
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <Bookmark className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-gray-900 mb-1">No saved posts yet</h3>
              <p className="text-sm text-gray-600">Save posts to view them later.</p>
            </div>
          </TabsContent>

          <TabsContent value="about" className="mt-0">
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary-600" />
                  About Me
                </h3>
                <p className="text-sm text-gray-800 leading-relaxed font-medium">
                  I'm a passionate fashion enthusiast who loves exploring new styles and trends. When I'm not curating
                  outfits, you can find me at local coffee shops or exploring the city for the perfect photo spots. I
                  believe fashion is a form of self-expression and love sharing my journey with others.
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-base font-bold text-gray-900 mb-3">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {["Fashion", "Photography", "Travel", "Coffee", "Art", "Music", "Fitness", "Reading"].map(
                    (interest) => (
                      <Badge
                        key={interest}
                        variant="secondary"
                        className="bg-primary-100 text-primary-800 border-primary-200 font-semibold text-xs"
                      >
                        {interest}
                      </Badge>
                    ),
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-base font-bold text-gray-900 mb-3">Contact</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-primary-600" />
                    <span className="text-sm text-gray-800 font-medium">{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-3 w-3 text-primary-600" />
                    <a
                      href={`https://${profile.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:text-primary-700 hover:underline font-semibold"
                    >
                      {profile.website}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
