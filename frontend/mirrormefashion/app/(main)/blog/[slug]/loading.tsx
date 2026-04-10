import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Progress Bar Skeleton */}
      <div className="fixed top-0 left-0 w-full h-1 bg-primary-100 z-50">
        <div className="h-full bg-primary-300 w-1/4 animate-pulse" />
      </div>

      {/* Header Skeleton */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-primary-100 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <Skeleton className="h-6 w-24 md:w-32" />
          <div className="flex items-center gap-2 md:gap-4">
            <Skeleton className="h-8 w-16 md:w-20" />
            <Skeleton className="h-8 w-16 md:w-20" />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <article className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        {/* Header Skeleton */}
        <header className="mb-6 md:mb-8">
          <div className="mb-4 md:mb-6">
            <Skeleton className="h-6 w-20 mb-3 md:mb-4" />
            <Skeleton className="h-8 md:h-10 lg:h-12 w-full mb-2" />
            <Skeleton className="h-8 md:h-10 lg:h-12 w-3/4 mb-4 md:mb-6" />
            <Skeleton className="h-4 md:h-5 w-full mb-2" />
            <Skeleton className="h-4 md:h-5 w-2/3" />
          </div>

          {/* Meta Skeleton */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 md:h-10 md:w-10 rounded-full" />
              <Skeleton className="h-4 w-24 md:w-32" />
            </div>
            <Skeleton className="h-4 w-20 md:w-24" />
            <Skeleton className="h-4 w-16 md:w-20" />
            <Skeleton className="h-4 w-16 md:w-20" />
          </div>

          {/* Hero Image Skeleton */}
          <Skeleton className="h-64 md:h-96 lg:h-[500px] w-full rounded-xl mb-6 md:mb-8" />
        </header>

        {/* Content Skeleton */}
        <div className="mb-8 md:mb-12 space-y-4 md:space-y-6">
          <Skeleton className="h-4 md:h-5 w-full" />
          <Skeleton className="h-4 md:h-5 w-full" />
          <Skeleton className="h-4 md:h-5 w-3/4" />
          <Skeleton className="h-6 md:h-8 w-1/2 mt-6 md:mt-8" />
          <Skeleton className="h-4 md:h-5 w-full" />
          <Skeleton className="h-4 md:h-5 w-full" />
          <Skeleton className="h-4 md:h-5 w-2/3" />
          <Skeleton className="h-6 md:h-8 w-1/2 mt-6 md:mt-8" />
          <Skeleton className="h-4 md:h-5 w-full" />
          <Skeleton className="h-4 md:h-5 w-4/5" />
        </div>

        {/* Tags Skeleton */}
        <div className="mb-8 md:mb-12">
          <Skeleton className="h-5 md:h-6 w-16 mb-4" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-6 md:h-7 w-16 md:w-20 rounded-full" />
            ))}
          </div>
        </div>

        {/* Share Buttons Skeleton */}
        <div className="mb-8 md:mb-12">
          <Skeleton className="h-6 md:h-7 w-32 md:w-40 mb-4 md:mb-6" />
          <div className="flex flex-wrap gap-3 md:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 md:h-11 w-24 md:w-28 rounded-md" />
            ))}
          </div>
        </div>

        {/* Author Bio Skeleton */}
        <div className="mb-12 md:mb-16">
          <Card className="p-6 md:p-8 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <Skeleton className="h-16 w-16 md:h-20 md:w-20 rounded-full mx-auto md:mx-0" />
              <div className="flex-1 text-center md:text-left">
                <Skeleton className="h-6 md:h-7 w-32 md:w-40 mb-2 mx-auto md:mx-0" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4 mx-auto md:mx-0" />
                <div className="flex justify-center md:justify-start gap-4">
                  <Skeleton className="h-4 w-20 md:w-24" />
                  <Skeleton className="h-4 w-24 md:w-32" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Related Articles Skeleton */}
        <div className="mb-8 md:mb-12">
          <Skeleton className="h-7 md:h-8 w-40 md:w-48 mb-6 md:mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden border-0 shadow-lg">
                <Skeleton className="h-40 md:h-48 w-full" />
                <CardContent className="p-4 md:p-6">
                  <Skeleton className="h-5 md:h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-16 md:w-20" />
                    <Skeleton className="h-4 w-20 md:w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </article>
    </div>
  )
}
