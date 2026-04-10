"use client"

import { Suspense } from "react"
import { InfluencerDashboardContent } from "./content"

export const dynamic = "force-dynamic"

export default function InfluencerDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <InfluencerDashboardContent />
    </Suspense>
  )
}
