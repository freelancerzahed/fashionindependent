"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface CartItem {
  campaignId: string
  pledgeOptionId: string
  amount: number
  quantity: number
  campaignTitle: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (campaignId: string, pledgeOptionId: string) => void
  clearCart: () => void
  getTotalAmount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const storedCart = localStorage.getItem("cart")
      if (storedCart) {
        setItems(JSON.parse(storedCart))
      }
    } catch (error) {
      console.error("[v0] Failed to load cart from localStorage:", error)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem("cart", JSON.stringify(items))
      } catch (error) {
        console.error("[v0] Failed to save cart to localStorage:", error)
      }
    }
  }, [items, mounted])

  const addToCart = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.campaignId === item.campaignId && i.pledgeOptionId === item.pledgeOptionId,
      )

      if (existingItem) {
        return prevItems.map((i) =>
          i.campaignId === item.campaignId && i.pledgeOptionId === item.pledgeOptionId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        )
      }

      return [...prevItems, item]
    })
  }

  const removeFromCart = (campaignId: string, pledgeOptionId: string) => {
    setItems((prevItems) =>
      prevItems.filter((i) => !(i.campaignId === campaignId && i.pledgeOptionId === pledgeOptionId)),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalAmount = () => {
    return items.reduce((total, item) => total + item.amount * item.quantity, 0)
  }

  if (!mounted) {
    return (
      <CartContext.Provider value={{ items: [], addToCart, removeFromCart, clearCart, getTotalAmount }}>
        {children}
      </CartContext.Provider>
    )
  }

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, getTotalAmount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
