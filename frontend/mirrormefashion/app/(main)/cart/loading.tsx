import { Skeleton } from "@/components/ui/skeleton"

export default function CartLoading() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-6 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-8 w-32" />

          {/* Cart Item Cards */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <Skeleton className="w-full md:w-24 h-32 md:h-24 rounded-lg" />
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-6 w-6" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-12" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
            </div>
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Promo Code */}
          <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6 space-y-3">
            <Skeleton className="h-5 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1 rounded-md" />
              <Skeleton className="h-10 w-20 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
