"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { CampaignLaunchForm, type CampaignFormData } from "@/components/campaign-launch-form"

export default function LaunchCampaignPage() {
  const [step, setStep] = useState(1)
  const [hasInventory, setHasInventory] = useState(false)
  const [hasTechPack, setHasTechPack] = useState(false)
  const [noTechPackOption, setNoTechPackOption] = useState("purchase") // purchase or buy
  const [isSubmittingCampaign, setIsSubmittingCampaign] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [disclosures, setDisclosures] = useState({
    deliveryObligation: false,
    techPackConsent: false,
    collaborationAgreement: false,
    termsAndConditions: false,
    ageConfirmation: false,
  })
  const { user, isLoading } = useAuth()
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user || user.role !== "creator") {
    router.push("/login")
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDisclosureChange = (field: string, checked: boolean) => {
    setDisclosures((prev) => ({
      ...prev,
      [field]: checked,
    }))
  }

  const handleContinueStep1 = () => {
    if (!hasInventory) {
      alert("Please confirm you have some inventory")
      return
    }
    setStep(2)
  }

  const handleContinueStep2 = () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill in all fields")
      return
    }
    setStep(3)
  }

  const handleCampaignFormSubmit = async (campaignData: CampaignFormData) => {
    setIsSubmittingCampaign(true)
    try {
      // TODO: Send campaign data to backend API
      console.log("Campaign form submitted:", campaignData)
      // For now, move to next step
      setStep(3)
    } catch (error) {
      console.error("Error submitting campaign form:", error)
      throw error
    } finally {
      setIsSubmittingCampaign(false)
    }
  }

  const handleSubmit = () => {
    if (
      !disclosures.deliveryObligation ||
      !disclosures.techPackConsent ||
      !disclosures.collaborationAgreement ||
      !disclosures.termsAndConditions ||
      !disclosures.ageConfirmation
    ) {
      alert("Please agree to all terms and conditions")
      return
    }

    alert("Campaign submitted successfully! Your campaign is now under review.")
    router.push("/creator-portal")
  }

  // Progress indicator component
  const ProgressBar = ({ currentStep }: { currentStep: number }) => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className={`h-1.5 w-20 rounded-full ${i <= currentStep ? "bg-neutral-900" : "bg-neutral-300"}`} />
      ))}
    </div>
  )

  return (
    <main className="flex-1 bg-neutral-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg p-8">
          {/* Step 1: Requirements */}
          {step === 1 && (
            <div className="space-y-8">
              <h1 className="text-3xl font-bold">Launch Your Campaign</h1>
              <ProgressBar currentStep={1} />

              <p className="text-neutral-700 leading-relaxed">
                The Fashion Independent helps indie fashion designers crowdfund their next design concept. To qualify, you must have:
              </p>

              <ul className="list-disc pl-6 space-y-3 text-neutral-700">
                <li>A real image or 3D rendering of your product (no hand drawings or 2D flats)</li>
                <li>A factory-ready tech pack (tech pack purchase available)</li>
                <li>Low inventory on an existing product line</li>
              </ul>

              <div className="border-t pt-8 space-y-6">
                <p className="font-bold text-neutral-900">Check all that apply</p>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="inventory"
                    checked={hasInventory}
                    onCheckedChange={(checked) => setHasInventory(checked as boolean)}
                  />
                  <Label htmlFor="inventory" className="text-base cursor-pointer">I have some inventory</Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="techpack"
                    checked={hasTechPack}
                    onCheckedChange={(checked) => setHasTechPack(checked as boolean)}
                  />
                  <Label htmlFor="techpack" className="text-base cursor-pointer">I have a tech pack</Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="no-techpack"
                    checked={!hasTechPack}
                    onCheckedChange={(checked) => setHasTechPack(!checked)}
                  />
                  <Label htmlFor="no-techpack" className="text-base cursor-pointer">I do not have a tech pack</Label>
                </div>
              </div>

              {/* Warning/Note Section */}
              <div className="border-l-4 border-red-600 bg-red-50 p-6 space-y-3">
                <div className="flex gap-3">
                  <span className="text-red-600 font-bold text-2xl flex-shrink-0">A</span>
                  <p className="text-neutral-700 text-sm">
                    To prevent fraud, we verify each creator's identity and tech pack. Creators without a factory-ready tech pack must purchase one from the company with the cost deducted from campaign earnings. See the <a href="#" className="text-blue-600 hover:underline">complete rules here</a>.
                  </p>
                </div>
              </div>

              <Button 
                onClick={handleContinueStep1}
                className="w-full bg-neutral-900 text-white hover:bg-neutral-800 h-12 font-semibold text-base"
              >
                Continue
              </Button>
            </div>
          )}

          {/* Step 2: Personal Information */}
          {step === 2 && (
            <div className="space-y-8">
              <h1 className="text-3xl font-bold">Tell us about yourself</h1>
              <ProgressBar currentStep={2} />

              <div className="space-y-6">
                <div>
                  <Label htmlFor="name" className="font-semibold text-base">Name*</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-2 bg-neutral-50"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="font-semibold text-base">Email address*</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-2 bg-neutral-50"
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="font-semibold text-base">Password*</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="mt-2 bg-neutral-50"
                  />
                </div>

                {/* Campaign Launch Form */}
                <div className="border-t pt-8 space-y-6">
                  <h2 className="text-2xl font-semibold">Campaign Details</h2>
                  <CampaignLaunchForm 
                    onSubmit={handleCampaignFormSubmit}
                    isLoading={isSubmittingCampaign}
                    onBack={() => setStep(1)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Disclosures & Terms */}
          {step === 3 && (
            <div className="space-y-8">
              <h1 className="text-3xl font-bold">Disclosures & Terms</h1>
              <ProgressBar currentStep={3} />

              <div className="space-y-5">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="delivery"
                    checked={disclosures.deliveryObligation}
                    onCheckedChange={(checked) => handleDisclosureChange("deliveryObligation", checked as boolean)}
                  />
                  <Label htmlFor="delivery" className="text-base cursor-pointer pt-0.5">
                    I affirm that I will deliver the finished goods for this campaign within the stated timeframe and understand that failure to meet this obligation may result in rights forfeiture or formal resolution.
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="techpack-consent"
                    checked={disclosures.techPackConsent}
                    onCheckedChange={(checked) => handleDisclosureChange("techPackConsent", checked as boolean)}
                  />
                  <Label htmlFor="techpack-consent" className="text-base cursor-pointer pt-0.5">
                    I affirm that I have a factory-ready tech pack for the product herein. In the absence of such documentation, I consent to purchase a tech pack from the company and authorize the cost to be deducted from my campaign earnings.
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="collaboration"
                    checked={disclosures.collaborationAgreement}
                    onCheckedChange={(checked) => handleDisclosureChange("collaborationAgreement", checked as boolean)}
                  />
                  <Label htmlFor="collaboration" className="text-base cursor-pointer pt-0.5">
                    I have read and agree to the Collaboration Agreement
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={disclosures.termsAndConditions}
                    onCheckedChange={(checked) => handleDisclosureChange("termsAndConditions", checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-base cursor-pointer pt-0.5">
                    I have read and agree to the terms and conditions of the site
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="age"
                    checked={disclosures.ageConfirmation}
                    onCheckedChange={(checked) => handleDisclosureChange("ageConfirmation", checked as boolean)}
                  />
                  <Label htmlFor="age" className="text-base cursor-pointer pt-0.5">
                    I am 18 years of age or older
                  </Label>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(2)} 
                  className="flex-1 h-12 font-semibold"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="flex-1 bg-neutral-900 text-white hover:bg-neutral-800 h-12 font-semibold text-base"
                >
                  submit
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
