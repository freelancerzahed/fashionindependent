"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, DollarSign, Target } from "lucide-react"

interface DashboardStatsProps {
  totalCampaigns: number
  totalEarnings: number
  conversionRate: number
  totalBackers: number
}

export function DashboardStats({ totalCampaigns, totalEarnings, conversionRate, totalBackers }: DashboardStatsProps) {
  const stats = [
    {
      title: "Total Campaigns",
      value: totalCampaigns,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Earnings",
      value: `$${totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Conversion Rate",
      value: `${conversionRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Backers",
      value: totalBackers,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="overflow-hidden rounded-3xl border-0 bg-white shadow-[0_14px_36px_-20px_rgba(15,23,42,0.45)]">
            <CardHeader className="flex flex-col items-start gap-2 px-3 pt-4 pb-2 sm:px-5 sm:pt-5">
              <div className="flex w-full items-start justify-between gap-2">
                <CardTitle className="min-w-0 flex-1 break-words text-[8px] leading-4 font-semibold uppercase tracking-[0.2em] text-slate-500 sm:text-sm sm:tracking-[0.18em]">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-2xl sm:h-8 sm:w-8`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-3 pb-4 sm:px-5 sm:pb-5">
              <div className="break-words text-lg font-bold text-slate-900 sm:text-2xl">{stat.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
