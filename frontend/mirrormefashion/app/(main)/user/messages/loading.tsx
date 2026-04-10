import DashboardLayout from "@/components/dashboard-layout"
import { Skeleton } from "@/components/ui/skeleton"
import { CardHeader, CardTitle } from "@/components/ui/card"

export default function MessagesLoading() {
  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-120px)] max-h-[800px] w-full rounded-lg shadow-md overflow-hidden bg-white">
        {/* Left Pane: Conversations List Skeleton */}
        <div className="w-1/3 border-r flex flex-col">
          <CardHeader className="p-4 border-b">
            <CardTitle className="text-xl">Messages</CardTitle>
            <Skeleton className="h-10 w-full mt-2" />
          </CardHeader>
          <div className="flex-1 p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Pane: Chat Window Skeleton */}
        <div className="flex-1 flex flex-col">
          <CardHeader className="p-4 border-b flex flex-row items-center justify-between">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-3 w-20 mt-1" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </CardHeader>

          <div className="flex-1 p-4 space-y-4 overflow-auto">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`flex items-end gap-2 ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                {i % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full" />}
                <Skeleton className="max-w-[70%] h-12 rounded-lg" style={{ width: `${Math.random() * 50 + 30}%` }} />
                {i % 2 !== 0 && <Skeleton className="h-8 w-8 rounded-full" />}
              </div>
            ))}
          </div>

          <div className="p-4 border-t flex items-center space-x-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="flex-1 h-10 rounded-md" />
            <Skeleton className="h-10 w-20 rounded-md" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
