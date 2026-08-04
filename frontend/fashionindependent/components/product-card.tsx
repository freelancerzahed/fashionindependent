"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import { useState } from "react"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

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
  isCampaign?: boolean
  availabilityLabel?: string
  statusLabel?: string
  href?: string
  detailsHref?: string
  ctaLabel?: string
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const router = useRouter()

  const imageUrl = product.thumbnail_image || product.image || "/placeholder.svg"
  const price = product.main_price || product.price || 0
  const originalPrice = product.stroked_price || 0
  const discount = product.discount || "0%"
  const rating = product.rating || 0
  const sales = product.sales || 0
  const cardHref = product.href || `/product/${product.slug}`
  const detailsHref = product.detailsHref || `/product/${product.slug}`
  const ctaLabel = product.ctaLabel || "View Details"

  const handlePrimaryAction = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
    }

    setIsAdding(true)
    router.push(cardHref)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsWishlisted(!isWishlisted)
    // TODO: Wishlist logic
  }

  return (
    <Card className="group flex h-full flex-col overflow-hidden border border-neutral-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-neutral-200">
        <Image
          src={imageUrl}
          alt={product.name || product.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Discount Badge */}
        {discount && discount !== "0%" && (
          <div className="absolute right-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            {discount}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute left-3 top-3 rounded-full bg-white p-2 shadow-md transition-colors hover:bg-neutral-100"
        >
          <Heart
            className={`w-5 h-5 ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-neutral-600"
            }`}
          />
        </button>

        {/* Overlay on Hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10">
          <Link href={cardHref} className="opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              asChild
              disabled={isAdding}
              className="bg-white text-black shadow-sm hover:bg-neutral-100"
            >
              <span className="inline-flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                {ctaLabel}
              </span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <Link href={detailsHref} className="block min-h-[2.75rem]">
          <h3 className="line-clamp-2 text-sm font-semibold text-neutral-900 transition-colors hover:text-blue-600">
            {product.name || product.title}
          </h3>
        </Link>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1">
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

        {/* Price / Availability */}
        {product.isCampaign ? (
          <div className="space-y-2">
            <div className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
              {product.availabilityLabel || "Limited Drop"}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-neutral-900">${price.toFixed(2)}</span>
              <span className="text-xs text-neutral-500">available now</span>
            </div>
            <p className="line-clamp-3 text-sm text-neutral-600">
              {product.statusLabel || "A successful campaign can lead to this product becoming available for sale."}
            </p>
          </div>
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-neutral-900">${price.toFixed(2)}</span>
            {originalPrice > price && (
              <span className="text-sm text-neutral-500 line-through">${originalPrice.toFixed(2)}</span>
            )}
          </div>
        )}
      </CardContent>

      {/* Footer */}
      <CardFooter className="mt-auto p-4 pt-0">
        <div className="flex w-full flex-col gap-2">
          <Button
            onClick={handlePrimaryAction}
            disabled={isAdding}
            className="w-full whitespace-nowrap bg-neutral-900 text-white hover:bg-neutral-800"
          >
            {isAdding ? "Redirecting..." : ctaLabel}
          </Button>
          {detailsHref && detailsHref !== cardHref && (
            <Link href={detailsHref} className="text-center text-sm font-medium text-neutral-700 underline transition-colors hover:text-neutral-900">
              View Details
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
