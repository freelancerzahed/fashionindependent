"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function CheckoutPage() {
  const [step, setStep] = useState(1)
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

  const pledgeAmount = 150
  const platformFee = 15
  const total = pledgeAmount + platformFee

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container py-6">
          <Link href="/campaign/1" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Campaign
          </Link>
          <h1 className="text-3xl font-bold">Complete Your Pledge</h1>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="border-b">
        <div className="container py-8">
          <div className="flex items-center justify-between max-w-2xl">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    s <= step ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s < step ? <Check className="w-5 h-5" /> : s}
                </div>
                <div className="flex-1 h-1 mx-2 bg-muted" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-muted text-muted-foreground">
              3
            </div>
          </div>
          <div className="flex justify-between mt-4 text-sm">
            <span>Shipping</span>
            <span>Payment</span>
            <span>Confirmation</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Shipping Address</h2>
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
                    <Input
                      placeholder="State"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      placeholder="ZIP Code"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Payment Information</h2>
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
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Confirmation</h2>
                  <Card className="p-6 bg-green-50 border-green-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Check className="w-6 h-6 text-green-600" />
                      <h3 className="text-lg font-bold text-green-900">Pledge Confirmed!</h3>
                    </div>
                    <p className="text-green-800 mb-4">
                      Thank you for supporting this campaign. You will receive updates about the product delivery.
                    </p>
                    <div className="space-y-2 text-sm text-green-800">
                      <p>Confirmation email sent to: {formData.email}</p>
                      <p>Order ID: #TFI-2025-001</p>
                      <p>Expected delivery: 60 days from campaign end</p>
                    </div>
                  </Card>
                </div>
              )}

              <div className="flex gap-4">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                    Back
                  </Button>
                )}
                <Button type="submit" className="flex-1">
                  {step === 3 ? "Complete Pledge" : "Continue"}
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-6">
              <h3 className="text-lg font-bold mb-4">Order Summary</h3>
              <div className="space-y-4 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pledge Amount</span>
                  <span className="font-semibold">${pledgeAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span className="font-semibold">${platformFee}</span>
                </div>
              </div>
              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total</span>
                <span>${total}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">Campaign: Sustainable Linen Collection</p>
                <p>Creator: Emma Studios</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
