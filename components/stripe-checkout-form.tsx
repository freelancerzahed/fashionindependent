"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"

interface StripeCheckoutFormProps {
  campaignId: string
  pledgeOptionId: string
  amount: number
  quantity: number
  campaignTitle: string
  onSuccess: (orderId: string) => void
  onError: (error: string) => void
}

export function StripeCheckoutForm({
  campaignId,
  pledgeOptionId,
  amount,
  quantity,
  campaignTitle,
  onSuccess,
  onError,
}: StripeCheckoutFormProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
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

  const platformFee = Math.round(amount * 0.1 * 100) / 100 // 10% platform fee
  const total = amount + platformFee

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const validateStep = () => {
    if (step === 1) {
      if (!formData.email || !formData.firstName || !formData.lastName || !formData.address) {
        setError("Please fill in all shipping fields")
        return false
      }
      if (!formData.city || !formData.state || !formData.zip) {
        setError("Please fill in all address fields")
        return false
      }
    } else if (step === 2) {
      if (!formData.cardNumber || !formData.expiryDate || !formData.cvv) {
        setError("Please fill in all payment fields")
        return false
      }
      if (formData.cardNumber.length < 13) {
        setError("Invalid card number")
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep()) return

    if (step < 2) {
      setStep(step + 1)
      return
    }

    setLoading(true)
    try {
      console.log("[v0] Processing payment for campaign:", campaignId)

      sessionStorage.setItem(
        "pendingPayment",
        JSON.stringify({
          ...formData,
          amount: total,
          quantity,
          campaignId,
        }),
      )

      // Create payment intent
      const intentResponse = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          campaignId,
          pledgeOptionId,
          quantity,
          email: formData.email,
        }),
      })

      if (!intentResponse.ok) {
        throw new Error("Failed to create payment intent")
      }
      const paymentIntent = await intentResponse.json()
      console.log("[v0] Payment intent created:", paymentIntent.id)

      // Confirm payment
      const confirmResponse = await fetch("/api/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          campaignId,
          pledgeOptionId,
          quantity,
          email: formData.email,
          amount: total,
        }),
      })

      if (!confirmResponse.ok) {
        throw new Error("Payment confirmation failed")
      }
      const confirmation = await confirmResponse.json()
      console.log("[v0] Payment confirmed with order ID:", confirmation.orderId)

      // Success
      onSuccess(confirmation.orderId)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Payment failed"
      console.error("[v0] Payment error:", errorMessage)
      setError(errorMessage)
      onError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                s <= step ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
              }`}
            >
              {s}
            </div>
            {s < 3 && <div className="flex-1 h-1 mx-2 bg-muted" />}
          </div>
        ))}
      </div>

      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Shipping</span>
        <span>Payment</span>
        <span>Confirmation</span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Shipping Address</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
              <Input
                placeholder="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            <Input
              placeholder="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <Input
              placeholder="Street Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
            <div className="grid grid-cols-3 gap-4">
              <Input placeholder="City" name="city" value={formData.city} onChange={handleInputChange} required />
              <Input placeholder="State" name="state" value={formData.state} onChange={handleInputChange} required />
              <Input placeholder="ZIP Code" name="zip" value={formData.zip} onChange={handleInputChange} required />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Payment Information</h3>
            <Input
              placeholder="Card Number"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="MM/YY"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                required
              />
              <Input placeholder="CVV" name="cvv" value={formData.cvv} onChange={handleInputChange} required />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Review Your Order</h3>
            <Card className="p-4 bg-muted">
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Campaign:</span> {campaignTitle}
                </p>
                <p>
                  <span className="text-muted-foreground">Quantity:</span> {quantity}
                </p>
                <p>
                  <span className="text-muted-foreground">Email:</span> {formData.email}
                </p>
                <p>
                  <span className="text-muted-foreground">Shipping to:</span> {formData.address}, {formData.city},{" "}
                  {formData.state} {formData.zip}
                </p>
              </div>
            </Card>
          </div>
        )}

        <div className="flex gap-4">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={() => setStep(step - 1)} disabled={loading}>
              Back
            </Button>
          )}
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : step === 3 ? (
              "Complete Payment"
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
