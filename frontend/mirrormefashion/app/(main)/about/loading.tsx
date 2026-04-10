import { Skeleton } from "@/components/ui/skeleton"

export default function AboutLoading() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-6 md:py-12 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <Skeleton className="h-10 md:h-12 w-64 md:w-80 mx-auto" />
        <Skeleton className="h-4 w-full max-w-2xl mx-auto" />
        <Skeleton className="h-4 w-3/4 max-w-xl mx-auto" />
      </div>

      {/* Image */}
      <Skeleton className="h-64 md:h-96 w-full rounded-lg" />

      {/* Content Sections */}
      <div className="space-y-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-8 w-48 md:w-64" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="text-center space-y-3">
            <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto" />
            <Skeleton className="h-5 w-32 mx-auto" />
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}
