"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export interface AnalyticsEvent {
  id: string
  eventType: "page_view" | "campaign_view" | "pledge_initiated" | "pledge_completed" | "affiliate_click"
  campaignId?: string
  userId?: string
  affiliateId?: string
  timestamp: Date
  metadata?: Record<string, unknown>
}

export interface CampaignAnalytics {
  campaignId: string
  totalViews: number
  uniqueVisitors: number
  pledgeInitiated: number
  pledgeCompleted: number
  conversionRate: number
  affiliateReferrals: number
}

interface AnalyticsContextType {
  events: AnalyticsEvent[]
  trackEvent: (event: Omit<AnalyticsEvent, "id" | "timestamp">) => void
  getCampaignAnalytics: (campaignId: string) => CampaignAnalytics
  getTopCampaigns: (limit?: number) => CampaignAnalytics[]
  getConversionMetrics: () => { avgConversionRate: number; totalConversions: number; totalInitiated: number }
  getAffiliatePerformance: (affiliateId: string) => { clicks: number; conversions: number; conversionRate: number }
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<AnalyticsEvent[]>([])

  const trackEvent = (event: Omit<AnalyticsEvent, "id" | "timestamp">) => {
    const newEvent: AnalyticsEvent = {
      ...event,
      id: Math.random().toString(),
      timestamp: new Date(),
    }
    setEvents([...events, newEvent])
  }

  const getCampaignAnalytics = (campaignId: string): CampaignAnalytics => {
    const campaignEvents = events.filter((e) => e.campaignId === campaignId)
    const pageViews = campaignEvents.filter((e) => e.eventType === "page_view").length
    const uniqueVisitors = new Set(campaignEvents.map((e) => e.userId)).size
    const pledgeInitiated = campaignEvents.filter((e) => e.eventType === "pledge_initiated").length
    const pledgeCompleted = campaignEvents.filter((e) => e.eventType === "pledge_completed").length
    const conversionRate = pledgeInitiated > 0 ? (pledgeCompleted / pledgeInitiated) * 100 : 0
    const affiliateReferrals = campaignEvents.filter((e) => e.eventType === "affiliate_click").length

    return {
      campaignId,
      totalViews: pageViews,
      uniqueVisitors,
      pledgeInitiated,
      pledgeCompleted,
      conversionRate,
      affiliateReferrals,
    }
  }

  const getTopCampaigns = (limit = 10): CampaignAnalytics[] => {
    const campaignIds = Array.from(new Set(events.map((e) => e.campaignId).filter(Boolean)))
    return campaignIds
      .map((id) => getCampaignAnalytics(id as string))
      .sort((a, b) => b.totalViews - a.totalViews)
      .slice(0, limit)
  }

  const getConversionMetrics = () => {
    const pledgeInitiated = events.filter((e) => e.eventType === "pledge_initiated").length
    const pledgeCompleted = events.filter((e) => e.eventType === "pledge_completed").length
    const avgConversionRate = pledgeInitiated > 0 ? (pledgeCompleted / pledgeInitiated) * 100 : 0

    return {
      avgConversionRate,
      totalConversions: pledgeCompleted,
      totalInitiated: pledgeInitiated,
    }
  }

  const getAffiliatePerformance = (affiliateId: string) => {
    const affiliateEvents = events.filter((e) => e.affiliateId === affiliateId)
    const clicks = affiliateEvents.filter((e) => e.eventType === "affiliate_click").length
    const conversions = affiliateEvents.filter((e) => e.eventType === "pledge_completed").length
    const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0

    return { clicks, conversions, conversionRate }
  }

  return (
    <AnalyticsContext.Provider
      value={{
        events,
        trackEvent,
        getCampaignAnalytics,
        getTopCampaigns,
        getConversionMetrics,
        getAffiliatePerformance,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (context === undefined) {
    throw new Error("useAnalytics must be used within AnalyticsProvider")
  }
  return context
}
