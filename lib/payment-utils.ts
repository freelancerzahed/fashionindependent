import type { Payment } from "./payment-context"

export interface PaymentStatusUpdate {
  orderId: string
  status: "pending" | "completed" | "shipped" | "delivered" | "failed" | "refunded"
  metadata?: Record<string, any>
}

// Simulate payment status updates (in production, this would come from Stripe webhooks)
export async function updatePaymentStatus(update: PaymentStatusUpdate): Promise<void> {
  try {
    const payments = JSON.parse(localStorage.getItem("payments") || "[]")
    const paymentIndex = payments.findIndex((p: Payment) => p.orderId === update.orderId)

    if (paymentIndex !== -1) {
      payments[paymentIndex].status = update.status
      if (update.metadata) {
        payments[paymentIndex] = { ...payments[paymentIndex], ...update.metadata }
      }
      localStorage.setItem("payments", JSON.stringify(payments))
    }
  } catch (error) {
    console.error("[v0] Error updating payment status:", error)
  }
}

// Simulate shipping status updates
export async function updateShippingStatus(
  orderId: string,
  status: "pending" | "shipped" | "delivered",
): Promise<void> {
  await updatePaymentStatus({
    orderId,
    status,
    metadata: {
      shippedAt: status === "shipped" ? new Date().toISOString() : undefined,
      deliveredAt: status === "delivered" ? new Date().toISOString() : undefined,
    },
  })
}

// Get payment statistics
export function getPaymentStats(payments: Payment[]) {
  return {
    totalRevenue: payments.reduce((sum, p) => sum + p.amount, 0),
    totalOrders: payments.length,
    completedOrders: payments.filter((p) => p.status === "completed").length,
    shippedOrders: payments.filter((p) => p.status === "shipped").length,
    deliveredOrders: payments.filter((p) => p.status === "delivered").length,
    averageOrderValue: payments.length > 0 ? payments.reduce((sum, p) => sum + p.amount, 0) / payments.length : 0,
  }
}

// Get payments by campaign
export function getPaymentsByCampaign(payments: Payment[], campaignId: string) {
  return payments.filter((p) => p.campaignId === campaignId)
}

// Get payments by status
export function getPaymentsByStatus(payments: Payment[], status: Payment["status"]) {
  return payments.filter((p) => p.status === status)
}

// Get recent payments
export function getRecentPayments(payments: Payment[], days = 30) {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  return payments.filter((p) => new Date(p.createdAt) >= cutoffDate)
}
