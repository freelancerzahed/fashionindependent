import { Skeleton } from "@/components/ui/skeleton"

export default function UserProfileLoading() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-6 md:py-12 space-y-6 md:space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-full" />
          <div className="flex-1 text-center md:text-left space-y-3">
            <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
            <Skeleton className="h-4 w-32 mx-auto md:mx-0" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full max-w-md mx-auto md:mx-0" />
              <Skeleton className="h-4 w-3/4 max-w-sm mx-auto md:mx-0" />
            </div>
            <div className="flex justify-center md:justify-start space-x-4 pt-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-16" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border p-4 md:p-6 text-center space-y-2">
            <Skeleton className="h-8 w-12 mx-auto" />
            <Skeleton className="h-4 w-16 mx-auto" />
          </div>
        ))}
      </div>

      {/* Content Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <div className="flex space-x-1 p-1">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-20 md:w-24" />
            ))}
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-40 md:h-48 w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
