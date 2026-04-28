"use client"

import { DocumentsSection } from "@/components/documents-section"

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Products</h2>
      </div>
      <DocumentsSection />
    </div>
  )
}
