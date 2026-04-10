import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-6 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6 space-y-2">
            <Skeleton className="h-6 w-24 mb-4" />
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-lg shadow-sm border p-6 md:p-8 space-y-6">
            <Skeleton className="h-7 w-40" />

            <div className="flex items-center space-x-6">
              <Skeleton className="w-20 h-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>

            <Skeleton className="h-10 w-24" />
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-lg shadow-sm border p-6 md:p-8 space-y-6">
            <Skeleton className="h-7 w-40" />

            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b last:border-b-0">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-lg shadow-sm border p-6 md:p-8 space-y-6">
            <Skeleton className="h-7 w-48" />

            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b last:border-b-0">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-56" />
                </div>
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-lg shadow-sm border p-6 md:p-8 space-y-6">
            <Skeleton className="h-7 w-40" />

            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-12 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-12 w-full" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>

            <div className="border-t pt-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full max-w-md" />
              <Skeleton className="h-10 w-32 bg-red-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
