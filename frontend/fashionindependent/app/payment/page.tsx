"use client"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StripeCheckoutForm } from "@/components/stripe-checkout-form"
import { getCampaignById } from "@/lib/data"

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const campaignId = searchParams.get("campaignId")
  const pledgeOptionId = searchParams.get("pledgeOptionId")
  const quantity = Number.parseInt(searchParams.get("quantity") || "1")

  const campaign = campaignId ? getCampaignById(campaignId) : null
  const pledgeOption = campaign?.pledgeOptions.find((p) => p.id === pledgeOptionId)

  if (!campaign || !pledgeOption) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Campaign not found</h1>
            <Button onClick={() => router.push("/discover")}>Back to Discover</Button>
          </div>
        </div>
      </main>
    )
  }

  const amount = pledgeOption.amount
  const platformFee = Math.round(amount * 0.1 * 100) / 100
  const total = amount + platformFee

  const handlePaymentSuccess = (orderId: string) => {
    router.push(`/payment-success?orderId=${orderId}&campaignId=${campaignId}`)
  }

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container py-6">
          <Link
            href={`/campaign/${campaignId}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Campaign
          </Link>
          <h1 className="text-3xl font-bold">Complete Your Pledge</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <StripeCheckoutForm
              campaignId={campaignId!}
              pledgeOptionId={pledgeOptionId!}
              amount={amount}
              quantity={quantity}
              campaignTitle={campaign.title}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-6">
              <h3 className="text-lg font-bold mb-4">Order Summary</h3>
              <div className="space-y-4 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pledge Amount</span>
                  <span className="font-semibold">${amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="font-semibold">{quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Fee (10%)</span>
                  <span className="font-semibold">${platformFee.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="font-semibold text-foreground">{campaign.title}</p>
                <p>by {campaign.designer}</p>
                <p className="text-xs mt-4">
                  Your pledge supports independent fashion designers. Expected delivery: 60 days from campaign end.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
