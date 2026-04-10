"use client"

import { Button } from "@/components/ui/button"
import { useWishlist } from "@/contexts/wishlist-context"
import type { Product } from "@/lib/api/types"
import { Heart } from "lucide-react"
import { toast } from "@/lib/toast"

interface AddToWishlistButtonProps {
  product: Product
}

export function AddToWishlistButton({ product }: AddToWishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const isProductInWishlist = isInWishlist(product.id)

  const handleToggleWishlist = () => {
    if (isProductInWishlist) {
      removeFromWishlist(product.id)
      toast.warning("Removed from wishlist", `${product.name} has been removed from your wishlist.`)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
      })
      toast.success("Added to wishlist!", `${product.name} has been added to your wishlist.`)
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggleWishlist}
      className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm hover:bg-white"
    >
      <Heart className={`h-4 w-4 ${isProductInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
    </Button>
  )
}
