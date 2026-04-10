import { Skeleton } from "@/components/ui/skeleton"

export default function BlogLoading() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-6 md:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <Skeleton className="h-10 md:h-12 w-32 md:w-40 mx-auto" />
        <Skeleton className="h-4 w-full max-w-2xl mx-auto" />
      </div>

      {/* Featured Post */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <Skeleton className="h-48 md:h-64 w-full" />
          <div className="p-4 md:p-6 space-y-3">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-6 md:h-7 w-3/4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <Skeleton className="h-40 md:h-48 w-full" />
              <div className="p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-5 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </div>
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
