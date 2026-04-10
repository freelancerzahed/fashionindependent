import { Skeleton } from "@/components/ui/skeleton"

export default function NotificationsLoading() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-6 md:py-12 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <Skeleton className="h-8 md:h-10 w-48 md:w-64" />
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-16 md:w-20" />
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3 md:space-y-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
            <div className="flex items-start space-x-3 md:space-x-4">
              <Skeleton className="w-10 h-10 md:w-12 md:h-12 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4 md:w-1/2" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="w-2 h-2 rounded-full" />
                  </div>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Skeleton className="h-10 w-32 mx-auto" />
      </div>
    </div>
  )
}
