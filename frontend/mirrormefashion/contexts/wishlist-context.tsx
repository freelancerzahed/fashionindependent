"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export interface WishlistItem {
  id: string
  name: string
  price: number
  // Add other properties if needed for the wishlist item, e.g., image, brand, etc.
  // For now, keeping it minimal as per the original interface.
}

export interface WishlistContextValue {
  wishlist: WishlistItem[]
  addToWishlist: (item: WishlistItem) => void
  removeFromWishlist: (id: string) => void
  clearWishlist: () => void
  isInWishlist: (id: string) => boolean // Added isInWishlist to the interface
  toggleItem: (item: WishlistItem) => void // Added toggleItem for convenience
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined)

const EMPTY_LIST: WishlistItem[] = []

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(EMPTY_LIST)

  /* ---------------------------- Local-storage IO --------------------------- */
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const raw = localStorage.getItem("wishlist")
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setWishlist(parsed)
      }
    } catch {
      /* silent */
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    localStorage.setItem("wishlist", JSON.stringify(wishlist))
  }, [wishlist])

  /* ------------------------------------------------------------------------ */

  const addToWishlist = (item: WishlistItem) =>
    setWishlist((prev) => (prev.find((i) => i.id === item.id) ? prev : [...prev, item]))

  const removeFromWishlist = (id: string) => setWishlist((prev) => prev.filter((i) => i.id !== id))

  const clearWishlist = () => setWishlist(EMPTY_LIST)

  // New function to check if an item is in the wishlist
  const isInWishlist = (id: string) => wishlist.some((item) => item.id === id)

  // New function to toggle an item (add if not present, remove if present)
  const toggleItem = (item: WishlistItem) => {
    if (isInWishlist(item.id)) {
      removeFromWishlist(item.id)
    } else {
      addToWishlist(item)
    }
  }

  const ctx: WishlistContextValue = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist, // Include in context value
    toggleItem, // Include in context value
  }

  return <WishlistContext.Provider value={ctx}>{children}</WishlistContext.Provider>
}

export function useWishlist(): WishlistContextValue {
  return (
    useContext(WishlistContext) || {
      wishlist: EMPTY_LIST,
      addToWishlist: () => {},
      removeFromWishlist: () => {},
      clearWishlist: () => {},
      isInWishlist: () => false, // Provide a default no-op for isInWishlist
      toggleItem: () => {}, // Provide a default no-op for toggleItem
    }
  )
}
