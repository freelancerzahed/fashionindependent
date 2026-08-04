"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, Target } from "lucide-react"

interface ProductsOverviewStatsProps {
  totalVotes: number
  totalBackers: number
  totalEarnings: number
}

export function ProductsOverviewStats({
  totalVotes,
  totalBackers,
  totalEarnings,
}: ProductsOverviewStatsProps) {
  const stats = [
    {
      title: "Total Votes",
      value: totalVotes,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Backers",
      value: totalBackers,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Total Earnings",
      value: `$${totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {stats.map((stat) => {
        const Icon = stat.icon

        return (
          <Card key={stat.title} className="w-full h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>

              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold break-words">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
