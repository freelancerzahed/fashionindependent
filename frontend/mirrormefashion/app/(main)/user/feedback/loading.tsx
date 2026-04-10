import { Skeleton } from "@/components/ui/skeleton"

export default function FeedbackLoading() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-6 md:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <Skeleton className="h-10 md:h-12 w-48 md:w-64 mx-auto" />
        <Skeleton className="h-4 w-full max-w-2xl mx-auto" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {/* Feedback Form */}
        <div className="bg-white rounded-lg shadow-sm border p-6 md:p-8 space-y-6">
          <Skeleton className="h-6 w-40" />

          <div className="space-y-4">
            {/* Rating */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <div className="flex space-x-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="w-8 h-8" />
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-32 w-full rounded-md" />
            </div>

            {/* Attachments */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-24 w-full rounded-md border-dashed" />
            </div>

            <Skeleton className="h-12 w-full md:w-32 rounded-md" />
          </div>
        </div>

        {/* Feedback Stats */}
        <div className="space-y-6">
          <Skeleton className="h-6 w-40" />

          {/* Overall Rating */}
          <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
            <Skeleton className="h-5 w-32" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-16" />
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="w-6 h-6" />
                ))}
              </div>
            </div>
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Rating Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
            <Skeleton className="h-5 w-40" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-2 flex-1" />
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>

          {/* Recent Feedback */}
          <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
            <Skeleton className="h-5 w-32" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3 pb-4 border-b last:border-b-0">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, j) => (
                      <Skeleton key={j} className="w-4 h-4" />
                    ))}
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
