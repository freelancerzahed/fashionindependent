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

  useEffect(() => {
    // Load cart from localStorage
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      setItems(JSON.parse(storedCart))
    }
  }, [])

  useEffect(() => {
    // Save cart to localStorage
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

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
