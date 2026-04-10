import { Skeleton } from "@/components/ui/skeleton"

export default function WishlistLoading() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-6 md:py-12 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div className="space-y-2">
          <Skeleton className="h-8 md:h-10 w-32 md:w-40" />
          <Skeleton className="h-4 w-48 md:w-64" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-20" />
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border overflow-hidden group">
            <div className="relative">
              <Skeleton className="h-48 md:h-56 w-full" />
              <div className="absolute top-2 right-2 flex space-x-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-8 h-8 rounded-full" />
              </div>
              <div className="absolute bottom-2 left-2">
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
            <div className="p-3 md:p-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-16" />
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, j) => (
                    <Skeleton key={j} className="w-3 h-3" />
                  ))}
                </div>
              </div>
              <div className="flex space-x-2 pt-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 w-9" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State (Alternative) */}
      <div className="hidden text-center py-12 space-y-4">
        <Skeleton className="w-24 h-24 mx-auto rounded-full" />
        <Skeleton className="h-6 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
        <Skeleton className="h-10 w-32 mx-auto" />
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    </div>
  )
}
