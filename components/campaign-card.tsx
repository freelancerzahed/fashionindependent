import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import type { Campaign } from "@/lib/data"

interface CampaignCardProps {
  campaign: Campaign
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const fundedPercentage = Math.round((campaign.fundedAmount / campaign.fundingGoal) * 100)
  const hoursLeft = campaign.daysRemaining * 24
  const minutesLeft = Math.floor(Math.random() * 60)

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
            {campaign.daysRemaining.toString().padStart(2, "0")}d :{" "}
            {Math.floor(hoursLeft % 24)
              .toString()
              .padStart(2, "0")}
            h : {minutesLeft.toString().padStart(2, "0")}m
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
            <p className="text-xs text-neutral-600">{campaign.backers} backers</p>
          </div>
        </div>
        <p className="text-sm font-semibold">
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
