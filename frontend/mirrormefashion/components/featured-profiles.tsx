import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, ShoppingBag, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const profiles = [
  {
    id: 1,
    name: "Sarah Chen",
    username: "@sarahcreates",
    avatar: "/placeholder.svg?height=80&width=80",
    cover: "/placeholder.svg?height=200&width=400",
    bio: "Ceramic artist & coffee enthusiast ☕",
    followers: 12500,
    products: 24,
    totalLikes: 45600,
    verified: true,
    category: "Art & Crafts",
  },
  {
    id: 2,
    name: "Mike Rodriguez",
    username: "@mikeleather",
    avatar: "/placeholder.svg?height=80&width=80",
    cover: "/placeholder.svg?height=200&width=400",
    bio: "Handcrafted leather goods since 2018 🔨",
    followers: 8900,
    products: 18,
    totalLikes: 23400,
    verified: true,
    category: "Fashion",
  },
  {
    id: 3,
    name: "Emma Watson",
    username: "@emmaorganics",
    avatar: "/placeholder.svg?height=80&width=80",
    cover: "/placeholder.svg?height=200&width=400",
    bio: "Natural skincare & wellness advocate 🌿",
    followers: 18700,
    products: 31,
    totalLikes: 67800,
    verified: true,
    category: "Beauty & Wellness",
  },
]

export default function FeaturedProfiles() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {profiles.map((profile) => (
        <Card key={profile.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative">
            <Image
              src={profile.cover || "/placeholder.svg"}
              alt={`${profile.name} cover`}
              width={400}
              height={200}
              className="w-full h-32 object-cover"
            />
            <Badge className="absolute top-2 right-2 bg-black/80 text-white">{profile.category}</Badge>
          </div>
          <CardContent className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <Image
                src={profile.avatar || "/placeholder.svg"}
                alt={profile.name}
                width={60}
                height={60}
                className="rounded-full border-2 border-white -mt-8 relative z-10"
              />
              <div className="flex-1 mt-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">{profile.name}</h3>
                  {profile.verified && (
                    <Badge variant="secondary" className="text-xs">
                      ✓
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 text-sm">{profile.username}</p>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{profile.bio}</p>

            <div className="grid grid-cols-3 gap-4 mb-4 text-center">
              <div>
                <div className="flex items-center justify-center gap-1">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="font-semibold">{profile.followers.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500">Followers</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1">
                  <ShoppingBag className="h-4 w-4 text-gray-500" />
                  <span className="font-semibold">{profile.products}</span>
                </div>
                <p className="text-xs text-gray-500">Products</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1">
                  <Heart className="h-4 w-4 text-gray-500" />
                  <span className="font-semibold">{profile.totalLikes.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500">Likes</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <Link href={`/profile/${profile.username.slice(1)}`}>View Profile</Link>
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
