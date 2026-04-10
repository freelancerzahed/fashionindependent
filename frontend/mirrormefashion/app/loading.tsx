import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header Skeleton */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-red-800 h-16">
        <div className="flex items-center justify-between px-4 py-3">
          <Skeleton className="w-8 h-8 bg-red-700" />
          <Skeleton className="w-24 h-6 bg-red-700" />
          <div className="flex space-x-2">
            <Skeleton className="w-8 h-8 bg-red-700" />
            <Skeleton className="w-8 h-8 bg-red-700" />
          </div>
        </div>
      </div>

      {/* Desktop Header Skeleton */}
      <div className="hidden md:block">
        <div className="bg-black py-2">
          <Skeleton className="h-6 w-48 mx-auto bg-gray-800" />
        </div>
        <div className="bg-red-800 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <Skeleton className="w-10 h-10 bg-red-700" />
              <div className="flex space-x-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="w-16 h-8 bg-red-700" />
                ))}
              </div>
              <Skeleton className="w-8 h-8 bg-red-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="md:pt-32 pt-20 pb-20 md:pb-8 px-4 md:px-8">
        <div className="space-y-6">
          {/* Hero Section Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-64 mx-auto md:mx-0" />
            <Skeleton className="h-4 w-full max-w-md mx-auto md:mx-0" />
            <Skeleton className="h-64 md:h-96 w-full rounded-lg" />
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 md:h-64 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav Skeleton */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-2">
        <div className="flex justify-around">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-1">
              <Skeleton className="w-6 h-6" />
              <Skeleton className="w-12 h-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
