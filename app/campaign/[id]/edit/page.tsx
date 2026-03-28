"use client"

import type { ReactElement } from "react"
import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"

export default function EditCampaignPage({ params }: { params: Promise<{ id: string }> }): ReactElement {
  const { user } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    deadline: "",
    status: "",
  })
  const [resolvedId, setResolvedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    Promise.resolve(params).then((p) => setResolvedId(p.id))
  }, [params])

  // Fetch campaign data when ID is resolved
  React.useEffect(() => {
    if (!resolvedId) return

    const fetchCampaign = async () => {
      try {
        const response = await fetch(`/api/v2/campaign/${resolvedId}`)
        if (response.ok) {
          const data = await response.json()
          const campaign = data.campaign
          console.log("Campaign fetched from API:", campaign)
          console.log("Campaign status from API:", campaign.status)
          setFormData({
            title: campaign.title || "",
            description: campaign.description || "",
            goal: campaign.funding_goal ? String(campaign.funding_goal) : "",
            deadline: campaign.end_date ? campaign.end_date.split('T')[0] : "",
            status: campaign.status || "",
          })
          console.log("FormData set to:", {
            title: campaign.title,
            description: campaign.description,
            goal: campaign.funding_goal,
            deadline: campaign.end_date ? campaign.end_date.split('T')[0] : "",
            status: campaign.status,
          })
        }
      } catch (error) {
        console.error("[v0] Error fetching campaign:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaign()
  }, [resolvedId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const performUpdate = async (isDraft: boolean = false) => {
    if (!resolvedId) return
    try {
      // ALWAYS send draft when isDraft is true
      const newStatus = isDraft ? "draft" : formData.status
      
      const dataToSubmit = {
        title: formData.title,
        description: formData.description,
        funding_goal: parseFloat(formData.goal),
        end_date: formData.deadline,
        status: newStatus
      }

      console.log("===== DRAFT UPDATE DEBUG =====")
      console.log("isDraft parameter:", isDraft)
      console.log("Current formData.status:", formData.status)
      console.log("New status to send:", newStatus)
      console.log("Full payload:", dataToSubmit)
      console.log("JSON string:", JSON.stringify(dataToSubmit))
      console.log("===== END DEBUG =====")

      const response = await fetch(`/api/v2/campaign/${resolvedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      })

      const responseData = await response.json()
      console.log("Update response:", responseData)

      if (response.ok) {
        console.log("Campaign updated successfully")
        router.push(`/campaign/${resolvedId}`)
      } else {
        console.error("[v0] Update failed:", response.status, responseData)
      }
    } catch (error) {
      console.error("[v0] Error updating campaign:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await performUpdate(false)
  }

  const handleDraftClick = async () => {
    await performUpdate(true)
  }

  return (
    <main className="flex-1 bg-neutral-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-6">Edit Campaign</h1>

          {loading ? (
            <p className="text-center text-gray-500">Loading campaign...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Campaign Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter campaign title"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your campaign"
                rows={6}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="goal">Funding Goal ($)</Label>
                <Input
                  id="goal"
                  name="goal"
                  type="number"
                  value={formData.goal}
                  onChange={handleInputChange}
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Input
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  placeholder="Status"
                  readOnly
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={handleDraftClick}
              >
                Save as Draft
              </Button>
              <Button type="submit" className="flex-1">
                Save Changes
              </Button>
            </div>
          </form>
          )}
        </Card>
      </div>
    </main>
  )
}
