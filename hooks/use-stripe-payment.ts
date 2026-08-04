export interface CreatePaymentIntentPayload {
  amount: number
  campaignId: string
  pledgeOptionId: string
  quantity: number
  email: string
}

export interface ConfirmPaymentPayload {
  paymentIntentId: string
  campaignId: string
  pledgeOptionId: string
  quantity: number
  email: string
  amount: number
  firstName?: string
  lastName?: string
  address?: string
  city?: string
  state?: string
  zip?: string
}

export function useStripePayment() {
  const createPaymentIntent = async (payload: CreatePaymentIntentPayload) => {
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(result?.error || "We could not initialize Stripe checkout.")
    }

    return result as { client_secret?: string; error?: string }
  }

  const confirmPayment = async (payload: ConfirmPaymentPayload) => {
    const response = await fetch("/api/confirm-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(result?.error || "We could not finalize your order.")
    }

    return result as { orderId?: string; error?: string }
  }

  return {
    createPaymentIntent,
    confirmPayment,
  }
}
