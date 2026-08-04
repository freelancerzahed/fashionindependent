"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { getCampaignPrice } from "@/lib/campaign-pricing"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle, AlertCircle, Lock, Loader2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { useStripePayment } from "@/hooks/use-stripe-payment"

export const dynamic = "force-dynamic"

function StripeSecureCheckout({
  formData,
  campaignId,
  pledgeOptionId,
  amount,
  quantity,
  campaignTitle,
  onSuccess,
  onError,
}: {
  formData: {
    email: string
    firstName: string
    lastName: string
    address: string
    city: string
    state: string
    zip: string
  }
  campaignId: string | null
  pledgeOptionId: string | null
  amount: number
  quantity: number
  campaignTitle: string
  onSuccess: (orderId: string) => void
  onError: (error: string) => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const { confirmPayment } = useStripePayment()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (event?: React.FormEvent | React.MouseEvent) => {
    event?.preventDefault()

    if (!stripe || !elements || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      })

      if (stripeError) {
        throw new Error(stripeError.message || "Payment could not be completed.")
      }

      if (!paymentIntent || paymentIntent.status !== "succeeded") {
        throw new Error("Your payment is still processing. Please wait a moment and try again if needed.")
      }

      const confirmation = await confirmPayment({
        paymentIntentId: paymentIntent.id,
        campaignId: campaignId || "",
        pledgeOptionId: pledgeOptionId || "",
        quantity,
        email: formData.email,
        amount,
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
      const message = paymentError instanceof Error ? paymentError.message : "We could not complete your payment."
      setError(message)
      onError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
          <ShieldCheck className="h-4 w-4 text-neutral-700" />
          Secure checkout with Stripe
        </div>
        <p className="mt-2 text-sm text-neutral-600">Your card details are collected securely by Stripe for {campaignTitle}.</p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
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
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div>
      )}

      <Button type="button" onClick={handleSubmit} className="w-full" disabled={!stripe || !elements || isSubmitting}>
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing payment...
          </span>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </Button>
    </div>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productType = searchParams.get("productType") // "campaign" or "techpack"
  const campaignId = searchParams.get("campaignId")
  const pledgeOptionId = searchParams.get("pledgeOptionId")
  const quantity = Number.parseInt(searchParams.get("quantity") || "1")
  const packType = searchParams.get("packType") // for techpack: one, three, five
  const { user } = useAuth()

  // Hardcoded prices mapping - NEVER trust URL parameter for amounts
  const TECHPACK_PRICES = {
    one: 68,
    three: 188,
    five: 324
  }

  const [campaign, setCampaign] = useState<any>(null)
  const [pledgeOption, setPledgeOption] = useState<any>(null)
  const [orderId, setOrderId] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [userAddresses, setUserAddresses] = useState<any[]>([])
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null)
  const [stripeError, setStripeError] = useState<string | null>(null)
  const [isInitializingStripe, setIsInitializingStripe] = useState(false)
  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    address: "",
    city: "",
    state: "",
    zip: "",
  })

  const applyFallbackCampaignData = useCallback((fallbackTitle?: string) => {
    const fallbackCampaign = {
      id: campaignId || "fallback-campaign",
      title: fallbackTitle || `Campaign ${campaignId?.slice(0, 6) || "Selection"}`,
      description: "This campaign is temporarily unavailable, but checkout can continue securely.",
      fundingGoal: 0,
      fundedAmount: 0,
      backers: 0,
      designer: "Fashion Independent",
      daysRemaining: 0,
      pledgeOptions: [
        { id: "bronze", amount: 100, description: "Standard pledge" },
        { id: "silver", amount: 150, description: "Premium pledge" },
        { id: "gold", amount: 250, description: "VIP pledge" },
      ],
    }

    setCampaign(fallbackCampaign)

    if (pledgeOptionId === "buy-now") {
      setPledgeOption({ id: "buy-now", amount: 100, description: "Buy Now", quantity: 1 })
      return
    }

    const selected = fallbackCampaign.pledgeOptions.find((p: any) => p.id === pledgeOptionId)
    setPledgeOption(selected || fallbackCampaign.pledgeOptions[0])
  }, [campaignId, pledgeOptionId])

  // Fetch campaign data from API
  const fetchCampaign = useCallback(async () => {
    // Handle tech pack product
    if (productType === "techpack") {
      try {
        setIsLoading(true)
        setError(null)

        const packNames = {
          one: "1 Tech Pack",
          three: "3 Tech Packs",
          five: "5 Tech Packs"
        }

        const packCounts = {
          one: 1,
          three: 3,
          five: 5
        }

        setCampaign({
          id: "techpack-" + packType,
          title: packNames[packType as keyof typeof packNames] || "Tech Pack",
          description: "Professional tech pack for fashion design and manufacturing",
          fundingGoal: 0,
          fundedAmount: 0,
          backers: 0,
          designer: "Fashion Independent",
          daysRemaining: 0,
          isProduct: true,
          productType: "techpack",
        })

        // Calculate amount from packType only - never trust URL parameters
        const secureAmount = TECHPACK_PRICES[packType as keyof typeof TECHPACK_PRICES] || 68

        setPledgeOption({
          id: packType,
          amount: secureAmount,
          description: packNames[packType as keyof typeof packNames] || "Tech Pack",
          quantity: packCounts[packType as keyof typeof packCounts] || 1,
        })

        setIsLoading(false)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load tech pack"
        console.error("Tech pack load error:", message)
        setError(message)
        setIsLoading(false)
      }
      return
    }

    // Handle campaign pledge
    if (!campaignId) return

    try {
      setIsLoading(true)
      setError(null)

      const authToken = typeof window !== "undefined"
        ? (localStorage.getItem("auth_token") || localStorage.getItem("token") || "")
        : ""

      const headers: Record<string, string> = {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }

      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`
      }

      const response = await fetch(`/api/campaign/${campaignId}`, {
        method: "GET",
        headers,
      })

      if (!response.ok) {
        if ([401, 403, 404].includes(response.status)) {
          console.warn("Campaign lookup unavailable, using safe fallback data", {
            campaignId,
            status: response.status,
          })
          applyFallbackCampaignData(`Campaign ${campaignId?.slice(0, 6) || "Selection"}`)
          return
        }

        throw new Error(`Failed to load campaign: ${response.status}`)
      }

      const result = await response.json()

      if (result.status && result.campaign) {
        const apiCampaign = result.campaign

        const transformedCampaign = {
          id: apiCampaign.id,
          title: apiCampaign.title,
          description: apiCampaign.description,
          fundingGoal: apiCampaign.funding_goal,
          fundedAmount: apiCampaign.current_funding || 0,
          backers: apiCampaign.backer_count || 0,
          designer: apiCampaign.creator?.name || "Unknown Designer",
          daysRemaining: apiCampaign.days_remaining || 0,
          pledgeOptions: [
            {
              id: "bronze",
              amount: Math.round(apiCampaign.funding_goal * 0.1),
              description: "Early Bird Special"
            },
            {
              id: "silver",
              amount: Math.round(apiCampaign.funding_goal * 0.25),
              description: "Popular Pledge"
            },
            {
              id: "gold",
              amount: Math.round(apiCampaign.funding_goal * 0.5),
              description: "Premium Backer"
            },
          ]
        }

        setCampaign(transformedCampaign)

        if (pledgeOptionId === "buy-now") {
          const buyNowAmount = getCampaignPrice(apiCampaign) || 100
          setPledgeOption({
            id: "buy-now",
            amount: buyNowAmount,
            description: "Buy Now",
            quantity: 1,
          })
        } else {
          const selected = transformedCampaign.pledgeOptions.find((p: any) => p.id === pledgeOptionId)
          if (selected) {
            setPledgeOption(selected)
          } else {
            throw new Error("Invalid pledge option")
          }
        }
      } else {
        console.warn("Campaign payload was invalid, using safe fallback data", result)
        applyFallbackCampaignData(`Campaign ${campaignId?.slice(0, 6) || "Selection"}`)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load campaign"
      console.error("Campaign load error:", message)
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [campaignId, pledgeOptionId, productType, packType, applyFallbackCampaignData])

  // Load user's saved addresses from API
  const fetchUserAddresses = useCallback(async () => {
    if (!user) {
      console.log("No user logged in")
      return
    }

    try {
      setIsLoadingAddresses(true)

      const token = localStorage.getItem("auth_token") || localStorage.getItem("token")
      if (!token) {
        console.warn("No auth token found, skipping address fetch")
        return
      }

      console.log("Fetching user shipping addresses from API")

      const response = await fetch(`/api/user/shipping/address`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })

      console.log("Address fetch response status:", response.status)

      if (response.ok) {
        const result = await response.json()
        console.log("Address response:", result)
        
        // Handle different response formats from AddressCollection
        if (result.data && Array.isArray(result.data)) {
          // Standard API resource response
          const addresses = result.data.map((addr: any) => ({
            ...addr,
            // Map first_name/last_name from user's name if not present
            first_name: addr.first_name || user.name?.split(" ")[0] || "",
            last_name: addr.last_name || user.name?.split(" ").slice(1).join(" ") || "",
          }))
          setUserAddresses(addresses)
          console.log("Loaded addresses:", addresses)
        } else if (Array.isArray(result)) {
          // Direct array response
          const addresses = result.map((addr: any) => ({
            ...addr,
            first_name: addr.first_name || user.name?.split(" ")[0] || "",
            last_name: addr.last_name || user.name?.split(" ").slice(1).join(" ") || "",
          }))
          setUserAddresses(addresses)
          console.log("Loaded addresses (direct array):", addresses)
        }
      } else {
        console.warn("Failed to load addresses, status:", response.status)
        const errorText = await response.text()
        console.warn("Error response:", errorText)
      }
    } catch (err) {
      console.error("Failed to load user addresses:", err)
    } finally {
      setIsLoadingAddresses(false)
    }
  }, [user])

  const stripePublishableKey = useMemo(() => {
    return (
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_STRIPE_KEY ||
      "pk_live_51IsUGRHkO4Hrmh8p74IjzWbm5Po8ZKAPoSbn6W7Vc4SZ3XtUnmKs6tgVFzRPdnArLZh33P0mm0YnyCFOISAnVtnk0097bnXe2y"
    )
  }, [])
  const [stripeConfigError, setStripeConfigError] = useState<string | null>(null)

  useEffect(() => {
    if (!stripePublishableKey) {
      setStripeConfigError("Stripe publishable key is not configured. Please add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to continue.")
      return
    }

    setStripeConfigError(null)
  }, [stripePublishableKey])

  const stripePromise = useMemo(() => {
    if (!stripePublishableKey) {
      return null
    }

    return loadStripe(stripePublishableKey)
  }, [stripePublishableKey])

  const { createPaymentIntent } = useStripePayment()

  const itemAmount = pledgeOption?.amount ? pledgeOption.amount * quantity : 0
  const platformFee = Math.round(itemAmount * 0.1 * 100) / 100
  const total = itemAmount + platformFee
  const showMainSubmitButton = paymentMethod === "paypal" || !stripeClientSecret

  // Autofill address from user profile
  const autofillAddress = (address: any) => {
    setFormData((prev) => ({
      ...prev,
      firstName: address.first_name || address.firstName || prev.firstName,
      lastName: address.last_name || address.lastName || prev.lastName,
      address: address.street_address || address.address || "",
      city: address.city || "",
      state: address.state || address.province || address.state_id || "",
      zip: address.postal_code || address.zip || "",
    }))
    // Scroll to top to show form was filled
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Set primary address automatically on load
  const setPrimaryAddress = useCallback(() => {
    if (userAddresses.length > 0) {
      const primaryAddress = userAddresses.find((addr: any) => addr.is_primary) || userAddresses[0]
      if (primaryAddress) {
        autofillAddress(primaryAddress)
      }
    }
  }, [userAddresses])

  // Initialize campaign or tech pack data on mount
  useEffect(() => {
    if (productType === "techpack") {
      if (!packType) {
        setError("Missing tech pack information")
        return
      }
      fetchCampaign()
    } else {
      if (!campaignId || !pledgeOptionId) {
        setError("Missing campaign or pledge information")
        return
      }
      fetchCampaign()
    }
  }, [campaignId, pledgeOptionId, productType, packType, fetchCampaign])

  // Load user addresses on mount
  useEffect(() => {
    if (user) {
      fetchUserAddresses()
    }
  }, [user, fetchUserAddresses])

  // Set primary address when user addresses are loaded
  useEffect(() => {
    setPrimaryAddress()
  }, [userAddresses, setPrimaryAddress])

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validate zip code
  const validateZip = (zip: string): boolean => {
    return /^[0-9]{5,10}$/.test(zip.replace(/\s/g, ""))
  }

  // Validate card number (simple Luhn algorithm)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const updated = { ...prev }
        delete updated[name]
        return updated
      })
    }
  }

  const getFormValidationErrors = (): Record<string, string> => {
    const errors: Record<string, string> = {}

    if (!formData.firstName?.trim()) {
      errors.firstName = "First name is required"
    }
    if (!formData.lastName?.trim()) {
      errors.lastName = "Last name is required"
    }
    if (!formData.email?.trim()) {
      errors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      errors.email = "Invalid email format"
    }
    if (!formData.address?.trim()) {
      errors.address = "Address is required"
    }
    if (!formData.city?.trim()) {
      errors.city = "City is required"
    }
    if (!formData.state?.trim()) {
      errors.state = "State is required"
    }
    if (!formData.zip?.trim()) {
      errors.zip = "ZIP code is required"
    } else if (!validateZip(formData.zip)) {
      errors.zip = "Invalid ZIP code format"
    }

    return errors
  }

  const validateForm = (): boolean => {
    const errors = getFormValidationErrors()
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const isFormValidForInit = (): boolean => {
    return Object.keys(getFormValidationErrors()).length === 0
  }

  const initializeStripe = useCallback(async () => {
    if (!stripePromise || stripeClientSecret || isInitializingStripe || paymentMethod !== "stripe") {
      return
    }

    if (!isFormValidForInit()) {
      return
    }

    setIsInitializingStripe(true)
    setStripeError(null)

    try {
      const paymentIntent = await createPaymentIntent({
        amount: total,
        campaignId: campaignId || "",
        pledgeOptionId: pledgeOptionId || packType || "",
        quantity,
        email: formData.email,
      })

      if (!paymentIntent?.client_secret) {
        throw new Error(paymentIntent?.error || "We could not initialize Stripe checkout.")
      }

      setStripeClientSecret(paymentIntent.client_secret)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to initialize Stripe payment"
      console.error("Stripe initialization error:", message)
      setStripeError(message)
      setStripeClientSecret(null)
    } finally {
      setIsInitializingStripe(false)
    }
  }, [campaignId, createPaymentIntent, formData.email, isInitializingStripe, paymentMethod, packType, pledgeOptionId, quantity, stripePromise, total])

  useEffect(() => {
    initializeStripe()
  }, [formData.email, formData.firstName, formData.lastName, formData.address, formData.city, formData.state, formData.zip, initializeStripe])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (paymentMethod === "paypal") {
      setIsProcessing(true)
      setError(null)

      try {
        const newOrderId = `TFI-${Date.now()}`
        setOrderId(newOrderId)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setIsSuccess(true)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Payment processing failed"
        console.error("Payment error:", message)
        setError(message)
      } finally {
        setIsProcessing(false)
      }
      return
    }

    setIsProcessing(true)
    setStripeError(null)
    setError(null)

    try {
      const paymentIntent = await createPaymentIntent({
        amount: total,
        campaignId: campaignId || "",
        pledgeOptionId: pledgeOptionId || packType || "",
        quantity,
        email: formData.email,
      })

      if (!paymentIntent?.client_secret) {
        throw new Error(paymentIntent?.error || "We could not initialize Stripe checkout.")
      }

      setStripeClientSecret(paymentIntent.client_secret)
      setStripeError(null)
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to initialize Stripe payment"
      console.error("Stripe initialization error:", message)
      setStripeClientSecret(null)
      setStripeError(message)
      setError(message)
    } finally {
      setIsProcessing(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-white via-neutral-50 to-white flex items-center justify-center">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-neutral-200 border-t-neutral-900"></div>
          </div>
          <p className="text-lg text-neutral-600 font-medium">Loading checkout...</p>
        </div>
      </main>
    )
  }

  // Error state
  if (error && !campaign) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-white via-neutral-50 to-white flex items-center justify-center">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center justify-center mb-4 p-4 bg-red-50 rounded-full">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-neutral-900">Checkout Error</h1>
          <p className="text-red-600 mb-6 font-medium">{error}</p>
          <Button onClick={() => router.push("/discover")} className="bg-neutral-900 hover:bg-neutral-800">
            Back to Discover
          </Button>
        </div>
      </main>
    )
  }

  if (!campaign || !pledgeOption) {
    return null
  }

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-white via-neutral-50 to-white">
        <div className="border-b bg-white sticky top-0 z-10">
          <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 max-w-7xl">
            <Link
              href={productType === "techpack" ? "/dashboard/documents" : `/campaign/${campaignId}`}
              className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">
                {productType === "techpack" ? "Back to Documents" : "Back to Campaign"}
              </span>
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 max-w-5xl">
          <div className="max-w-2xl mx-auto">
            {/* Success Icon and Message */}
            <div className="text-center mb-8 sm:mb-12">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-200 rounded-full blur-lg opacity-40"></div>
                  <CheckCircle className="relative w-20 h-20 sm:w-24 sm:h-24 text-green-600" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-neutral-900">Order Confirmed!</h1>
              <p className="text-base sm:text-lg text-neutral-600">Thank you for supporting independent fashion designers</p>
            </div>

            {/* Order Details Card */}
            <Card className="p-6 sm:p-8 mb-8 border border-neutral-200 bg-white shadow-lg">
              <div className="space-y-6">
                {/* Order ID */}
                <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                  <p className="text-xs sm:text-sm text-neutral-600 font-medium mb-2">Order ID</p>
                  <p className="text-xl sm:text-2xl font-bold text-neutral-900 font-mono">{orderId}</p>
                </div>

                {/* Campaign Info */}
                <div className="border-t border-neutral-200 pt-6">
                  <p className="text-xs sm:text-sm text-neutral-600 font-medium mb-3">Campaign</p>
                  <p className="font-semibold text-lg text-neutral-900">{campaign?.title}</p>
                  <p className="text-sm text-neutral-600 mt-1">by {campaign?.designer}</p>
                </div>

                {/* Payment Method */}
                <div className="border-t border-neutral-200 pt-6">
                  <p className="text-xs sm:text-sm text-neutral-600 font-medium mb-3">Payment Method</p>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-neutral-600" />
                    <p className="font-semibold text-neutral-900 capitalize">{paymentMethod === "stripe" ? "Credit Card" : "PayPal"}</p>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="border-t border-neutral-200 pt-6 bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-lg p-4 -mx-8 sm:-mx-8 mb-0 px-4 sm:px-8">
                  <p className="text-xs sm:text-sm text-neutral-600 font-medium mb-2">Total Paid</p>
                  <p className="text-2xl sm:text-3xl font-bold text-neutral-900">${total.toFixed(2)}</p>
                </div>

                {/* Confirmation Details */}
                <div className="border-t border-neutral-200 pt-6 space-y-3">
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    ✓ Confirmation email sent to <span className="font-semibold text-neutral-900">{formData.email}</span>
                  </p>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    ✓ Expected delivery: 60 days from campaign end
                  </p>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Check your email for shipping and tracking information
                  </p>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/discover" className="flex-1">
                <Button className="w-full py-5 sm:py-6 text-base font-semibold bg-neutral-900 hover:bg-neutral-800 text-white">
                  Discover More Campaigns
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full py-5 sm:py-6 text-base font-semibold border-2">
                  Go to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-neutral-50 to-white">
      <div className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 max-w-7xl">
          <Link
            href={`/campaign/${campaignId}`}
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Campaign</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {/* Main Form Section */}
          <div className="lg:col-span-2">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900">Complete Your Pledge</h1>
              <p className="text-neutral-600 mt-2">Secure checkout powered by <strong>Stripe</strong> & <strong>PayPal</strong></p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-6 p-4 sm:p-5 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900">Error</h3>
                    <p className="text-sm text-red-800 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Shipping Section */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-7 md:p-8 border border-neutral-200 shadow-sm">
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-6">Shipping Address</h2>

                {/* User Saved Addresses - Quick Fill Buttons */}
                {userAddresses.length > 0 ? (
                  <div className="mb-6 pb-6 border-b border-neutral-200">
                    <p className="text-sm font-semibold text-neutral-700 mb-3 flex items-center gap-2">
                      📍 <span>Your Saved Addresses</span>
                      {isLoadingAddresses && <span className="text-xs text-neutral-500">(Loading...)</span>}
                    </p>
                    <div className="space-y-2">
                      {userAddresses.map((address: any, idx: number) => (
                        <button
                          key={address.id || idx}
                          type="button"
                          onClick={() => autofillAddress(address)}
                          className="w-full text-left p-3 sm:p-4 bg-gradient-to-r from-neutral-50 to-neutral-100 border-2 border-neutral-300 rounded-lg hover:border-neutral-900 hover:bg-neutral-100 transition-all duration-200 active:scale-95"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-neutral-900 text-sm flex items-center gap-2">
                                <span className="truncate">
                                  {address.first_name || address.firstName || formData.firstName} {address.last_name || address.lastName || formData.lastName}
                                </span>
                                {address.is_primary && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold flex-shrink-0">
                                    Primary
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-neutral-600 mt-1 truncate">
                                {address.street_address || address.address || ""}
                              </p>
                              <p className="text-xs text-neutral-600">
                                {address.city}, {address.state || address.province} {address.postal_code || address.zip}
                              </p>
                            </div>
                            <div className="text-lg flex-shrink-0 ml-2">✓</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 pb-6 border-b border-neutral-200">
                    <p className="text-sm text-neutral-600 text-center py-4">
                      {isLoadingAddresses ? "🔄 Loading your saved addresses..." : "No saved addresses yet. Fill in the form below."}
                    </p>
                  </div>
                )}

                <div className="space-y-5">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-semibold text-neutral-900">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`mt-2 h-11 text-base border-2 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 ${formErrors.firstName ? "border-red-400 bg-red-50" : "border-neutral-300"}`}
                      />
                      {formErrors.firstName && <p className="text-xs text-red-600 mt-1 font-medium">{formErrors.firstName}</p>}
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm font-semibold text-neutral-900">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`mt-2 h-11 text-base border-2 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 ${formErrors.lastName ? "border-red-400 bg-red-50" : "border-neutral-300"}`}
                      />
                      {formErrors.lastName && <p className="text-xs text-red-600 mt-1 font-medium">{formErrors.lastName}</p>}
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <Label htmlFor="email" className="text-sm font-semibold text-neutral-900">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      placeholder="john@example.com"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`mt-2 h-11 text-base border-2 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 ${formErrors.email ? "border-red-400 bg-red-50" : "border-neutral-300"}`}
                    />
                    {formErrors.email && <p className="text-xs text-red-600 mt-1 font-medium">{formErrors.email}</p>}
                  </div>

                  {/* Address Field */}
                  <div>
                    <Label htmlFor="address" className="text-sm font-semibold text-neutral-900">
                      Street Address *
                    </Label>
                    <Input
                      id="address"
                      placeholder="123 Main St"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`mt-2 h-11 text-base border-2 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 ${formErrors.address ? "border-red-400 bg-red-50" : "border-neutral-300"}`}
                    />
                    {formErrors.address && <p className="text-xs text-red-600 mt-1 font-medium">{formErrors.address}</p>}
                  </div>

                  {/* City, State, ZIP */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                    <div>
                      <Label htmlFor="city" className="text-sm font-semibold text-neutral-900">
                        City *
                      </Label>
                      <Input
                        id="city"
                        placeholder="New York"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`mt-2 h-11 text-base border-2 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 ${formErrors.city ? "border-red-400 bg-red-50" : "border-neutral-300"}`}
                      />
                      {formErrors.city && <p className="text-xs text-red-600 mt-1 font-medium">{formErrors.city}</p>}
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-sm font-semibold text-neutral-900">
                        State *
                      </Label>
                      <Input
                        id="state"
                        placeholder="NY"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`mt-2 h-11 text-base border-2 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 ${formErrors.state ? "border-red-400 bg-red-50" : "border-neutral-300"}`}
                      />
                      {formErrors.state && <p className="text-xs text-red-600 mt-1 font-medium">{formErrors.state}</p>}
                    </div>
                    <div>
                      <Label htmlFor="zip" className="text-sm font-semibold text-neutral-900">
                        ZIP Code *
                      </Label>
                      <Input
                        id="zip"
                        placeholder="10001"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        className={`mt-2 h-11 text-base border-2 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 ${formErrors.zip ? "border-red-400 bg-red-50" : "border-neutral-300"}`}
                      />
                      {formErrors.zip && <p className="text-xs text-red-600 mt-1 font-medium">{formErrors.zip}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-3xl p-6 sm:p-7 md:p-8 border border-slate-200 shadow-sm">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">Payment Method</h2>
                <p className="text-sm text-slate-600 mb-5">Choose how you want to pay for your pledge.</p>
                <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "stripe" | "paypal")}>
                  <TabsList className="grid w-full grid-cols-2 gap-2 bg-slate-100 rounded-full p-1">
                    <TabsTrigger value="stripe" className="rounded-full bg-white py-3 text-sm font-semibold text-slate-900 shadow-sm">💳 Card</TabsTrigger>
                    <TabsTrigger value="paypal" className="rounded-full bg-white py-3 text-sm font-semibold text-slate-900 shadow-sm">🅿️ PayPal</TabsTrigger>
                  </TabsList>

                  <TabsContent value="stripe" className="space-y-5 mt-6">
                    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-900">
                      <p className="font-semibold">Secure card entry</p>
                      <p className="mt-2 text-slate-600">
                        {stripeClientSecret ?
                          "Your secure Stripe payment form is ready. Enter your card details below." :
                          isInitializingStripe ?
                          "Initializing Stripe secure checkout... please wait." :
                          "Complete the shipping details to activate Stripe and display the card form below."
                        }
                      </p>
                      {isInitializingStripe && (
                        <div className="mt-3 inline-flex items-center gap-2 text-sm text-slate-700">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading Stripe…</span>
                        </div>
                      )}
                    </div>

                    {stripePromise ? (
                      <>
                        {stripeClientSecret ? (
                          <Elements
                            stripe={stripePromise}
                            options={{
                              clientSecret: stripeClientSecret,
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
                            <StripeSecureCheckout
                              formData={formData}
                              campaignId={campaignId}
                              pledgeOptionId={pledgeOptionId}
                              amount={total}
                              quantity={quantity}
                              campaignTitle={campaign?.title || "Fashion Independent checkout"}
                              onSuccess={(orderId) => {
                                setOrderId(orderId)
                                setIsSuccess(true)
                              }}
                              onError={(message) => {
                                setError(message)
                                setStripeError(message)
                              }}
                            />
                          </Elements>
                        ) : (
                          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
                            {stripeError ? (
                              <p className="text-red-700">{stripeError}</p>
                            ) : (
                              <p>Finish your shipping details above to activate Stripe and display the secure card form here.</p>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                        {stripeConfigError || "Stripe is not configured for this environment. Please add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to continue."}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="paypal" className="mt-6">
                    <Card className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-900 font-medium mb-2">PayPal Checkout</p>
                      <p className="text-sm text-blue-900 leading-relaxed">
                        You will be redirected to PayPal to complete your payment securely. Your shipping information has been saved.
                      </p>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Submit Button */}
              {showMainSubmitButton && (
                <Button
                  type="submit"
                  className="w-full py-5 sm:py-6 text-base sm:text-lg font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-2xl transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isProcessing}
                >
                  {isProcessing
                    ? "Processing your payment..."
                    : paymentMethod === "paypal"
                      ? `Complete Pledge - $${total.toFixed(2)}`
                      : `Continue to Stripe - $${total.toFixed(2)}`}
                </Button>
              )}

              <p className="text-xs text-center text-neutral-600">
                * All fields are required. We never share your information.
              </p>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Order Summary Card */}
              <Card className="p-6 sm:p-7 md:p-8 border border-neutral-200 bg-white shadow-lg rounded-xl sm:rounded-2xl">
                <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-6">Order Summary</h3>

                {/* Summary Items */}
                <div className="space-y-4 mb-6 pb-6 border-b border-slate-200">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Pledge Amount</span>
                    <span className="font-semibold text-slate-900">${pledgeOption?.amount}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Quantity</span>
                    <span className="font-semibold text-slate-900">{quantity}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">${itemAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Platform Fee</span>
                    <span className="font-semibold text-slate-900">${platformFee.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[28px] p-5 mb-8 text-white shadow-xl shadow-slate-900/10">
                  <div className="flex justify-between items-center gap-3">
                    <div>
                      <p className="text-sm text-slate-400">Total</p>
                      <p className="text-2xl font-semibold mt-1">${total.toFixed(2)}</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-slate-800 px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-300">
                      Quick total
                    </span>
                  </div>
                </div>

                {/* Campaign Info */}
                <div className="space-y-4 text-sm border-t border-neutral-200 pt-6">
                  <div>
                    <p className="font-bold text-neutral-900 text-base">{campaign?.title}</p>
                    <p className="text-neutral-600 text-xs mt-1">by {campaign?.designer}</p>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    📦 Support independent fashion. Expected delivery: 60 days from campaign end.
                  </p>
                  <p className="text-xs text-neutral-500 leading-relaxed pt-2 border-t border-neutral-200">
                    ✓ Secure payment
                    <br />✓ Money-back guarantee
                    <br />✓ No hidden fees
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
