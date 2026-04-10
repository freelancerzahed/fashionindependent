import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileLoading() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-6 md:py-12 space-y-6 md:space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-full" />
          <div className="flex-1 text-center md:text-left space-y-3">
            <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
            <Skeleton className="h-4 w-32 mx-auto md:mx-0" />
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-18" />
            </div>
            <div className="flex justify-center md:justify-start space-x-4 pt-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border p-4 md:p-6 text-center space-y-2">
            <Skeleton className="h-8 w-12 mx-auto" />
            <Skeleton className="h-4 w-16 mx-auto" />
          </div>
        ))}
      </div>

      {/* Profile Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <div className="flex space-x-1 p-1">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-20 md:w-24" />
            ))}
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 md:h-56 w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
