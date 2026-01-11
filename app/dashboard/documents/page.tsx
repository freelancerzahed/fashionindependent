"use client"

import { DocumentsSection } from "@/components/documents-section"

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Documents</h2>
      </div>
      <DocumentsSection />
    </div>
  )
}
