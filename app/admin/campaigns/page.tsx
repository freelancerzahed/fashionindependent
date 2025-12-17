"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function AdminCampaignsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const campaigns = [
    {
      id: "1",
      title: "Sustainable Fashion Line",
      creator: "Jane Designer",
      status: "active",
      raised: 4500,
      goal: 6000,
      verificationStatus: "approved",
      createdAt: "2025-10-01",
    },
    {
      id: "2",
      title: "Vintage Inspired Denim",
      creator: "John Smith",
      status: "active",
      raised: 8200,
      goal: 5000,
      verificationStatus: "approved",
      createdAt: "2025-10-05",
    },
    {
      id: "3",
      title: "Minimalist Accessories",
      creator: "Sarah Johnson",
      status: "pending",
      raised: 0,
      goal: 3000,
      verificationStatus: "pending",
      createdAt: "2025-10-18",
    },
  ]

  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.creator.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <main className="flex-1 bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Campaign Management</h1>

        <div className="mb-6">
          <Input
            type="search"
            placeholder="Search campaigns or creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="space-y-4">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{campaign.title}</h3>
                  <p className="text-sm text-neutral-600">by {campaign.creator}</p>
                </div>
                <div className="flex gap-2">
                  <Badge>{campaign.status}</Badge>
                  <Badge variant="outline">{campaign.verificationStatus}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-neutral-600">Raised</p>
                  <p className="font-semibold">${campaign.raised}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Goal</p>
                  <p className="font-semibold">${campaign.goal}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Created</p>
                  <p className="font-semibold">{campaign.createdAt}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View
                </Button>
                <Button variant="outline" size="sm">
                  Approve
                </Button>
                <Button variant="outline" size="sm">
                  Reject
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
