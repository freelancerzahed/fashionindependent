"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import type { Campaign } from "@/lib/data"
import { useState, useEffect } from "react"

interface CampaignCardProps {
  campaign: Campaign
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  // State for handling hydration issues
  const [fundedPercentage, setFundedPercentage] = useState(0);
  const [timeDisplay, setTimeDisplay] = useState<string>("");
  const [backersCount, setBackersCount] = useState<string>("--");
  
  useEffect(() => {
    // Calculate funded percentage on client side only to prevent hydration mismatch
    const percentage = Math.round((campaign.fundedAmount / campaign.fundingGoal) * 100);
    setFundedPercentage(percentage);
    
    // Calculate time values on client side only to prevent hydration mismatch
    const totalDays = campaign.daysRemaining;
    const days = Math.floor(totalDays);
    const hoursLeft = Math.floor((totalDays - days) * 24);
    const displayText = `${days.toString().padStart(2, "0")}d : ${hoursLeft.toString().padStart(2, "0")}h`;
    setTimeDisplay(displayText);

    // Set backers count on client side to prevent hydration mismatch
    setBackersCount(campaign.backers.toString());
  }, [campaign.fundedAmount, campaign.fundingGoal, campaign.daysRemaining, campaign.backers])

  return (
    <Card className="overflow-hidden group">
      <div className="aspect-[3/4] bg-neutral-200 relative overflow-hidden">
        <Image
          src={campaign.image || "/placeholder.svg"}
          alt={campaign.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <p className="text-xs text-neutral-600 mb-1">by {campaign.designer}</p>
        <h3 className="font-semibold text-lg mb-2">{campaign.title}</h3>
        <div className="flex items-center justify-between text-sm mb-3">
          <span className="text-neutral-600">Time remaining:</span>
          <span className="font-mono font-semibold">
            {timeDisplay || "--d : --h"}
          </span>
        </div>
        <div className="mb-3">
          <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-neutral-900 transition-all"
              style={{ width: `${Math.min(fundedPercentage, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-neutral-600">{fundedPercentage}% funded</p>
            <p className="text-xs text-neutral-600">{backersCount} backers</p>
          </div>
        </div>
        <p className="text-sm font-semibold" suppressHydrationWarning>
          ${campaign.fundedAmount.toLocaleString()}{" "}
          <span className="text-neutral-600 font-normal">of ${campaign.fundingGoal.toLocaleString()}</span>
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link
          href={`/campaign/${campaign.id}`}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors w-full"
        >
          View Campaign
        </Link>
      </CardFooter>
    </Card>
  )
}

export { CampaignCard }