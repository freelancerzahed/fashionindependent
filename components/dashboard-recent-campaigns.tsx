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
  upvoteGoal: number
  upvoteCount: number
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
    <Card className="rounded-3xl border-0 bg-white shadow-[0_14px_36px_-20px_rgba(15,23,42,0.45)]">
      <CardHeader className="px-4 pb-3 pt-4 sm:px-5 sm:pt-5">
        <CardTitle className="text-[1rem] font-bold text-slate-900 sm:text-xl">Recent Campaigns</CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-4 sm:px-5 sm:pb-5">
        <div className="space-y-3">
          {campaigns.length === 0 ? (
            <p className="text-sm text-neutral-500">No campaigns yet. Start creating your first campaign!</p>
          ) : (
            campaigns.map((campaign) => (
              <Link key={campaign.id} href={`/campaign/${campaign.id}`}>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 transition-colors hover:bg-slate-100 sm:p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 sm:text-base">{campaign.title}</h3>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-2 rounded-full bg-blue-600"
                            style={{ width: `${Math.min(fundingPercentage(campaign), 100)}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-600 sm:text-xs">{fundingPercentage(campaign)}%</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-600 sm:text-xs">
                        <span>${campaign.fundedAmount.toLocaleString()} raised</span>
                        <span>{campaign.backers} backers</span>
                      </div>
                    </div>
                    <Badge variant={campaign.status === "live" ? "default" : "secondary"}>{campaign.status}</Badge>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
