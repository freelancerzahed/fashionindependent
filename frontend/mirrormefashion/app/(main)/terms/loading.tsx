import { Skeleton } from "@/components/ui/skeleton"

export default function TermsLoading() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-6 md:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <Skeleton className="h-10 md:h-12 w-56 md:w-72 mx-auto" />
        <Skeleton className="h-4 w-32 mx-auto" />
      </div>

      {/* Table of Contents */}
      <div className="bg-gray-50 rounded-lg p-6 md:p-8 space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="space-y-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <Skeleton className="h-4 w-6" />
              <Skeleton className="h-4 w-56 md:w-72" />
            </div>
          ))}
        </div>
      </div>

      {/* Terms Sections */}
      <div className="space-y-8 md:space-y-12">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-7 md:h-8 w-64 md:w-80" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Sub-sections */}
            <div className="space-y-4 ml-4 md:ml-6">
              {[...Array(Math.floor(Math.random() * 3) + 1)].map((_, j) => (
                <div key={j} className="space-y-2">
                  <Skeleton className="h-5 w-48 md:w-64" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
              ))}
            </div>

            {/* Numbered Lists */}
            <div className="space-y-2 ml-4 md:ml-6">
              {[...Array(Math.floor(Math.random() * 4) + 2)].map((_, k) => (
                <div key={k} className="flex items-start space-x-3">
                  <Skeleton className="w-6 h-4 mt-0.5 flex-shrink-0" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Contact Information */}
      <div className="bg-red-50 rounded-lg p-6 md:p-8 space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-center">
        <Skeleton className="h-4 w-48 mx-auto" />
      </div>
    </div>
  )
}
