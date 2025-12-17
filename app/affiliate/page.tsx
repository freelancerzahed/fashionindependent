"use client"

import { Suspense } from "react"
import { AffiliateContent } from "./content"

export const dynamic = "force-dynamic"

export default function AffiliatePage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <AffiliateContent />
    </Suspense>
  )
}
