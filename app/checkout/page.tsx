"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCampaignById } from "@/lib/data"
import { usePayments } from "@/lib/payment-context"
import { useAuth } from "@/lib/auth-context"

export const dynamic = "force-dynamic"

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const campaignId = searchParams.get("campaignId")
  const pledgeOptionId = searchParams.get("pledgeOptionId")
  const quantity = Number.parseInt(searchParams.get("quantity") || "1")
  const { user } = useAuth()
  const { addPayment } = usePayments()

  const [orderId, setOrderId] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe")
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })

  const campaign = campaignId ? getCampaignById(campaignId) : null
  const pledgeOption = campaign?.pledgeOptions.find((p) => p.id === pledgeOptionId)

  useEffect(() => {
    if (!campaign || !pledgeOption) {
      router.push("/discover")
    }
  }, [campaign, pledgeOption, router])

  if (!campaign || !pledgeOption) {
    return null
  }

  const amount = pledgeOption.amount * quantity
  const platformFee = Math.round(amount * 0.1 * 100) / 100
  const total = amount + platformFee

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = (): boolean => {
    return !!(
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.address &&
      formData.city &&
      formData.state &&
      formData.zip &&
      (paymentMethod === "paypal" || (formData.cardNumber && formData.expiryDate && formData.cvv))
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      alert("Please fill in all required fields")
      return
    }

    setIsProcessing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newOrderId = `TFI-${Date.now()}`
      setOrderId(newOrderId)

      addPayment({
        id: `payment_${Date.now()}`,
        orderId: newOrderId,
        campaignId: campaignId!,
        campaignTitle: campaign.title,
        amount: total,
        quantity,
        status: "completed",
        email: formData.email,
        paymentMethod,
        createdAt: new Date().toISOString(),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
        },
      })

      console.log(`[v0] Payment processed via ${paymentMethod}:`, newOrderId)
      setIsSuccess(true)
    } catch (error) {
      console.error("[v0] Payment error:", error)
      alert("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-background">
        <div className="border-b bg-white">
          <div className="container px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <Link
              href={`/campaign/${campaignId}`}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Campaign</span>
            </Link>
          </div>
        </div>

        <div className="container px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-2xl mx-auto">
            {/* Success Icon and Message */}
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-green-600" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-foreground">Order Confirmed!</h1>
              <p className="text-base sm:text-lg text-muted-foreground">Thank you for supporting independent fashion</p>
            </div>

            {/* Order Details Card */}
            <Card className="p-6 sm:p-8 mb-8 border border-border">
              <div className="space-y-6">
                {/* Order ID */}
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-2">Order ID</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{orderId}</p>
                </div>

                {/* Campaign Info */}
                <div className="border-t pt-6">
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-3">Campaign</p>
                  <p className="font-semibold text-foreground">{campaign.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">by {campaign.designer}</p>
                </div>

                {/* Payment Method */}
                <div className="border-t pt-6">
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-3">Payment Method</p>
                  <p className="font-semibold text-foreground capitalize">{paymentMethod}</p>
                </div>

                {/* Total Amount */}
                <div className="border-t pt-6">
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-3">Total Paid</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">${total.toFixed(2)}</p>
                </div>

                {/* Confirmation Details */}
                <div className="border-t pt-6">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Confirmation email sent to <span className="font-medium text-foreground">{formData.email}</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-3">Expected delivery: 60 days from campaign end</p>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/dashboard/history" className="flex-1">
                <Button className="w-full py-5 sm:py-6 text-base font-medium">View Order History</Button>
              </Link>
              <Link href="/discover" className="flex-1">
                <Button variant="outline" className="w-full py-5 sm:py-6 text-base font-medium bg-transparent">
                  Discover More Campaigns
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b bg-white sticky top-0 z-10">
        <div className="container px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <Link
            href={`/campaign/${campaignId}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Campaign</span>
          </Link>
        </div>
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Main Form Section */}
          <div className="lg:col-span-2">
            <div className="mb-8 sm:mb-10">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Complete Your Pledge</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
              {/* Shipping Section */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-6">Shipping Address</h2>
                <div className="space-y-5">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="mt-2 h-10 text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="mt-2 h-10 text-base"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      placeholder="john@example.com"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mt-2 h-10 text-base"
                    />
                  </div>

                  {/* Address Field */}
                  <div>
                    <Label htmlFor="address" className="text-sm font-medium text-foreground">
                      Street Address
                    </Label>
                    <Input
                      id="address"
                      placeholder="123 Main St"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="mt-2 h-10 text-base"
                    />
                  </div>

                  {/* City, State, ZIP */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                    <div>
                      <Label htmlFor="city" className="text-sm font-medium text-foreground">
                        City
                      </Label>
                      <Input
                        id="city"
                        placeholder="New York"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="mt-2 h-10 text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-sm font-medium text-foreground">
                        State
                      </Label>
                      <Input
                        id="state"
                        placeholder="NY"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="mt-2 h-10 text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip" className="text-sm font-medium text-foreground">
                        ZIP Code
                      </Label>
                      <Input
                        id="zip"
                        placeholder="10001"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        required
                        className="mt-2 h-10 text-base"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-8 sm:pt-10">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-6">Payment Method</h2>
                <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "stripe" | "paypal")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="stripe">Credit Card (Stripe)</TabsTrigger>
                    <TabsTrigger value="paypal">PayPal</TabsTrigger>
                  </TabsList>

                  <TabsContent value="stripe" className="space-y-5 mt-6">
                    <div>
                      <Label htmlFor="cardNumber" className="text-sm font-medium text-foreground">
                        Card Number
                      </Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        required={paymentMethod === "stripe"}
                        className="mt-2 h-10 text-base"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div>
                        <Label htmlFor="expiryDate" className="text-sm font-medium text-foreground">
                          Expiry Date
                        </Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          required={paymentMethod === "stripe"}
                          className="mt-2 h-10 text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="text-sm font-medium text-foreground">
                          CVV
                        </Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          required={paymentMethod === "stripe"}
                          className="mt-2 h-10 text-base"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="paypal" className="mt-6">
                    <Card className="p-6 bg-blue-50 border-blue-200">
                      <p className="text-sm text-blue-900">
                        You will be redirected to PayPal to complete your payment securely. Your shipping information
                        has been saved.
                      </p>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full py-5 sm:py-6 text-base sm:text-lg font-semibold"
                disabled={isProcessing}
              >
                {isProcessing
                  ? "Processing..."
                  : `Complete Pledge via ${paymentMethod === "stripe" ? "Stripe" : "PayPal"} - $${total.toFixed(2)}`}
              </Button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sm:p-8 sticky top-24 border border-border">
              <h3 className="text-lg font-bold text-foreground mb-6">Order Summary</h3>

              {/* Summary Items */}
              <div className="space-y-4 mb-6 pb-6 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pledge Amount</span>
                  <span className="font-medium text-foreground">${pledgeOption.amount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="font-medium text-foreground">{quantity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">${amount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span className="font-medium text-foreground">${platformFee.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between text-lg font-bold text-foreground mb-8">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              {/* Campaign Info */}
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-foreground">{campaign.title}</p>
                  <p className="text-muted-foreground text-xs mt-1">by {campaign.designer}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Support independent fashion designers. Expected delivery: 60 days from campaign end.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
