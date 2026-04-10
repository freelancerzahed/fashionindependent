"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share2, ShoppingCart, Star } from "lucide-react"
import Image from "next/image"

interface Profile {
  name: string
  username: string
  products: number
}

interface ProfileTabsProps {
  profile: Profile
}

const posts = [
  {
    id: 1,
    content:
      "Just finished this beautiful ceramic mug! The glaze turned out exactly how I envisioned. What do you think? 🏺✨",
    image: "/placeholder.svg?height=400&width=400",
    likes: 234,
    comments: 18,
    timestamp: "2 hours ago",
    type: "post",
  },
  {
    id: 2,
    content: "Behind the scenes of my pottery studio. The magic happens here! 🎨",
    image: "/placeholder.svg?height=400&width=600",
    likes: 156,
    comments: 12,
    timestamp: "1 day ago",
    type: "post",
  },
]

const products = [
  {
    id: 1,
    name: "Artisan Coffee Mug",
    price: 24.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.8,
    reviews: 23,
    inStock: true,
  },
  {
    id: 2,
    name: "Ceramic Bowl Set",
    price: 89.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.9,
    reviews: 45,
    inStock: true,
  },
  {
    id: 3,
    name: "Handmade Vase",
    price: 65.0,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.7,
    reviews: 12,
    inStock: false,
  },
]

export default function ProfileTabs({ profile }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("posts")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-6">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="products">Products ({profile.products})</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        <TabsTrigger value="about">About</TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt={profile.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">{profile.name}</span>
                    <span className="text-gray-500 text-sm">@{profile.username}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500 text-sm">{post.timestamp}</span>
                  </div>
                  <p className="mb-4">{post.content}</p>
                  {post.image && (
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt="Post image"
                      width={400}
                      height={400}
                      className="rounded-lg mb-4 max-w-full h-auto"
                    />
                  )}
                  <div className="flex items-center gap-6 text-gray-500">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Heart className="h-4 w-4" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <MessageCircle className="h-4 w-4" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="products">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                {!product.inStock && <Badge className="absolute top-2 left-2 bg-red-500">Out of Stock</Badge>}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{product.rating}</span>
                  <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                </div>
                <p className="text-xl font-bold text-purple-600 mb-3">${product.price}</p>
                <Button className="w-full" disabled={!product.inStock}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="reviews">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">Customer reviews will appear here.</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="about">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">About {profile.name}</h3>
            <p className="text-gray-700 mb-4">
              Sarah is a passionate ceramic artist based in Portland, Oregon. She has been creating beautiful,
              functional pottery since 2019, with each piece telling its own unique story. Her work is inspired by
              nature and the simple pleasures of daily life, like enjoying a perfect cup of coffee.
            </p>
            <p className="text-gray-700">
              When she's not in the studio, Sarah enjoys exploring local coffee shops, hiking in the Pacific Northwest,
              and sharing her knowledge with aspiring ceramic artists through workshops and online tutorials.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
