"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCampaign } from "@/lib/campaign-context"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"
import { CheckCircle2 } from "lucide-react"

export default function CampaignVerificationPage() {
  const { user } = useAuth()
  const { addVerification } = useCampaign()
  const [formData, setFormData] = useState({
    campaignId: "",
    techPackId: "",
    productSampleUrl: "",
    cadFileUrl: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.campaignId && formData.techPackId) {
      addVerification({
        campaignId: formData.campaignId,
        techPackId: formData.techPackId,
        productSampleUrl: formData.productSampleUrl || undefined,
        cadFileUrl: formData.cadFileUrl || undefined,
        status: "pending",
      })
      setSubmitted(true)
      setFormData({ campaignId: "", techPackId: "", productSampleUrl: "", cadFileUrl: "" })
    }
  }

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Campaign Verification</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Before launching your campaign, verify your product readiness by uploading your tech pack and product
            samples.
          </p>

          {submitted && (
            <Card className="p-6 mb-8 bg-green-50 border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">Verification Submitted</p>
                  <p className="text-sm text-green-700">
                    Your campaign verification has been submitted. Our team will review it within 24 hours.
                  </p>
                </div>
              </div>
            </Card>
          )}

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="campaignId">Campaign ID</Label>
                <Input
                  id="campaignId"
                  placeholder="Enter your campaign ID"
                  value={formData.campaignId}
                  onChange={(e) => setFormData({ ...formData, campaignId: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="techPackId">Tech Pack ID</Label>
                <Input
                  id="techPackId"
                  placeholder="Enter your tech pack ID"
                  value={formData.techPackId}
                  onChange={(e) => setFormData({ ...formData, techPackId: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="productSample">Product Sample URL (Optional)</Label>
                <Input
                  id="productSample"
                  placeholder="https://example.com/product-sample.jpg"
                  value={formData.productSampleUrl}
                  onChange={(e) => setFormData({ ...formData, productSampleUrl: e.target.value })}
                />
                <p className="text-sm text-muted-foreground mt-2">Upload a photo of your product sample</p>
              </div>

              <div>
                <Label htmlFor="cadFile">3D CAD File URL (Optional)</Label>
                <Input
                  id="cadFile"
                  placeholder="https://example.com/design.obj"
                  value={formData.cadFileUrl}
                  onChange={(e) => setFormData({ ...formData, cadFileUrl: e.target.value })}
                />
                <p className="text-sm text-muted-foreground mt-2">Upload your 3D CAD design file</p>
              </div>

              <Button type="submit" className="w-full">
                Submit for Verification
              </Button>
            </form>
          </Card>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-3">What We Verify</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Tech pack completeness</li>
                <li>✓ Product sample quality</li>
                <li>✓ Design feasibility</li>
                <li>✓ Production readiness</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Next Steps</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>1. Submit verification</li>
                <li>2. Wait for approval (24 hours)</li>
                <li>3. Launch your campaign</li>
                <li>4. Start receiving pledges</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
