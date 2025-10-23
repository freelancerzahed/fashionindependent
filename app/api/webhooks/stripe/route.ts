import { type NextRequest, NextResponse } from "next/server"

// Type definitions for Stripe webhook events
interface StripePaymentIntent {
  id: string
  amount: number
  currency: string
  status: string
  metadata?: Record<string, string>
  last_payment_error?: {
    message: string
  }
}

interface StripeCharge {
  id: string
  amount: number
  status: string
}

interface StripeWebhookEvent {
  type: string
  data: {
    object: StripePaymentIntent | StripeCharge
  }
}

export async function POST(request: NextRequest) {
  try {
    const event: StripeWebhookEvent = await request.json()

    // In production, verify webhook signature:
    // const sig = request.headers.get('stripe-signature')
    // const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)

    if (!event.type || !event.data?.object) {
      return NextResponse.json({ error: "Invalid webhook event" }, { status: 400 })
    }

    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSucceeded(event.data.object as StripePaymentIntent)
        break
      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object as StripePaymentIntent)
        break
      case "charge.refunded":
        await handleRefund(event.data.object as StripeCharge)
        break
      default:
        // Silently ignore unhandled event types
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[Stripe Webhook] Error:", errorMessage)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 })
  }
}

async function handlePaymentSucceeded(paymentIntent: StripePaymentIntent): Promise<void> {
  try {
    // In production, update database with payment confirmation
    // - Update order status to "completed"
    // - Send confirmation email
    // - Update campaign funding amount
    // - Log to analytics service
    // Example: await db.payments.update({ id: paymentIntent.id, status: 'completed' })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[Stripe] Payment success handler error:", errorMessage)
    throw error
  }
}

async function handlePaymentFailed(paymentIntent: StripePaymentIntent): Promise<void> {
  try {
    // In production:
    // - Update order status to "failed"
    // - Send failure notification email
    // - Allow user to retry payment
    // - Log to analytics service

    const failureReason = paymentIntent.last_payment_error?.message || "Unknown error"
    console.error("[Stripe] Payment failed:", failureReason)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[Stripe] Payment failure handler error:", errorMessage)
    throw error
  }
}

async function handleRefund(charge: StripeCharge): Promise<void> {
  try {
    // In production:
    // - Update order status to "refunded"
    // - Send refund confirmation email
    // - Update campaign funding amount
    // - Log to analytics service
    // Example: await db.payments.update({ chargeId: charge.id, status: 'refunded' })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[Stripe] Refund handler error:", errorMessage)
    throw error
  }
}
