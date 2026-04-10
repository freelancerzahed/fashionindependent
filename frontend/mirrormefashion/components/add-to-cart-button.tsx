"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import type { Product } from "@/lib/api/types"
import { ShoppingCart } from "lucide-react"
import { toast } from "@/lib/toast"

interface AddToCartButtonProps {
  product: Product
  disabled?: boolean
  quantity?: number
}

export function AddToCartButton({ product, disabled, quantity = 1 }: AddToCartButtonProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images[0] || "/placeholder.svg?height=200&width=200",
      category: product.category,
      brand: product.brand,
    }

    addItem(cartItem)
    toast.cart("Added to cart!", `${product.name} has been added to your cart.`)
  }

  return (
    <Button onClick={handleAddToCart} disabled={disabled || !product.inStock} className="w-full">
      <ShoppingCart className="mr-2 h-4 w-4" />
      {!product.inStock ? "Out of Stock" : disabled ? "Unavailable" : "Add to Cart"}
    </Button>
  )
}
