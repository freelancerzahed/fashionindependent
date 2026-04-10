import { Skeleton } from "@/components/ui/skeleton"

export default function ContactLoading() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-6 md:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <Skeleton className="h-10 md:h-12 w-48 md:w-64 mx-auto" />
        <Skeleton className="h-4 w-full max-w-2xl mx-auto" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-sm border p-6 md:p-8 space-y-6">
          <Skeleton className="h-6 w-32" />

          <div className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-12 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-12 w-full rounded-md" />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-32 w-full rounded-md" />
            </div>

            <Skeleton className="h-12 w-full md:w-32 rounded-md" />
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <Skeleton className="h-6 w-40" />

          {/* Contact Cards */}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border p-4 md:p-6 space-y-3">
              <div className="flex items-center space-x-3">
                <Skeleton className="w-8 h-8" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}

          {/* Map */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
