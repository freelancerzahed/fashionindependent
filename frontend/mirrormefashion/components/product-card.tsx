import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import type { Product } from "@/lib/api/types"
import { AddToCartButton } from "./add-to-cart-button"
import { AddToWishlistButton } from "./add-to-wishlist-button"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="w-full rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative w-full aspect-square bg-gray-100">
          <Image
            src={product.images[0] || "/placeholder.svg"} // Display the first image
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-lg font-bold">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mt-1">{product.brand}</p>
        <div className="flex items-center mt-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating) ? "fill-current" : "fill-transparent stroke-current"
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-gray-600 text-xs">({product.reviewCount})</span>
        </div>
        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-xl font-bold text-gray-900">{formatCurrency(product.price, product.currency)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-gray-500 line-through">
              {formatCurrency(product.originalPrice, product.currency)}
            </span>
          )}
        </div>
        <div className="flex gap-2 mt-4">
          <AddToCartButton product={product} disabled={!product.inStock} />
          <AddToWishlistButton product={product} />
        </div>
      </CardContent>
    </Card>
  )
}
