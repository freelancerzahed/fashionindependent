"use client"

import { useCart } from "@/contexts/cart-context"
import { ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface CartCounterProps {
  className?: string
  showIcon?: boolean
}

export function CartCounter({ className = "", showIcon = true }: CartCounterProps) {
  const { state } = useCart()

  return (
    <div className={`relative ${className}`}>
      {showIcon && <ShoppingCart className="h-5 w-5" />}
      {state.itemCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary hover:bg-primary/90"
        >
          {state.itemCount > 99 ? "99+" : state.itemCount}
        </Badge>
      )}
    </div>
  )
}
