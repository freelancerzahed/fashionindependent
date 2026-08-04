"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import type { Campaign } from "@/lib/data"
import { memo, useEffect, useMemo, useRef, useState } from "react"

interface CampaignCardProps {
  campaign: Campaign
}

const CampaignCard = memo(function CampaignCard({ campaign }: CampaignCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [questionStats, setQuestionStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const upvotePercentage = useMemo(() => {
    const upvoteGoal = Number.isFinite(Number(campaign.upvoteGoal)) ? Number(campaign.upvoteGoal) : 1;
    const upvoteVotes = Number.isFinite(Number(campaign.upvoteCount)) ? Number(campaign.upvoteCount) : 0;
    return Math.round((upvoteVotes / upvoteGoal) * 100);
  }, [campaign.upvoteCount, campaign.upvoteGoal]);

  const timeDisplay = useMemo(() => {
    const totalDays = Number.isFinite(Number(campaign.daysRemaining)) ? Number(campaign.daysRemaining) : 0;
    const days = Math.floor(totalDays);
    const hoursLeft = Math.floor((totalDays - days) * 24);
    return `${days.toString().padStart(2, "0")}d : ${hoursLeft.toString().padStart(2, "0")}h`;
  }, [campaign.daysRemaining]);

  const backersCount = useMemo(() => String(Number.isFinite(Number(campaign.backers)) ? Number(campaign.backers) : 0), [campaign.backers]);
  const upvoteCount = useMemo(() => (Number.isFinite(Number(campaign.upvoteCount)) ? Number(campaign.upvoteCount) : 0).toLocaleString(), [campaign.upvoteCount]);
  const upvoteGoalFormatted = useMemo(() => (Number.isFinite(Number(campaign.upvoteGoal)) ? Number(campaign.upvoteGoal) : 0).toLocaleString(), [campaign.upvoteGoal]);

  useEffect(() => {
    if (!campaign.id || questionStats || loadingStats) return;

    const fetchQuestionStats = async () => {
      try {
        setLoadingStats(true);
        const response = await fetch(`/api/campaign/${campaign.id}/question-statistics`);
        if (response.ok) {
          const data = await response.json();
          if (data.status && data.data) {
            setQuestionStats(data.data);
          }
        }
      } catch {
      } finally {
        setLoadingStats(false);
      }
    };

    const node = cardRef.current;
    if (!node) {
      void fetchQuestionStats();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void fetchQuestionStats();
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [campaign.id, loadingStats, questionStats]);

  return (
    <Card ref={cardRef} className="overflow-hidden group">
      
      <div className="aspect-[3/4] bg-neutral-200 relative overflow-hidden">
        <Image
          src={campaign.image && typeof campaign.image === 'string' && campaign.image.trim() ? campaign.image : "/placeholder.svg"}
          alt={typeof campaign.title === 'string' && campaign.title.trim() ? campaign.title : "Campaign image"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={() => {}}
        />
      </div>
      <div className="text-md my-0 pr-1 font-bold text-right">⭐ Active</div>
      <CardContent className="p-4">
        <p className="text-xs text-neutral-600 mb-1">by {typeof campaign.designer === 'string' && campaign.designer.trim() ? campaign.designer : "Unknown designer"}</p>
        <h3 className="mb-2 text-lg font-semibold" title={typeof campaign.title === 'string' ? campaign.title : ""}>
          {typeof campaign.title === 'string' && campaign.title.trim()
            ? campaign.title.slice(0, 30) + (campaign.title.length > 30 ? "..." : "")
            : "Untitled campaign"}
        </h3>
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
})

export { CampaignCard }
export default CampaignCard