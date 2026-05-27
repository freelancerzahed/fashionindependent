"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import type { Campaign } from "@/lib/data"
import { useState, useEffect } from "react"
import { BACKEND_URL } from "@/config"

interface CampaignCardProps {
  campaign: Campaign
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  // State for handling hydration issues
  const [upvotePercentage, setUpvotePercentage] = useState(0);
  const [timeDisplay, setTimeDisplay] = useState<string>("");
  const [backersCount, setBackersCount] = useState<string>("--");
  const [upvoteCount, setUpvoteCount] = useState<string>("--");
  const [upvoteGoalFormatted, setUpvoteGoalFormatted] = useState<string>("--");
  const [questionStats, setQuestionStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  
  useEffect(() => {
    // Calculate upvote percentage on client side only to prevent hydration mismatch
    const upvoteGoal = campaign.upvoteGoal || 1;
    const upvoteVotes = campaign.upvoteCount || 0;
    const percentage = Math.round((upvoteVotes / upvoteGoal) * 100);
    setUpvotePercentage(percentage);
    
    // Calculate time values on client side only to prevent hydration mismatch
    const totalDays = campaign.daysRemaining;
    const days = Math.floor(totalDays);
    const hoursLeft = Math.floor((totalDays - days) * 24);
    const displayText = `${days.toString().padStart(2, "0")}d : ${hoursLeft.toString().padStart(2, "0")}h`;
    setTimeDisplay(displayText);

    // Set backers count on client side to prevent hydration mismatch
    setBackersCount(campaign.backers.toString());
    
    // Set upvote count on client side to prevent hydration mismatch
    setUpvoteCount((campaign.upvoteCount || 0).toLocaleString());
    setUpvoteGoalFormatted((campaign.upvoteGoal || 0).toLocaleString());

    // Fetch question statistics
    const fetchQuestionStats = async () => {
      try {
        setLoadingStats(true);
        const response = await fetch(`${BACKEND_URL}/campaign/${campaign.id}/question-statistics`);
        if (response.ok) {
          const data = await response.json();
          if (data.status && data.data) {
            setQuestionStats(data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching question statistics:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchQuestionStats();
  }, [campaign.upvoteCount, campaign.upvoteGoal, campaign.daysRemaining, campaign.backers, campaign.id])

  return (
    <Card className="overflow-hidden group">
      
      <div className="aspect-[3/4] bg-neutral-200 relative overflow-hidden">
        <Image
          src={campaign.image && typeof campaign.image === 'string' && campaign.image.trim() ? campaign.image : "/placeholder.svg"}
          alt={campaign.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => {}}
          priority={false}
        />
      </div>
      <div className="text-md my-0 pr-1 font-bold text-right">⭐ Active</div>
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
              style={{ width: `${Math.min(upvotePercentage, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-neutral-600">{upvotePercentage}% backed</p>
            <p className="text-xs text-neutral-600">{backersCount} donors</p>
          </div>
        </div>
        <p className="text-sm font-semibold" suppressHydrationWarning>
          {upvoteCount}{" "}
          <span className="text-neutral-600 font-normal">/ {upvoteGoalFormatted} upvotes</span>
        </p>

        {/* Question Statistics Section */}
        {questionStats && questionStats.total_responses > 0 && (
          <div className="mt-4 pt-3 border-t border-neutral-200">
            <p className="text-xs text-neutral-600 mb-2">
              💬 {questionStats.total_responses} member{questionStats.total_responses !== 1 ? 's' : ''} answered questions
            </p>
            {questionStats.questions && questionStats.questions.slice(0, 2).map((q: any) => (
              <div key={q.id} className="text-xs mb-2">
                <p className="font-medium text-neutral-700 truncate">{q.question_text}</p>
                <p className="text-neutral-500">
                  Top: <span className="font-semibold">{q.most_popular_answer}</span> ({q.most_popular_count} votes)
                </p>
              </div>
            ))}
            {questionStats.questions && questionStats.questions.length > 2 && (
              <p className="text-xs text-neutral-500 italic">+{questionStats.questions.length - 2} more questions</p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link
          href={`/campaign/${campaign.id}`}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors w-full"
        >
          View Product
        </Link>
      </CardFooter>
    </Card>
  )
}

export { CampaignCard }