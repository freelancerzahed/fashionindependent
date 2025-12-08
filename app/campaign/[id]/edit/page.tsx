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
  })
  const [resolvedId, setResolvedId] = useState<string | null>(null)

  React.useEffect(() => {
    Promise.resolve(params).then((p) => setResolvedId(p.id))
  }, [params])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resolvedId) return
    try {
      const response = await fetch(`/api/campaigns/${resolvedId}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push(`/campaign/${resolvedId}`)
      }
    } catch (error) {
      console.error("[v0] Error updating campaign:", error)
    }
  }

  return (
    <main className="flex-1 bg-neutral-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-6">Edit Campaign</h1>

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
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  )
}
