"use client"

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Order History</h1>
        <p className="text-sm sm:text-base text-slate-600">Track and manage your past orders and payments</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
        <PaymentHistory />
      </div>
    </div>
  )
}
