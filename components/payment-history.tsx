"use client"

import { usePayments } from "@/lib/payment-context"
import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"
import Link from "next/link"
import { PaymentStatusBadge } from "./payment-status-badge"

export function PaymentHistory() {
  const { payments } = usePayments()

  if (payments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600 mb-4">No payment history yet.</p>
        <Link href="/discover">
          <Button>Discover Campaigns</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Campaign</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.orderId} className="border-b hover:bg-neutral-50">
                <td className="px-6 py-4 text-sm font-mono">{payment.orderId}</td>
                <td className="px-6 py-4 text-sm">{payment.campaignTitle}</td>
                <td className="px-6 py-4 text-sm font-semibold">${payment.amount.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-neutral-600">
                  {new Date(payment.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <PaymentStatusBadge status={payment.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      Receipt
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
