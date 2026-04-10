"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import { useWishlist } from "@/contexts/wishlist-context"
import { useCart } from "@/contexts/cart-context"

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist()
  const { addItem } = useCart()

  const addToCart = (product: any) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image || "/placeholder.svg",
      quantity: 1,
    })
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Save items you love to your wishlist!</p>
          <Link href="/shop">
            <Button className="bg-primary-600 hover:bg-primary-700 text-white">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600">{wishlist.length} items</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="relative aspect-square mb-4">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    onClick={() => removeFromWishlist(product.id)}
                  >
                    <Trash2 className="h-4 w-4 text-primary-600" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900">${product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                    )}
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-primary-600 hover:bg-primary-700"
                      onClick={() => addToCart(product)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => removeFromWishlist(product.id)}>
                      <Heart className="h-4 w-4 fill-current text-primary-600" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
