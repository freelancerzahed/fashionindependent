import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const products = [
  {
    id: 1,
    name: "Artisan Coffee Mug",
    price: 24.99,
    image: "/placeholder.svg?height=300&width=300",
    creator: "Sarah Chen",
    creatorAvatar: "/placeholder.svg?height=40&width=40",
    rating: 4.8,
    likes: 156,
    category: "Home & Living",
  },
  {
    id: 2,
    name: "Handmade Leather Wallet",
    price: 89.99,
    image: "/placeholder.svg?height=300&width=300",
    creator: "Mike Rodriguez",
    creatorAvatar: "/placeholder.svg?height=40&width=40",
    rating: 4.9,
    likes: 243,
    category: "Accessories",
  },
  {
    id: 3,
    name: "Organic Skincare Set",
    price: 45.0,
    image: "/placeholder.svg?height=300&width=300",
    creator: "Emma Watson",
    creatorAvatar: "/placeholder.svg?height=40&width=40",
    rating: 4.7,
    likes: 189,
    category: "Beauty",
  },
  {
    id: 4,
    name: "Vintage Band T-Shirt",
    price: 32.99,
    image: "/placeholder.svg?height=300&width=300",
    creator: "Alex Johnson",
    creatorAvatar: "/placeholder.svg?height=40&width=40",
    rating: 4.6,
    likes: 98,
    category: "Fashion",
  },
]

export default function ProductGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="group hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            <div className="relative">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={300}
                height={300}
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <Button size="icon" variant="ghost" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
                <Heart className="h-4 w-4" />
              </Button>
              <Badge className="absolute top-2 left-2 bg-black/80 text-white">{product.category}</Badge>
            </div>
            <div className="p-4">
              <Link
                href={`/profile/${product.creator.toLowerCase().replace(" ", "-")}`}
                className="flex items-center gap-2 mb-2 hover:underline"
              >
                <Image
                  src={product.creatorAvatar || "/placeholder.svg"}
                  alt={product.creator}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="text-sm text-gray-600">by {product.creator}</span>
              </Link>
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <div className="flex items-center gap-1 mb-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600">{product.rating}</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-600">{product.likes} likes</span>
              </div>
              <p className="text-2xl font-bold text-primary-600">${product.price}</p>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button className="w-full bg-primary-600 hover:bg-primary-700">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
