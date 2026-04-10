import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function BrandsLoading() {
  return (
    <div className="space-y-4 md:space-y-6 max-w-full overflow-hidden">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between px-4 md:px-0">
        <div className="min-w-0 flex-1">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      {/* Tab Navigation Skeleton */}
      <div className="w-full max-w-[85vw] overflow-hidden md:hidden mx-auto">
        <div className="flex gap-2 px-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="w-16 h-16 rounded-xl flex-shrink-0" />
          ))}
        </div>
      </div>

      {/* Desktop Tab Navigation Skeleton */}
      <div className="hidden md:flex flex-wrap gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-lg" />
        ))}
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="w-8 h-8 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters Skeleton */}
      <Card className="mx-1 md:mx-0">
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <Skeleton className="h-10 flex-1" />
            <div className="flex gap-2 md:gap-4">
              <Skeleton className="h-10 w-full md:w-48" />
              <Skeleton className="h-10 w-full md:w-48" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Skeleton */}
      <Card className="mx-1 md:mx-0">
        <CardHeader className="p-3 md:p-6">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border rounded-xl">
                <Skeleton className="w-16 h-16 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
