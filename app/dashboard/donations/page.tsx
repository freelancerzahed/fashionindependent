"use client"

import { DashboardNav } from "@/components/dashboard-nav"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ActiveDonationsPage() {
  const { items, removeFromCart } = useCart()
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

  return (
    <main className="flex-1 bg-neutral-50">
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <DashboardNav />

            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h1 className="text-2xl font-bold mb-6">Active Pledges</h1>

                {items.length > 0 ? (
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div
                        key={`${item.campaignId}-${item.pledgeOptionId}`}
                        className="border rounded-lg p-6 flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{item.campaignTitle}</h3>
                          <p className="text-sm text-neutral-600 mb-2">Quantity: {item.quantity}</p>
                          <p className="text-sm font-semibold text-neutral-900">
                            Amount: ${(item.amount * item.quantity).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/campaign/${item.campaignId}`}>View Campaign</Link>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeFromCart(item.campaignId, item.pledgeOptionId)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-6">
                      <p className="text-lg font-semibold mb-4">
                        Total: ${items.reduce((sum, item) => sum + item.amount * item.quantity, 0).toLocaleString()}
                      </p>
                      <Button className="w-full" size="lg">
                        Proceed to Checkout
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-neutral-600 mb-4">You haven't pledged to any campaigns yet.</p>
                    <Button asChild>
                      <Link href="/discover">Discover Campaigns</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
