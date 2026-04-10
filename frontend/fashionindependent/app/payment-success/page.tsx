"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getCampaignById } from "@/lib/data"
import { usePayments } from "@/lib/payment-context"
import { useEffect } from "react"

export const dynamic = "force-dynamic"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const campaignId = searchParams.get("campaignId")
  const campaign = campaignId ? getCampaignById(campaignId) : null
  const { addPayment } = usePayments()

  useEffect(() => {
    if (orderId && campaignId && campaign) {
      const paymentData = JSON.parse(sessionStorage.getItem("pendingPayment") || "{}")
      if (paymentData.email) {
        addPayment({
          id: `payment_${Date.now()}`,
          orderId,
          campaignId,
          campaignTitle: campaign.title,
          amount: paymentData.amount,
          quantity: paymentData.quantity,
          status: "completed",
          email: paymentData.email,
          paymentMethod: paymentData.paymentMethod || "stripe",
          createdAt: new Date().toISOString(),
          shippingAddress: {
            firstName: paymentData.firstName || "",
            lastName: paymentData.lastName || "",
            address: paymentData.address || "",
            city: paymentData.city || "",
            state: paymentData.state || "",
            zip: paymentData.zip || "",
          },
        })
        sessionStorage.removeItem("pendingPayment")
      }
    }
  }, [orderId, campaignId, campaign, addPayment])

  return (
    <main className="min-h-screen bg-background">
      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-lg text-muted-foreground">Thank you for supporting independent fashion designers</p>
          </div>

          {/* Order Details */}
          <Card className="p-8 mb-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Order Confirmation</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Order ID</p>
                    <p className="font-semibold text-lg">{orderId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-semibold">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">Campaign Details</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-muted-foreground">Campaign:</span> {campaign?.title}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Creator:</span> {campaign?.designer}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Expected Delivery:</span> 60 days from campaign end
                  </p>
                </div>
              </div>

              <div className="border-t pt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  A confirmation email has been sent to your email address. You can track your order status in your
                  dashboard.
                </p>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              Download Receipt
            </Button>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Share2 className="w-4 h-4" />
              Share Campaign
            </Button>
            <Link href="/dashboard/history">
              <Button>View Payment History</Button>
            </Link>
          </div>

          {/* Continue Shopping */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Discover more campaigns</p>
            <Link href="/discover">
              <Button variant="outline">Browse Campaigns</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
