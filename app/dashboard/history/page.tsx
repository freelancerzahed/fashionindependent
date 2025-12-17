"use client"

import { DashboardNav } from "@/components/dashboard-nav"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { PaymentHistory } from "@/components/payment-history"

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

  return (
    <main className="flex-1 bg-neutral-50">
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <DashboardNav />

            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h1 className="text-2xl font-bold mb-6">Payment History</h1>

                <PaymentHistory />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
