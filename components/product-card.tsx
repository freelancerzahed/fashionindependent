"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import { useState } from "react"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Product {
  id: string | number
  title: string
  name: string
  slug: string
  image: string
  thumbnail_image: string
  price: number
  stroked_price: number
  main_price: number
  rating: number
  sales: number
  discount: string
  description: string
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const imageUrl = product.thumbnail_image || product.image || "/placeholder.svg"
  const price = product.main_price || product.price || 0
  const originalPrice = product.stroked_price || 0
  const discount = product.discount || "0%"
  const rating = product.rating || 0
  const sales = product.sales || 0

  const handleAddToCart = () => {
    setIsAdding(true)
    // TODO: Add to cart logic
    setTimeout(() => setIsAdding(false), 1000)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsWishlisted(!isWishlisted)
    // TODO: Wishlist logic
  }

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      {/* Image Container */}
      <div className="aspect-square bg-neutral-200 relative overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.name || product.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Discount Badge */}
        {discount && discount !== "0%" && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
            {discount}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 left-3 bg-white rounded-full p-2 hover:bg-neutral-100 transition-colors shadow-md"
        >
          <Heart
            className={`w-5 h-5 ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-neutral-600"
            }`}
          />
        </button>

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black hover:bg-neutral-100"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isAdding ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <CardContent className="p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-sm line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name || product.title}
          </h3>
        </Link>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1 my-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.round(rating) ? "text-yellow-400" : "text-neutral-300"}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-neutral-600">({sales} sold)</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold">${price.toFixed(2)}</span>
          {originalPrice > price && (
            <span className="text-sm text-neutral-500 line-through">${originalPrice.toFixed(2)}</span>
          )}
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-4 pt-0">
        <Link
          href={`/product/${product.slug}`}
          className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  )
}
