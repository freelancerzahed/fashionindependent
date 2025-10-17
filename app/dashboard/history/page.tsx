"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DashboardNav } from "@/components/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import Link from "next/link"
import { mockPledges, getCampaignById } from "@/lib/data"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function DonationHistoryPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  const userPledges = mockPledges.filter((p) => p.userId === user.id)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-neutral-50">
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <DashboardNav />

              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg shadow-sm p-8">
                  <h1 className="text-2xl font-bold mb-6">Pledge History</h1>

                  {userPledges.length > 0 ? (
                    <div className="space-y-6">
                      {userPledges.map((pledge) => {
                        const campaign = getCampaignById(pledge.campaignId)
                        return (
                          <div key={pledge.id} className="border rounded-lg p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="font-semibold text-lg">{campaign?.title}</h3>
                                <p className="text-sm text-neutral-600">by {campaign?.designer}</p>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  pledge.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : pledge.status === "shipped"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {pledge.status.charAt(0).toUpperCase() + pledge.status.slice(1)}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                              <div>
                                <p className="text-neutral-600">Amount</p>
                                <p className="font-semibold">${pledge.amount}</p>
                              </div>
                              <div>
                                <p className="text-neutral-600">Date</p>
                                <p className="font-semibold">{new Date(pledge.createdAt).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <p className="text-neutral-600">Status</p>
                                <p className="font-semibold capitalize">{pledge.status}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/campaign/${pledge.campaignId}`}>View Campaign</Link>
                              </Button>
                              <Button variant="outline" size="sm">
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-neutral-600 mb-4">You haven't made any pledges yet.</p>
                      <Button asChild>
                        <Link href="/discover">Start Pledging</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
