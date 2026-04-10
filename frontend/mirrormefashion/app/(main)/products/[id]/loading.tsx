import { Skeleton } from "@/components/ui/skeleton"

export default function ProductDetailLoading() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-6 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <Skeleton className="h-96 md:h-[500px] w-full rounded-lg" />
          <div className="grid grid-cols-4 gap-2 md:gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 md:h-24 w-full rounded-lg" />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-8 md:h-10 w-3/4" />
            <div className="flex items-center space-x-4">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="w-5 h-5" />
                ))}
              </div>
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>

          {/* Product Options */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <div className="flex space-x-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-10 rounded-full" />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <div className="flex space-x-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-12" />
                ))}
              </div>
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-4 w-16" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>
            <div className="flex space-x-4">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 w-12" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-12 md:mt-16 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 md:h-56 w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
