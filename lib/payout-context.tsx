"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export interface PayoutCalculation {
  campaignId: string
  totalDonations: number
  platformFee: number // 10%
  manufacturingCost: number
  netPayout: number
  status: "pending" | "processed" | "paid"
  processedAt?: Date
}

interface PayoutContextType {
  payouts: PayoutCalculation[]
  calculatePayout: (campaignId: string, totalDonations: number, manufacturingCost: number) => PayoutCalculation
  getPayoutByCampaign: (campaignId: string) => PayoutCalculation | undefined
  processPayout: (campaignId: string) => void
  markPayoutAsPaid: (campaignId: string) => void
  getPendingPayouts: () => PayoutCalculation[]
  getPayoutStats: () => { totalPending: number; totalProcessed: number; totalPaid: number }
}

const PayoutContext = createContext<PayoutContextType | undefined>(undefined)

export function PayoutProvider({ children }: { children: React.ReactNode }) {
  const [payouts, setPayouts] = useState<PayoutCalculation[]>([])

  const calculatePayout = (
    campaignId: string,
    totalDonations: number,
    manufacturingCost: number,
  ): PayoutCalculation => {
    const platformFee = totalDonations * 0.1 // 10% platform fee
    const netPayout = totalDonations - platformFee - manufacturingCost

    return {
      campaignId,
      totalDonations,
      platformFee,
      manufacturingCost,
      netPayout,
      status: "pending",
    }
  }

  const getPayoutByCampaign = (campaignId: string) => {
    return payouts.find((p) => p.campaignId === campaignId)
  }

  const processPayout = (campaignId: string) => {
    setPayouts(
      payouts.map((p) => (p.campaignId === campaignId ? { ...p, status: "processed", processedAt: new Date() } : p)),
    )
  }

  const markPayoutAsPaid = (campaignId: string) => {
    setPayouts(
      payouts.map((p) => (p.campaignId === campaignId ? { ...p, status: "paid", processedAt: new Date() } : p)),
    )
  }

  const getPendingPayouts = (): PayoutCalculation[] => {
    return payouts.filter((p) => p.status === "pending")
  }

  const getPayoutStats = () => {
    return {
      totalPending: payouts.filter((p) => p.status === "pending").length,
      totalProcessed: payouts.filter((p) => p.status === "processed").length,
      totalPaid: payouts.filter((p) => p.status === "paid").length,
    }
  }

  return (
    <PayoutContext.Provider
      value={{
        payouts,
        calculatePayout,
        getPayoutByCampaign,
        processPayout,
        markPayoutAsPaid,
        getPendingPayouts,
        getPayoutStats,
      }}
    >
      {children}
    </PayoutContext.Provider>
  )
}

export function usePayout() {
  const context = useContext(PayoutContext)
  if (context === undefined) {
    throw new Error("usePayout must be used within PayoutProvider")
  }
  return context
}
