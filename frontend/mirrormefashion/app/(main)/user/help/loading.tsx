import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function HelpLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30">
      {/* Hero Section Skeleton */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white">
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center space-y-8">
            <Skeleton className="h-10 w-48 mx-auto bg-white/20 rounded-full" />
            <div className="space-y-4">
              <Skeleton className="h-20 w-96 mx-auto bg-white/20" />
              <Skeleton className="h-6 w-3/4 mx-auto bg-white/20" />
            </div>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-32 bg-white/20 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        {/* Support Options Skeleton */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardContent className="p-8 text-center space-y-6">
                  <Skeleton className="w-20 h-20 rounded-2xl mx-auto" />
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-32 mx-auto" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-6 w-20 mx-auto rounded-full" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Categories Skeleton */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <Skeleton className="h-10 w-56 mx-auto" />
            <Skeleton className="h-6 w-80 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-start justify-between">
                    <Skeleton className="w-16 h-16 rounded-2xl" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Section Skeleton */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <Skeleton className="h-10 w-48 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 p-8">
                  <Skeleton className="h-8 w-48 bg-white/20" />
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <Skeleton className="w-12 h-12 rounded-xl" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Newsletter Skeleton */}
        <section>
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-red-600 via-red-700 to-red-800">
            <CardContent className="p-12 text-center">
              <div className="max-w-2xl mx-auto space-y-6">
                <Skeleton className="w-16 h-16 rounded-2xl mx-auto bg-white/20" />
                <div className="space-y-4">
                  <Skeleton className="h-8 w-48 mx-auto bg-white/20" />
                  <Skeleton className="h-6 w-96 mx-auto bg-white/20" />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto pt-4">
                  <Skeleton className="h-12 flex-1 bg-white/20 rounded-xl" />
                  <Skeleton className="h-12 w-32 bg-white/20 rounded-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
