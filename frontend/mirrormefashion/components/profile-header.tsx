import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, ExternalLink, Users, ShoppingBag, Heart, MessageCircle } from "lucide-react"
import Image from "next/image"

interface Profile {
  name: string
  username: string
  avatar: string
  cover: string
  bio: string
  location: string
  website: string
  joinDate: string
  followers: number
  following: number
  products: number
  totalLikes: number
  verified: boolean
  category: string
}

interface ProfileHeaderProps {
  profile: Profile
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="h-64 md:h-80 relative">
        <Image src={profile.cover || "/placeholder.svg"} alt={`${profile.name} cover`} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Profile Info */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative -mt-16 md:-mt-20">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="relative">
              <Image
                src={profile.avatar || "/placeholder.svg"}
                alt={profile.name}
                width={120}
                height={120}
                className="rounded-full border-4 border-white shadow-lg"
              />
              <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500">Online</Badge>
            </div>

            {/* Profile Details */}
            <div className="flex-1 bg-white rounded-lg p-6 shadow-lg">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold">{profile.name}</h1>
                    {profile.verified && <Badge className="bg-blue-500">✓ Verified</Badge>}
                    <Badge variant="outline">{profile.category}</Badge>
                  </div>
                  <p className="text-gray-600 mb-2">@{profile.username}</p>
                  <p className="text-gray-800 mb-4 max-w-2xl">{profile.bio}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <ExternalLink className="h-4 w-4" />
                      <a href={`https://${profile.website}`} className="text-blue-600 hover:underline">
                        {profile.website}
                      </a>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {profile.joinDate}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span className="font-semibold">{profile.followers.toLocaleString()}</span>
                      <span className="text-gray-600">followers</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span className="font-semibold">{profile.following.toLocaleString()}</span>
                      <span className="text-gray-600">following</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ShoppingBag className="h-4 w-4" />
                      <span className="font-semibold">{profile.products}</span>
                      <span className="text-gray-600">products</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span className="font-semibold">{profile.totalLikes.toLocaleString()}</span>
                      <span className="text-gray-600">likes</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button>Follow</Button>
                  <Button variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
