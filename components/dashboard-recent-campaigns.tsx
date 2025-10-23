"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Campaign {
  id: string
  title: string
  fundedAmount: number
  fundingGoal: number
  backers: number
  status: string
}

interface DashboardRecentCampaignsProps {
  campaigns: Campaign[]
}

export function DashboardRecentCampaigns({ campaigns }: DashboardRecentCampaignsProps) {
  const fundingPercentage = (campaign: Campaign) => {
    return Math.round((campaign.fundedAmount / campaign.fundingGoal) * 100)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Campaigns</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {campaigns.length === 0 ? (
            <p className="text-sm text-neutral-500">No campaigns yet. Start creating your first campaign!</p>
          ) : (
            campaigns.map((campaign) => (
              <Link key={campaign.id} href={`/campaign/${campaign.id}`}>
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-neutral-50 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{campaign.title}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex-1 bg-neutral-200 rounded-full h-2 max-w-xs">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.min(fundingPercentage(campaign), 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-neutral-600">{fundingPercentage(campaign)}%</span>
                    </div>
                    <div className="flex gap-4 mt-2 text-xs text-neutral-600">
                      <span>${campaign.fundedAmount.toLocaleString()} raised</span>
                      <span>{campaign.backers} backers</span>
                    </div>
                  </div>
                  <Badge variant={campaign.status === "active" ? "default" : "secondary"}>{campaign.status}</Badge>
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
