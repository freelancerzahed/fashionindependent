"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Eye, Users, DollarSign } from "lucide-react"

export default function CreatorCampaignsPage() {
  const campaigns = [
    {
      id: "1",
      title: "Sustainable Fashion Line",
      status: "active",
      raised: 4500,
      goal: 6000,
      backers: 45,
      views: 1200,
      daysLeft: 15,
    },
    {
      id: "2",
      title: "Vintage Inspired Denim",
      status: "active",
      raised: 8200,
      goal: 5000,
      backers: 82,
      views: 2100,
      daysLeft: 8,
    },
    {
      id: "3",
      title: "Minimalist Accessories",
      status: "closed",
      raised: 3200,
      goal: 3000,
      backers: 32,
      views: 800,
      daysLeft: 0,
    },
  ]

  return (
    <main className="flex-1 bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Campaigns</h1>
          <Button asChild>
            <Link href="/launch-campaign">Launch New Campaign</Link>
          </Button>
        </div>

        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{campaign.title}</h3>
                  <Badge className="mt-2">{campaign.status}</Badge>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">${campaign.raised}</p>
                  <p className="text-sm text-neutral-600">of ${campaign.goal}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-neutral-600" />
                  <span className="text-sm">{campaign.views} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-neutral-600" />
                  <span className="text-sm">{campaign.backers} backers</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-neutral-600" />
                  <span className="text-sm">{campaign.daysLeft} days left</span>
                </div>
              </div>

              <div className="w-full bg-neutral-200 rounded-full h-2 mb-4">
                <div
                  className="bg-neutral-900 h-2 rounded-full"
                  style={{ width: `${(campaign.raised / campaign.goal) * 100}%` }}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/campaign/${campaign.id}`}>View</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/campaign/${campaign.id}/edit`}>Edit</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/campaign/${campaign.id}/analytics`}>Analytics</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
