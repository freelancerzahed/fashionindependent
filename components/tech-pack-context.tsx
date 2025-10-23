"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type { TechPackPurchase } from "@/lib/data"
import { mockTechPackPurchases } from "@/lib/data"

interface TechPackContextType {
  purchases: TechPackPurchase[]
  addPurchase: (purchase: TechPackPurchase) => void
  getUserPurchases: (userId: string) => TechPackPurchase[]
}

const TechPackContext = createContext<TechPackContextType | undefined>(undefined)

export function TechPackProvider({ children }: { children: React.ReactNode }) {
  const [purchases, setPurchases] = useState<TechPackPurchase[]>(mockTechPackPurchases)

  const addPurchase = (purchase: TechPackPurchase) => {
    setPurchases([...purchases, purchase])
  }

  const getUserPurchases = (userId: string) => {
    return purchases.filter((p) => p.userId === userId)
  }

  return (
    <TechPackContext.Provider value={{ purchases, addPurchase, getUserPurchases }}>{children}</TechPackContext.Provider>
  )
}

export function useTechPack() {
  const context = useContext(TechPackContext)
  if (context === undefined) {
    throw new Error("useTechPack must be used within TechPackProvider")
  }
  return context
}
