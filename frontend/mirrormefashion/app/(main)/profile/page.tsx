"use client"

import { useState } from "react"
import CreatePost from "@/components/create-post"
import SocialFeed from "@/components/social-feed"
import FriendSuggestions from "@/components/friend-suggestions"
import AiAssistant from "@/components/ai-assistant"
import DashboardProfileCard from "@/components/dashboard-profile-card"
import ProductCard from "@/components/product-card"
import { products } from "@/data/products"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Plus } from "lucide-react"
import Link from "next/link"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import React from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface Comment {
  id: string
  user: string
  avatar: string
  text: string
  replies?: Comment[]
}

interface Post {
  id: number | string
  user: {
    name: string
    avatar: string
    verified: boolean
  }
  content: string
  image?: string
  mediaType?: "image" | "video"
  timestamp: string
  likes: number
  comments: Comment[]
  shares: number
  liked: boolean
  showComments?: boolean
}

const initialPosts: Post[] = [
  {
    id: 1,
    user: { name: "Zahed Dtef", avatar: "/placeholder.svg?height=40&width=40&text=ZD", verified: true },
    content: "Just launched my new e-commerce store! Check out the latest collection. #fashion #ecommerce #newarrivals",
    timestamp: "2 months ago",
    likes: 15,
    comments: [
      {
        id: "1-1",
        user: "Alice",
        avatar: "/placeholder.svg?height=24&width=24&text=A",
        text: "Looks amazing! Love the designs.",
      },
      {
        id: "1-2",
        user: "David",
        avatar: "/placeholder.svg?height=24&width=24&text=D",
        text: "When will the men's collection be available?",
      },
    ],
    shares: 3,
    liked: false,
    showComments: false,
  },
  {
    id: 2,
    user: { name: "Mr Rakib", avatar: "/placeholder.svg?height=40&width=40&text=MR", verified: false },
    content:
      "Enjoying a beautiful sunset after a long day of coding. Sometimes you just need to disconnect. #sunset #codinglife #relax",
    image: "/placeholder.svg?height=400&width=600&text=Sunset",
    mediaType: "image",
    timestamp: "3 months ago",
    likes: 22,
    comments: [
      { id: "2-1", user: "Eve", avatar: "/placeholder.svg?height=24&width=24&text=E", text: "Stunning view!" },
      {
        id: "2-2",
        user: "Frank",
        avatar: "/placeholder.svg?height=24&width=24&text=F",
        text: "Totally agree, a break is essential.",
      },
    ],
    shares: 5,
    liked: false,
    showComments: false,
  },
]

export default function DashboardPage() {
  const [feedPosts, setFeedPosts] = useState<Post[]>(initialPosts)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [userName, setUserName] = useState("Jane Doe")
  const [userEmail, setUserEmail] = useState("jane.doe@email.com")
  const featuredProducts = products.slice(0, 6)

  const handleAddPost = (newPost: Post) => {
    setFeedPosts((prevPosts) => [newPost, ...prevPosts])
  }

  const handleImageUpdate = (imageUrl: string) => {
    setProfileImage(imageUrl)
  }

  // Placeholder function for adding friends on the dashboard page
  const handleAddFriend = (userId: string) => {
    console.log(`Attempting to add friend with ID: ${userId} from Dashboard.`)
    // In a real application, you would dispatch an action or call an API here
    // For now, we'll just log it. The actual removal from suggestions happens in FriendSuggestions.
  }

  const plugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: true }))

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6 p-2 md:p-0 pb-24 md:pb-6">
      {/* Main Content Area */}
      <div className="md:col-span-2 lg:col-span-2 space-y-4 md:space-y-6">
        {/* Dashboard Profile Card */}
        <DashboardProfileCard
          name={userName}
          email={userEmail}
          avatar={profileImage}
          onImageUpdate={handleImageUpdate}
        />

        {/* Create Post Section */}
        <div className="md:block">
          <CreatePost onCreatePost={handleAddPost} />
        </div>

        {/* Social Feed */}
        <SocialFeed posts={feedPosts} setPosts={setFeedPosts} />
      </div>

      {/* Sidebar Content Area - Now visible on md screens and up */}
      <div className="hidden md:block md:col-span-1 lg:col-span-1 sticky top-4 self-start space-y-6">
        {/* AI Assistant */}
        <AiAssistant />

        {/* Friend Suggestions */}
        <FriendSuggestions onAddFriend={handleAddFriend} />

        {/* Featured Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Featured Products</CardTitle>
            <Link href="/shop" passHref>
              <Button variant="link" className="text-primary-600 hover:text-primary-700 p-0 h-auto">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[plugin.current]}
              className="w-full"
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
            >
              <CarouselContent>
                {featuredProducts.map((product) => (
                  <CarouselItem key={product.id} className="basis-full">
                    <ProductCard product={product} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Bottom Sheet for Quick Access */}
      <div className="md:hidden fixed bottom-[100px] right-4 z-30">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="h-14 w-14 rounded-full bg-gradient-to-r from-primary-600 to-primary-700 hover:bg-primary-700 text-white shadow-lg active:scale-95 transition-all"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[60vh] rounded-t-3xl">
            <MobileQuickActions />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

// Mobile Quick Actions Component
function MobileQuickActions() {
  const quickActions = [
    { icon: "📝", label: "Create Post", color: "bg-blue-500" },
    { icon: "📸", label: "Add Photo", color: "bg-green-500" },
    { icon: "🎥", label: "Go Live", color: "bg-primary-600" },
    { icon: "📊", label: "Create Poll", color: "bg-purple-500" },
    { icon: "🛍️", label: "Shop Now", color: "bg-orange-500" },
    { icon: "👥", label: "Find Friends", color: "bg-primary-500" },
  ]

  return (
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className={`h-20 flex-col gap-2 border-2 hover:scale-105 active:scale-95 transition-all ${action.color} text-white border-transparent hover:opacity-90`}
          >
            <span className="text-2xl">{action.icon}</span>
            <span className="text-sm font-medium">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
