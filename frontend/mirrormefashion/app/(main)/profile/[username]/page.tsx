"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import {
  MapPin,
  Calendar,
  Heart,
  MessageCircle,
  Grid3X3,
  Bookmark,
  Share,
  Globe,
  Verified,
  TrendingUp,
  Users,
  Copy,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  UserPlus,
  UserCheck,
  MoreHorizontal,
  Flag,
  UserX,
  Shield,
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
  isFollowing: boolean
  isOnline: boolean
  lastSeen?: string
}

// Define the backend user data structure
interface BackendUser {
  user_type: string
  name: string
  user_name: string
  nick_name: string | null
  email: string
  avatar: string | null
  avatar_original: string | null
  address: string | null
  country: string | null
  state: string | null
  city: string | null
  postal_code: string | null
  phone: string | null
  referral_code: string | null
  isFollowing: boolean
  is_notify: string
  is_online: number
  is_hide_birthday: number
  is_hide_body_shape: number
  is_hide_favorites: number
}

const mockPosts = [
  {
    id: 1,
    image: "/placeholder.svg?height=300&width=300&text=Outfit+1",
    likes: 245,
    comments: 18,
    caption: "Perfect summer vibes ☀️",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=300&width=300&text=Outfit+2",
    likes: 189,
    comments: 23,
    caption: "Street style inspiration",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=300&width=300&text=Outfit+3",
    likes: 312,
    comments: 34,
    caption: "Date night ready 💫",
  },
  {
    id: 4,
    image: "/placeholder.svg?height=300&width=300&text=Outfit+4",
    likes: 156,
    comments: 12,
    caption: "Casual Friday mood",
  },
  {
    id: 5,
    image: "/placeholder.svg?height=300&width=300&text=Outfit+5",
    likes: 203,
    comments: 27,
    caption: "Office chic",
  },
  {
    id: 6,
    image: "/placeholder.svg?height=300&width=300&text=Outfit+6",
    likes: 178,
    comments: 15,
    caption: "Weekend ready",
  },
]

export default function UserProfilePage() {
  const { username } = useParams()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("posts")
  const router = useRouter()
console.log(username)
  useEffect(() => {
    if (username) {
      const fetchUser = async () => {
        setLoading(true)
        setError(null)
        try {
          // Fetch real user data from Next.js API route
          console.log("Fetching user profile for:", username);
          
          const response = await fetch(`/api/user-profile/${username}`)
          console.log("API response status:", response.status);
          
          const data = await response.json()
          console.log("API response data:", data);
          
          if (response.status === 401) {
            setError("You need to be logged in to view this profile");
            return;
          }
          
          if (response.status === 404) {
            setError("User not found");
            return;
          }
          
          if (response.status === 500) {
            setError(`Server error: ${data.message || "Internal server error"}`);
            return;
          }
          
          if (!response.ok) {
            setError(`Error: ${data.message || "Failed to fetch user data"}`);
            return;
          }
          
          if (data.success && data.data) {
            const backendUser: BackendUser = data.data

            // Transform backend user data to match frontend interface
            const transformedUser: UserProfile = {
              id: backendUser.user_name,
              name: backendUser.name,
              username: backendUser.user_name,
              bio: "Fashion enthusiast sharing style inspiration", // Default bio since not in backend
              location: backendUser.city ? `${backendUser.city}, ${backendUser.country || ''}` : "Location not specified",
              website: "", // Not in backend data
              email: backendUser.email,
              joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
              avatar: backendUser.avatar || "/placeholder.svg?height=120&width=120",
              coverPhoto: "/placeholder.svg?height=200&width=800&text=Cover",
              followers: 0, // Not in backend data
              following: 0, // Not in backend data
              posts: 0, // Not in backend data
              verified: false, // Not in backend data
              isFollowing: Boolean(backendUser.isFollowing), // Ensure it's a boolean
              isOnline: backendUser.is_online === 1,
              lastSeen: backendUser.is_online === 1 ? undefined : "Recently"
            }

            setUser(transformedUser)
          } else {
            setError(data.message || "User not found")
          }
        } catch (err) {
          console.error("Fetch error:", err);
          setError("Failed to fetch user data. Please try again later.");
        } finally {
          setLoading(false)
        }
      }
      fetchUser()
    }
  }, [username])

  const handleFollow = async () => {
    if (!user) return;

    try {
      // Store the previous state
      const wasFollowing = user.isFollowing;

      // Update UI immediately for better UX
      setUser((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          isFollowing: !prev.isFollowing,
          followers: prev.isFollowing ? prev.followers - 1 : prev.followers + 1,
        };
      });

      // Make API call to follow/unfollow the user based on current state
      let response;
      if (wasFollowing) {
        // If was following, unfriend/remove friend
        response = await fetch("/api/unfriend", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: user.id }),
        });
      } else {
        // If was not following, send friend request
        response = await fetch("/api/send-friend-request", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: user.id }),
        });
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to update follow status');
      }

      // Show appropriate toast message
      toast({
        title: data.action === "followed" ? "Following" : "Unfollowed",
        description: data.message,
      });
    } catch (error) {
      // Revert the UI change if the API call fails
      setUser((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          isFollowing: !prev.isFollowing,
          followers: prev.isFollowing ? prev.followers + 1 : prev.followers - 1,
        };
      });

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update follow status. Please try again.",
        variant: "destructive",
      });
    }
  }

  const handleMessage = () => {
    // Navigate to messages page with user context
    router.push(
      `/user/messages?user=${user.username}`,
    );

    toast({
      title: "Opening chat",
      description: `Starting conversation with ${user.name}...`,
    });
  }

  const handleShare = (platform: string) => {
    if (!user) return

    const profileUrl = `${window.location.origin}/profile/${user.username}`
    const text = `Check out ${user.name}'s profile!`

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

  const handleMoreAction = (action: string) => {
    if (!user) return

    switch (action) {
      case "report":
        toast({
          title: "Report user",
          description: "Opening report form...",
          variant: "destructive",
        })
        break
      case "block":
        toast({
          title: "Block user",
          description: `${user.name} has been blocked.`,
          variant: "destructive",
        })
        break
      case "restrict":
        toast({
          title: "Restrict user",
          description: `${user.name} has been restricted.`,
        })
        break
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700 font-medium">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{error || "User not found"}</h2>
          <p className="text-gray-600 mb-6">The profile you are looking for does not exist or has been removed.</p>
          <Button onClick={() => window.history.back()} className="bg-primary-600 hover:bg-primary-700">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          {/* Cover Photo Section */}
          <div className="relative h-32 bg-gradient-to-r from-primary-500 to-primary-700 rounded-t-xl overflow-hidden">
            {user.coverPhoto ? (
              <Image
                src={user.coverPhoto || "/placeholder.svg"}
                alt="Cover photo"
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-primary-500 to-primary-700" />
            )}
          </div>

          {/* Profile Content */}
          <div className="px-6 pb-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-8 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                {/* Avatar */}
                <div className="relative self-center sm:self-auto">
                  <Avatar className="h-16 w-16 ring-4 ring-white shadow-lg">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="text-lg font-semibold bg-primary-600 text-white">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Online/Offline Status Indicator */}
                  <div
                    className={`absolute -bottom-1 -right-1 h-5 w-5 border-2 border-white rounded-full flex items-center justify-center shadow-sm ${
                      user.isOnline ? "bg-green-500" : "bg-gray-400"
                    }`}
                  >
                    {user.isOnline ? (
                      <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
                    ) : (
                      <div className="h-2 w-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>

                {/* Name and Username */}
                <div className="text-center sm:text-left bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg border-2 border-gray-300 relative z-10">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <h1 className="text-xl font-black text-black drop-shadow-sm">{user.name}</h1>
                    {user.verified && (
                      <Badge className="bg-blue-600 text-white border-0 shadow-sm text-xs">
                        <Verified className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-black text-gray-900 drop-shadow-sm">@{user.username}</p>
                  {!user.isOnline && user.lastSeen && (
                    <p className="text-xs text-gray-600 font-medium">Last seen {user.lastSeen}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4 sm:mt-0 justify-center sm:justify-end">
                <Button
                  size="sm"
                  onClick={handleFollow}
                  className={`px-4 py-2 text-sm font-medium ${
                    user.isFollowing
                      ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                      : "bg-primary-600 hover:bg-primary-700 text-white"
                  }`}
                >
                  {user.isFollowing ? (
                    <>
                      <UserCheck className="h-3 w-3 mr-1" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-3 w-3 mr-1" />
                      Follow
                    </>
                  )}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleMessage}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent px-3 py-2 text-sm"
                >
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Message
                </Button>

                {/* Share Dropdown */}
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

                {/* More Options Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent p-2"
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => handleMoreAction("report")}>
                      <Flag className="h-3 w-3 mr-2" />
                      Report
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleMoreAction("restrict")}>
                      <Shield className="h-3 w-3 mr-2" />
                      Restrict
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleMoreAction("block")}
                      className="text-red-600 focus:text-red-600"
                    >
                      <UserX className="h-3 w-3 mr-2" />
                      Block
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-4">
              <p className="text-gray-900 leading-relaxed whitespace-pre-line text-sm font-medium">{user.bio}</p>
            </div>

            {/* Profile Details */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-800 mb-4">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-primary-600" />
                <span className="font-semibold">{user.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3 text-primary-600" />
                <a
                  href={`https://${user.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 hover:underline font-semibold"
                >
                  {user.website}
                </a>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-primary-600" />
                <span className="font-semibold">Joined {user.joinDate}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-lg font-black text-black">{user.posts}</div>
                <div className="text-xs text-gray-700 font-semibold">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-black text-black">{user.followers.toLocaleString()}</div>
                <div className="text-xs text-gray-700 font-semibold">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-black text-black">{user.following}</div>
                <div className="text-xs text-gray-700 font-semibold">Following</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
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
              {mockPosts.map((post) => (
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
            </div>
          </TabsContent>

          <TabsContent value="liked" className="mt-0">
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <Heart className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-gray-900 mb-1">No liked posts visible</h3>
              <p className="text-sm text-gray-600">This user's liked posts are private.</p>
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-0">
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <Bookmark className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-gray-900 mb-1">No saved posts visible</h3>
              <p className="text-sm text-gray-600">This user's saved posts are private.</p>
            </div>
          </TabsContent>

          <TabsContent value="about" className="mt-0">
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary-600" />
                  About {user.name}
                </h3>
                <p className="text-sm text-gray-800 leading-relaxed font-medium">
                  {user.name} is a passionate fashion enthusiast who loves exploring new styles and trends. They share
                  their fashion journey and inspire others with their unique style choices. Follow them to stay updated
                  with the latest fashion trends and styling tips.
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-base font-bold text-gray-900 mb-3">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {["Fashion", "Style", "Photography", "Travel", "Art", "Design", "Lifestyle", "Beauty"].map(
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
                    <Globe className="h-3 w-3 text-primary-600" />
                    <a
                      href={`https://${user.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:text-primary-700 hover:underline font-semibold"
                    >
                      {user.website}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-primary-600" />
                    <span className="text-sm text-gray-800 font-medium">{user.location}</span>
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
