"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface CampaignVerification {
  id: string
  campaignId: string
  techPackId: string
  productSampleUrl?: string
  cadFileUrl?: string
  status: "pending" | "approved" | "rejected"
  verifiedAt?: Date
  notes?: string
}

export interface ManufacturingService {
  id: string
  campaignId: string
  serviceType: "basic" | "premium" | "enterprise"
  estimatedCost: number
  productionTimeline: number // days
  status: "pending" | "active" | "completed"
  createdAt: Date
}

interface CampaignContextType {
  verifications: CampaignVerification[]
  manufacturingServices: ManufacturingService[]
  addVerification: (verification: Omit<CampaignVerification, "id">) => void
  addManufacturingService: (service: Omit<ManufacturingService, "id" | "createdAt">) => void
  getVerificationByCampaign: (campaignId: string) => CampaignVerification | undefined
  getManufacturingByCampaign: (campaignId: string) => ManufacturingService | undefined
  updateVerificationStatus: (
    verificationId: string,
    status: "pending" | "approved" | "rejected",
    notes?: string,
  ) => void
  updateManufacturingStatus: (manufacturingId: string, status: "pending" | "active" | "completed") => void
  getVerificationById: (verificationId: string) => CampaignVerification | undefined
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined)

export function CampaignProvider({ children }: { children: React.ReactNode }) {
  const [verifications, setVerifications] = useState<CampaignVerification[]>([])
  const [manufacturingServices, setManufacturingServices] = useState<ManufacturingService[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const storedVerifications = localStorage.getItem("campaign_verifications")
      const storedServices = localStorage.getItem("campaign_manufacturing")
      if (storedVerifications) {
        setVerifications(JSON.parse(storedVerifications))
      }
      if (storedServices) {
        setManufacturingServices(JSON.parse(storedServices))
      }
    } catch (error) {
      console.error("[v0] Failed to load campaign data from localStorage:", error)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem("campaign_verifications", JSON.stringify(verifications))
      } catch (error) {
        console.error("[v0] Failed to save verifications to localStorage:", error)
      }
    }
  }, [verifications, mounted])

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem("campaign_manufacturing", JSON.stringify(manufacturingServices))
      } catch (error) {
        console.error("[v0] Failed to save manufacturing services to localStorage:", error)
      }
    }
  }, [manufacturingServices, mounted])

  const addVerification = (verification: Omit<CampaignVerification, "id">) => {
    const newVerification: CampaignVerification = {
      ...verification,
      id: Math.random().toString(),
    }
    setVerifications([...verifications, newVerification])
  }

  const addManufacturingService = (service: Omit<ManufacturingService, "id" | "createdAt">) => {
    const newService: ManufacturingService = {
      ...service,
      id: Math.random().toString(),
      createdAt: new Date(),
    }
    setManufacturingServices([...manufacturingServices, newService])
  }

  const getVerificationByCampaign = (campaignId: string) => {
    return verifications.find((v) => v.campaignId === campaignId)
  }

  const getManufacturingByCampaign = (campaignId: string) => {
    return manufacturingServices.find((m) => m.campaignId === campaignId)
  }

  const updateVerificationStatus = (
    verificationId: string,
    status: "pending" | "approved" | "rejected",
    notes?: string,
  ) => {
    setVerifications(
      verifications.map((v) => (v.id === verificationId ? { ...v, status, notes, verifiedAt: new Date() } : v)),
    )
  }

  const updateManufacturingStatus = (manufacturingId: string, status: "pending" | "active" | "completed") => {
    setManufacturingServices(manufacturingServices.map((m) => (m.id === manufacturingId ? { ...m, status } : m)))
  }

  const getVerificationById = (verificationId: string) => {
    return verifications.find((v) => v.id === verificationId)
  }

  if (!mounted) {
    return (
      <CampaignContext.Provider
        value={{
          verifications: [],
          manufacturingServices: [],
          addVerification,
          addManufacturingService,
          getVerificationByCampaign,
          getManufacturingByCampaign,
          updateVerificationStatus,
          updateManufacturingStatus,
          getVerificationById,
        }}
      >
        {children}
      </CampaignContext.Provider>
    )
  }

  return (
    <CampaignContext.Provider
      value={{
        verifications,
        manufacturingServices,
        addVerification,
        addManufacturingService,
        getVerificationByCampaign,
        getManufacturingByCampaign,
        updateVerificationStatus,
        updateManufacturingStatus,
        getVerificationById,
      }}
    >
      {children}
    </CampaignContext.Provider>
  )
}

export function useCampaign() {
  const context = useContext(CampaignContext)
  if (context === undefined) {
    throw new Error("useCampaign must be used within CampaignProvider")
  }
  return context
}
