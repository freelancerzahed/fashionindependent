"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type { Affiliate, AffiliateCommission } from "./data"
import { mockAffiliates, mockAffiliateCommissions } from "./data"

interface AffiliateContextType {
  affiliates: Affiliate[]
  commissions: AffiliateCommission[]
  createAffiliate: (
    data: Omit<Affiliate, "id" | "trackingCode" | "totalEarnings" | "totalReferrals" | "createdAt">,
  ) => void
  getAffiliateStats: (affiliateId: string) => any
  trackClick: (affiliateId: string, campaignId: string) => void
  updateAffiliateStatus: (affiliateId: string, status: "pending" | "approved" | "rejected") => void
}

const AffiliateContext = createContext<AffiliateContextType | undefined>(undefined)

export function AffiliateProvider({ children }: { children: React.ReactNode }) {
  const [affiliates, setAffiliates] = useState<Affiliate[]>(mockAffiliates)
  const [commissions, setCommissions] = useState<AffiliateCommission[]>(mockAffiliateCommissions)

  const createAffiliate = (
    data: Omit<Affiliate, "id" | "trackingCode" | "totalEarnings" | "totalReferrals" | "createdAt">,
  ) => {
    const newAffiliate: Affiliate = {
      ...data,
      id: `aff-${Date.now()}`,
      trackingCode: `${data.name.toUpperCase().replace(/\s+/g, "_")}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      totalEarnings: 0,
      totalReferrals: 0,
      createdAt: new Date(),
    }
    setAffiliates([...affiliates, newAffiliate])
  }

  const getAffiliateStats = (affiliateId: string) => {
    const affiliate = affiliates.find((a) => a.id === affiliateId)
    const affiliateCommissions = commissions.filter((c) => c.affiliateId === affiliateId)
    const paidCommissions = affiliateCommissions.filter((c) => c.status === "paid")
    const pendingCommissions = affiliateCommissions.filter((c) => c.status === "pending")

    return {
      affiliate,
      totalEarnings: affiliate?.totalEarnings || 0,
      totalReferrals: affiliate?.totalReferrals || 0,
      paidAmount: paidCommissions.reduce((sum, c) => sum + c.amount, 0),
      pendingAmount: pendingCommissions.reduce((sum, c) => sum + c.amount, 0),
      commissions: affiliateCommissions,
    }
  }

  const trackClick = (affiliateId: string, campaignId: string) => {
    // Track affiliate click for analytics
    console.log(`[v0] Affiliate click tracked: ${affiliateId} -> ${campaignId}`)
  }

  const updateAffiliateStatus = (affiliateId: string, status: "pending" | "approved" | "rejected") => {
    setAffiliates(affiliates.map((a) => (a.id === affiliateId ? { ...a, status } : a)))
  }

  return (
    <AffiliateContext.Provider
      value={{ affiliates, commissions, createAffiliate, getAffiliateStats, trackClick, updateAffiliateStatus }}
    >
      {children}
    </AffiliateContext.Provider>
  )
}

export function useAffiliate() {
  const context = useContext(AffiliateContext)
  if (context === undefined) {
    throw new Error("useAffiliate must be used within AffiliateProvider")
  }
  return context
}
