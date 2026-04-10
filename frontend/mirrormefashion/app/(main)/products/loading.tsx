import DashboardLayout from "@/components/dashboard-layout"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductsLoading() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-1/2 mx-auto mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Filters Skeleton */}
          <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
            <Skeleton className="h-8 w-3/4 mb-6" />
            <div className="mb-6 space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="mb-6 space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="mb-6 space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/6" />
                <Skeleton className="h-4 w-1/6" />
              </div>
            </div>
            <div className="mb-6 space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Product Grid Skeleton */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
