"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle, AlertCircle, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"

export const dynamic = "force-dynamic"

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
  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    address: "",
    city: "",
    state: "",
    zip: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })

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

      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      if (!apiUrl) {
        throw new Error("API URL not configured")
      }

      const response = await fetch(`${apiUrl}/campaign/${campaignId}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
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

        const selected = transformedCampaign.pledgeOptions.find((p: any) => p.id === pledgeOptionId)
        if (selected) {
          setPledgeOption(selected)
        } else {
          throw new Error("Invalid pledge option")
        }
      } else {
        throw new Error("Invalid campaign data")
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load campaign"
      console.error("Campaign load error:", message)
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [campaignId, pledgeOptionId, productType, packType])

  // Load user's saved addresses from API
  const fetchUserAddresses = useCallback(async () => {
    if (!user) {
      console.log("No user logged in")
      return
    }

    try {
      setIsLoadingAddresses(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      if (!apiUrl) {
        console.error("API URL not configured")
        return
      }

      const token = localStorage.getItem("auth_token") || localStorage.getItem("token")
      if (!token) {
        console.warn("No auth token found, skipping address fetch")
        return
      }

      console.log("Fetching user shipping addresses from API")

      const response = await fetch(`${apiUrl}/user/shipping/address`, {
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
  const validateCardNumber = (card: string): boolean => {
    const cardNum = card.replace(/\s/g, "")
    if (!/^\d{13,19}$/.test(cardNum)) return false
    
    let sum = 0
    let isEven = false
    for (let i = cardNum.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNum[i], 10)
      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }
      sum += digit
      isEven = !isEven
    }
    return sum % 10 === 0
  }

  // Validate CVV
  const validateCVV = (cvv: string): boolean => {
    return /^\d{3,4}$/.test(cvv)
  }

  // Validate expiry date
  const validateExpiryDate = (expiry: string): boolean => {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/
    if (!regex.test(expiry)) return false

    const [month, year] = expiry.split("/")
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear() % 100
    const currentMonth = currentDate.getMonth() + 1

    const expiryYear = parseInt(year, 10)
    const expiryMonth = parseInt(month, 10)

    if (expiryYear < currentYear) return false
    if (expiryYear === currentYear && expiryMonth < currentMonth) return false

    return true
  }

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

  const validateForm = (): boolean => {
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

    if (paymentMethod === "stripe") {
      if (!formData.cardNumber?.trim()) {
        errors.cardNumber = "Card number is required"
      } else if (!validateCardNumber(formData.cardNumber)) {
        errors.cardNumber = "Invalid card number"
      }
      if (!formData.expiryDate?.trim()) {
        errors.expiryDate = "Expiry date is required"
      } else if (!validateExpiryDate(formData.expiryDate)) {
        errors.expiryDate = "Invalid or expired card"
      }
      if (!formData.cvv?.trim()) {
        errors.cvv = "CVV is required"
      } else if (!validateCVV(formData.cvv)) {
        errors.cvv = "Invalid CVV"
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const newOrderId = `TFI-${Date.now()}`
      setOrderId(newOrderId)

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Here you would typically call your payment API
      // For now, we'll simulate success
      console.log("Payment processed:", {
        orderId: newOrderId,
        productType: productType,
        campaignId: campaignId,
        pledgeOptionId: pledgeOptionId || packType,
        quantity: quantity,
        amount: pledgeOption?.amount,
        totalAmount: total,
        paymentMethod: paymentMethod,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
        }
      })

      setIsSuccess(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Payment processing failed"
      console.error("Payment error:", message)
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

  const itemAmount = pledgeOption.amount * quantity
  const platformFee = Math.round(itemAmount * 0.1 * 100) / 100
  const total = itemAmount + platformFee

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

              <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-7 md:p-8 border border-neutral-200 shadow-sm">
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-6">Payment Method</h2>
                <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "stripe" | "paypal")}>
                  <TabsList className="grid w-full grid-cols-2 bg-neutral-100 rounded-lg p-1">
                    <TabsTrigger value="stripe" className="rounded-md font-semibold">💳 Card</TabsTrigger>
                    <TabsTrigger value="paypal" className="rounded-md font-semibold">🅿️ PayPal</TabsTrigger>
                  </TabsList>

                  <TabsContent value="stripe" className="space-y-5 mt-6">
                    <div>
                      <Label htmlFor="cardNumber" className="text-sm font-semibold text-neutral-900">
                        Card Number *
                      </Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className={`mt-2 h-11 text-base border-2 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 font-mono ${formErrors.cardNumber ? "border-red-400 bg-red-50" : "border-neutral-300"}`}
                      />
                      {formErrors.cardNumber && <p className="text-xs text-red-600 mt-1 font-medium">{formErrors.cardNumber}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div>
                        <Label htmlFor="expiryDate" className="text-sm font-semibold text-neutral-900">
                          Expiry Date (MM/YY) *
                        </Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          className={`mt-2 h-11 text-base border-2 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 font-mono ${formErrors.expiryDate ? "border-red-400 bg-red-50" : "border-neutral-300"}`}
                        />
                        {formErrors.expiryDate && <p className="text-xs text-red-600 mt-1 font-medium">{formErrors.expiryDate}</p>}
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="text-sm font-semibold text-neutral-900">
                          CVV *
                        </Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          maxLength={4}
                          className={`mt-2 h-11 text-base border-2 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 font-mono ${formErrors.cvv ? "border-red-400 bg-red-50" : "border-neutral-300"}`}
                        />
                        {formErrors.cvv && <p className="text-xs text-red-600 mt-1 font-medium">{formErrors.cvv}</p>}
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                      <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-900">Your payment is secured by Stripe. Your card details are encrypted and safe.</p>
                    </div>
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
              <Button
                type="submit"
                className="w-full py-5 sm:py-6 text-base sm:text-lg font-bold bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl sm:rounded-2xl transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isProcessing}
              >
                {isProcessing
                  ? "Processing your payment..."
                  : `Complete Pledge - $${total.toFixed(2)}`}
              </Button>

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
                <div className="space-y-4 mb-6 pb-6 border-b border-neutral-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Pledge Amount</span>
                    <span className="font-semibold text-neutral-900">${pledgeOption?.amount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Quantity</span>
                    <span className="font-semibold text-neutral-900">{quantity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Subtotal</span>
                    <span className="font-semibold text-neutral-900">${itemAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Platform Fee (10%)</span>
                    <span className="font-semibold text-neutral-900">${platformFee.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-lg p-4 mb-8 text-white">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold">${total.toFixed(2)}</span>
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
