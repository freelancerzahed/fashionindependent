"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import { Heart, MessageCircle, Share2, ShoppingCart, Star, MoreHorizontal, Trash2, Edit3, Bookmark, TrendingUp } from 'lucide-react'
import Image from "next/image"

interface User {
  id: number
  name: string
  email: string
  avatar: string
  verified: boolean
}

interface ProfileContentProps {
  user: User
  onUserUpdate?: (user: User) => void
}

const userPosts = [
  {
    id: 1,
    content: "Just got this amazing dress! Perfect for summer vibes ☀️ #OOTD #SummerFashion",
    image: "/placeholder.svg?height=400&width=400&text=Summer+Dress",
    likes: 234,
    comments: 18,
    timestamp: "2 hours ago",
    isLiked: false,
  },
  {
    id: 2,
    content: "Styling tips: How to mix patterns like a pro! Swipe for more looks ➡️",
    image: "/placeholder.svg?height=400&width=600&text=Pattern+Mixing",
    likes: 156,
    comments: 12,
    timestamp: "1 day ago",
    isLiked: true,
  },
  {
    id: 3,
    content: "New accessories haul! Can't wait to style these pieces 💎✨",
    image: "/placeholder.svg?height=400&width=400&text=Accessories+Haul",
    likes: 89,
    comments: 7,
    timestamp: "3 days ago",
    isLiked: false,
  },
]

const favoriteProducts = [
  {
    id: 1,
    name: "Summer Floral Dress",
    price: 89.99,
    originalPrice: 129.99,
    image: "/placeholder.svg?height=300&width=300&text=Floral+Dress",
    rating: 4.8,
    reviews: 124,
    inCart: false,
    discount: 31,
  },
  {
    id: 2,
    name: "Designer Handbag",
    price: 299.99,
    image: "/placeholder.svg?height=300&width=300&text=Designer+Bag",
    rating: 4.9,
    reviews: 89,
    inCart: true,
  },
  {
    id: 3,
    name: "Vintage Sunglasses",
    price: 45.99,
    originalPrice: 65.99,
    image: "/placeholder.svg?height=300&width=300&text=Sunglasses",
    rating: 4.7,
    reviews: 203,
    inCart: false,
    discount: 30,
  },
  {
    id: 4,
    name: "Silk Scarf",
    price: 78.99,
    image: "/placeholder.svg?height=300&width=300&text=Silk+Scarf",
    rating: 4.6,
    reviews: 67,
    inCart: false,
  },
]

export default function ProfileContent({ user, onUserUpdate }: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState("posts")
  const [posts, setPosts] = useState(userPosts)
  const [products, setProducts] = useState(favoriteProducts)

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    )
  }

  const handleDeletePost = (postId: number) => {
    setPosts(posts.filter((post) => post.id !== postId))
    toast({
      title: "Post deleted",
      description: "Your post has been removed from your profile.",
    })
  }

  const handleAddToCart = (productId: number) => {
    setProducts(
      products.map((product) => (product.id === productId ? { ...product, inCart: !product.inCart } : product)),
    )

    const product = products.find((p) => p.id === productId)
    toast({
      title: product?.inCart ? "Removed from cart" : "Added to cart",
      description: product?.inCart
        ? `${product.name} has been removed from your cart.`
        : `${product?.name} has been added to your cart.`,
    })
  }

  const handleShare = async (post: any) => {
    const shareData = {
      title: `${user.name}'s Post`,
      text: post.content,
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
      description: "Post link has been copied to your clipboard.",
    })
  }

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Enhanced Tabs */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 pb-2 border-b border-gray-100">
          <TabsList className="grid w-full grid-cols-4 mb-4 h-14 bg-gray-50 rounded-xl p-1">
            <TabsTrigger
              value="posts"
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-white data-[state=active]:shadow-lg text-sm font-medium px-4 rounded-lg transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Posts</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="favorites"
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-white data-[state=active]:shadow-lg text-sm font-medium px-4 rounded-lg transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Favorites</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="cart"
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-white data-[state=active]:shadow-lg text-sm font-medium px-4 rounded-lg transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Cart</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="saved"
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-white data-[state=active]:shadow-lg text-sm font-medium px-4 rounded-lg transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                <span className="hidden sm:inline">Saved</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Posts Tab */}
        <TabsContent value="posts" className="space-y-6">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-12 w-12 flex-shrink-0 ring-2 ring-brand-primary-10">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-br from-brand-primary to-brand-primary-dark text-white font-bold">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base text-gray-900">{user.name}</h3>
                        {user.verified && (
                          <Badge className="bg-blue-100 text-blue-700 text-xs border-blue-200">✓</Badge>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem className="gap-2">
                            <Edit3 className="h-4 w-4" />
                            Edit Post
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 text-brand-primary focus:text-brand-primary"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete Post
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">{post.timestamp}</p>
                  </div>
                </div>

                <p className="text-gray-800 mb-4 text-base leading-relaxed">{post.content}</p>

                {post.image && (
                  <div className="rounded-xl overflow-hidden mb-4 shadow-md">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt="Post image"
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover max-h-96 hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className={`gap-2 h-10 px-4 transition-all duration-200 ${
                        post.isLiked
                          ? "text-brand-primary bg-brand-primary-10 hover:bg-brand-primary-20"
                          : "text-gray-600 hover:text-brand-primary hover:bg-brand-primary-10"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`} />
                      <span className="font-medium">{post.likes}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-gray-600 h-10 px-4 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="font-medium">{post.comments}</span>
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(post)}
                    className="gap-2 text-gray-600 h-10 px-4 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="hidden sm:inline font-medium">Share</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Favorites Tab */}
        <TabsContent value="favorites">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {product.discount && (
                    <Badge className="absolute top-3 left-3 bg-brand-primary text-white font-bold">
                      -{product.discount}%
                    </Badge>
                  )}
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-3 right-3 h-10 w-10 bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm"
                  >
                    <Heart className="h-4 w-4 fill-brand-primary text-brand-primary" />
                  </Button>
                </div>
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold text-base line-clamp-2 text-gray-900">{product.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">({product.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold text-brand-primary">${product.price}</p>
                    {product.originalPrice && (
                      <p className="text-sm text-gray-500 line-through">${product.originalPrice}</p>
                    )}
                  </div>
                  <Button
                    onClick={() => handleAddToCart(product.id)}
                    className={`w-full h-11 font-medium transition-all duration-200 ${
                      product.inCart
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-brand-primary hover-brand-primary-dark text-white"
                    }`}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {product.inCart ? "Remove from Cart" : "Add to Cart"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Cart Tab */}
        <TabsContent value="cart">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Your cart is empty</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Discover amazing products and add them to your cart to get started with your shopping journey.
                </p>
                <Button className="bg-brand-primary hover-brand-primary-dark h-12 px-8 font-medium shadow-lg hover:shadow-xl transition-all duration-200 text-white">
                  Continue Shopping
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Saved Tab */}
        <TabsContent value="saved">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bookmark className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">No saved items yet</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Save posts and products you love to easily find them later. Start exploring to build your collection!
                </p>
                <Button className="bg-brand-primary hover-brand-primary-dark h-12 px-8 font-medium shadow-lg hover:shadow-xl transition-all duration-200">
                  Explore Content
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
