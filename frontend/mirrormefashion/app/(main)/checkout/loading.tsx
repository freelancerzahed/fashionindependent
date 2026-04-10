import { Skeleton } from "@/components/ui/skeleton"

export default function CheckoutLoading() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-6 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Checkout Form */}
        <div className="space-y-6">
          <Skeleton className="h-8 w-32" />

          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6 space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-12 w-full rounded-md" />
                </div>
              ))}
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6 space-y-4">
            <Skeleton className="h-6 w-40" />

            {/* Payment Methods */}
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-8 w-12" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>

            {/* Card Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-12 w-full rounded-md" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-12 w-full rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-12 w-full rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />

          <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6 space-y-4">
            {/* Order Items */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 pb-4 border-b last:border-b-0">
                <Skeleton className="w-16 h-16 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            ))}

            {/* Totals */}
            <div className="space-y-3 pt-4">
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

            <Skeleton className="h-12 w-full rounded-md mt-6" />
          </div>
        </div>
      </div>
    </div>
  )
}
