import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, TrendingUp, Package } from "lucide-react"
import Link from "next/link"

export default function CreatorPortalPage() {
  return (
    <main className="flex-1">
      <section className="py-12 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Creator Portal</h1>
            <p className="text-neutral-600">Manage your campaigns and track your success</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Funded</CardTitle>
                <DollarSign className="h-4 w-4 text-neutral-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,450</div>
                <p className="text-xs text-neutral-600">+20% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Backers</CardTitle>
                <Users className="h-4 w-4 text-neutral-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">234</div>
                <p className="text-xs text-neutral-600">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                <TrendingUp className="h-4 w-4 text-neutral-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-neutral-600">2 ending soon</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products Delivered</CardTitle>
                <Package className="h-4 w-4 text-neutral-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-neutral-600">98% on-time delivery</p>
              </CardContent>
            </Card>
          </div>

          {/* Active Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle>Your Active Campaigns</CardTitle>
              <CardDescription>Monitor and manage your ongoing campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Campaign Name {i}</h3>
                      <p className="text-sm text-neutral-600">$4,500 raised of $6,000 goal</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="/launch-campaign">Launch New Campaign</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
