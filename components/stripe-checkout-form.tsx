"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { AlertCircle, CheckCircle2, Loader2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useStripePayment } from "@/hooks/use-stripe-payment"

interface StripeCheckoutFormProps {
  campaignId: string
  pledgeOptionId: string
  amount: number
  quantity: number
  campaignTitle: string
  onSuccess: (orderId: string) => void
  onError: (error: string) => void
}

interface PaymentFormValues {
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zip: string
}

const initialValues: PaymentFormValues = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  state: "",
  zip: "",
}

function getStripeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === "object" && error && "message" in error) {
    return String((error as { message?: string }).message || "We could not complete your payment.")
  }

  return "We could not complete your payment. Please try again."
}

function StripePaymentForm({
  formData,
  campaignId,
  pledgeOptionId,
  amount,
  quantity,
  campaignTitle,
  onSuccess,
  onError,
  onBack,
}: {
  formData: PaymentFormValues
  campaignId: string
  pledgeOptionId: string
  amount: number
  quantity: number
  campaignTitle: string
  onSuccess: (orderId: string) => void
  onError: (error: string) => void
  onBack: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const { confirmPayment } = useStripePayment()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const platformFee = Math.round(amount * 0.1 * 100) / 100
  const total = amount + platformFee

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      sessionStorage.setItem(
        "pendingPayment",
        JSON.stringify({
          ...formData,
          amount: total,
          quantity,
          campaignId,
          paymentMethod: "stripe",
        }),
      )

      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      })

      if (stripeError) {
        const message = stripeError.message || "Payment could not be completed."
        setError(message)
        onError(message)
        return
      }

      if (!paymentIntent) {
        throw new Error("Payment was not completed. Please try again.")
      }

      if (paymentIntent.status !== "succeeded") {
        throw new Error("Your payment is still processing. Please wait a moment and try again if needed.")
      }

      const confirmation = await confirmPayment({
        paymentIntentId: paymentIntent.id,
        campaignId,
        pledgeOptionId,
        quantity,
        email: formData.email,
        amount: total,
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
      })

      const orderId = typeof confirmation?.orderId === "string" ? confirmation.orderId : paymentIntent.id
      setSuccess("Payment confirmed. Finalizing your order...")
      onSuccess(orderId)
    } catch (paymentError) {
      const message = getStripeErrorMessage(paymentError)
      setError(message)
      onError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
        <div className="flex items-center justify-between text-sm text-neutral-700">
          <span>Payment for</span>
          <span className="font-semibold text-neutral-900">{campaignTitle}</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-neutral-700">
          <span>Total due</span>
          <span className="text-lg font-semibold text-neutral-900">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-neutral-900">
          <ShieldCheck className="h-4 w-4 text-neutral-700" />
          Secure checkout
        </div>
        <PaymentElement
          options={{
            layout: "tabs",
            defaultValues: {
              billingDetails: {
                email: formData.email,
              },
            },
          }}
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{success}</p>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={onBack} disabled={isSubmitting}>
          Back
        </Button>
        <Button type="submit" className="w-full" disabled={!stripe || !elements || isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing payment...
            </span>
          ) : (
            `Pay $${total.toFixed(2)}`
          )}
        </Button>
      </div>
    </form>
  )
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
  const [step, setStep] = useState<1 | 2>(1)
  const [isCreatingIntent, setIsCreatingIntent] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<PaymentFormValues>(initialValues)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const { createPaymentIntent, confirmPayment } = useStripePayment()

  const platformFee = Math.round(amount * 0.1 * 100) / 100
  const total = amount + platformFee

  const stripePromise = useMemo(() => {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (!publishableKey) {
      return null
    }

    return loadStripe(publishableKey)
  }, [])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const validateShipping = () => {
    const requiredFields: Array<keyof PaymentFormValues> = ["email", "firstName", "lastName", "address", "city", "state", "zip"]
    const missing = requiredFields.filter((field) => !formData[field].trim())

    if (missing.length > 0) {
      setError("Please complete all shipping details before continuing.")
      return false
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(formData.email)) {
      setError("Please enter a valid email address.")
      return false
    }

    return true
  }

  const handleContinue = async () => {
    if (!validateShipping()) {
      return
    }

    setIsCreatingIntent(true)
    setError("")

    try {
      const paymentIntent = await createPaymentIntent({
        amount: total,
        campaignId,
        pledgeOptionId,
        quantity,
        email: formData.email,
      })

      if (!paymentIntent?.client_secret) {
        throw new Error(paymentIntent?.error || "We could not initialize Stripe checkout.")
      }

      setClientSecret(paymentIntent.client_secret)
      setStep(2)
    } catch (paymentError) {
      const message = getStripeErrorMessage(paymentError)
      setError(message)
      onError(message)
    } finally {
      setIsCreatingIntent(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        {[1, 2].map((value) => (
          <div key={value} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                step >= value ? "bg-neutral-900 text-white" : "bg-neutral-200 text-neutral-600"
              }`}
            >
              {value}
            </div>
            <div className="hidden text-sm text-neutral-600 sm:block">
              {value === 1 ? "Shipping" : "Payment"}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {step === 1 ? (
        <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
          <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900">Shipping details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">First name</label>
                <Input name="firstName" value={formData.firstName} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Last name</label>
                <Input name="lastName" value={formData.lastName} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Email address</label>
              <Input name="email" type="email" value={formData.email} onChange={handleInputChange} required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Street address</label>
              <Input name="address" value={formData.address} onChange={handleInputChange} required />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">City</label>
                <Input name="city" value={formData.city} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">State</label>
                <Input name="state" value={formData.state} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">ZIP</label>
                <Input name="zip" value={formData.zip} onChange={handleInputChange} required />
              </div>
            </div>
          </div>

          <Card className="border-neutral-200 bg-neutral-50 p-4">
            <div className="flex items-center justify-between text-sm text-neutral-700">
              <span>Platform fee</span>
              <span>${platformFee.toFixed(2)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-base font-semibold text-neutral-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </Card>

          <Button className="w-full" onClick={handleContinue} disabled={isCreatingIntent}>
            {isCreatingIntent ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Preparing secure checkout...
              </span>
            ) : (
              "Continue to secure payment"
            )}
          </Button>
        </form>
      ) : (
        <>
          {!stripePromise ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Stripe is not configured for this environment. Please add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to continue.
            </div>
          ) : (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret: clientSecret ?? undefined,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#111827",
                    colorBackground: "#ffffff",
                    colorText: "#111827",
                    colorDanger: "#dc2626",
                    fontFamily: "Inter, system-ui, sans-serif",
                  },
                },
              }}
            >
              <StripePaymentForm
                formData={formData}
                campaignId={campaignId}
                pledgeOptionId={pledgeOptionId}
                amount={amount}
                quantity={quantity}
                campaignTitle={campaignTitle}
                onSuccess={onSuccess}
                onError={onError}
                onBack={() => setStep(1)}
              />
            </Elements>
          )}
        </>
      )}
    </div>
  )
}
