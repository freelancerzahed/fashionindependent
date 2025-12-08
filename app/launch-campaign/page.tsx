"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/lib/auth-context"

export default function LaunchCampaignPage() {
  const [step, setStep] = useState(1)
  const [hasInventory, setHasInventory] = useState(false)
  const [hasTechPack, setHasTechPack] = useState(false)
  const [techPackOption, setTechPackOption] = useState("none")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    agreeTerms: false,
  })
  const [files, setFiles] = useState({
    productImage: null as File | null,
    techPack: null as File | null,
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
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: "productImage" | "techPack") => {
    if (e.target.files?.[0]) {
      setFiles((prev) => ({ ...prev, [fileType]: e.target.files![0] }))
    }
  }

  const handleSubmit = () => {
    if (!formData.agreeTerms) {
      alert("Please agree to the partnership agreement")
      return
    }

    if (!files.productImage || !files.techPack) {
      alert("Please upload both product image and tech pack")
      return
    }

    alert("Campaign submitted successfully! Your campaign is now under review.")
    router.push("/creator-portal")
  }

  return (
    <main className="flex-1 bg-neutral-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-6">Launch Your Campaign</h1>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-2 w-16 rounded-full ${i <= step ? "bg-neutral-900" : "bg-neutral-200"}`} />
            ))}
          </div>

          {/* Step 1: Requirements */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="prose max-w-none">
                <p className="text-neutral-700 leading-relaxed">
                  The Fashion Independent helps indie fashion designers crowdfund their next design concept. To qualify,
                  you must have:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                  <li>A real image or 3D rendering of your product (no hand drawings or 2D flats)</li>
                  <li>A factory-ready tech pack (tech pack purchase available)</li>
                  <li>Low inventory on an existing product line</li>
                </ul>
              </div>

              <div className="border-t pt-6 space-y-4">
                <p className="font-semibold">Check all that apply</p>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inventory"
                    checked={hasInventory}
                    onCheckedChange={(checked) => setHasInventory(checked as boolean)}
                  />
                  <Label htmlFor="inventory">I have some inventory</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="techpack"
                    checked={hasTechPack}
                    onCheckedChange={(checked) => setHasTechPack(checked as boolean)}
                  />
                  <Label htmlFor="techpack">I have a tech pack</Label>
                </div>

                {!hasTechPack && (
                  <div className="ml-6 space-y-3">
                    <p className="text-sm font-medium">Choose one</p>
                    <RadioGroup value={techPackOption} onValueChange={setTechPackOption}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1pack" id="1pack" />
                        <Label htmlFor="1pack">1 Tech Pack - $59</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="3pack" id="3pack" />
                        <Label htmlFor="3pack">3 Tech Packs - $109</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="10pack" id="10pack" />
                        <Label htmlFor="10pack">10 Tech Packs - $499</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="none" id="none" />
                        <Label htmlFor="none">None of the above</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </div>

              <Button onClick={() => setStep(2)} className="w-full">
                Continue
              </Button>
            </div>
          )}

          {/* Step 2: Personal Information */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Tell us about yourself</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeTerms: checked as boolean }))}
                  />
                  <Label htmlFor="terms">I agree to the terms of our partnership agreement</Label>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1">
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Upload Files */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Why is this important?</strong> The Fashion Independent is committed to protecting our
                  community from fraudulent activities by verifying that creators can deliver their campaign products.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="product-image">Upload product image (file size 1000px)</Label>
                  <div className="mt-2 border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
                    <Input
                      id="product-image"
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "productImage")}
                      accept="image/*"
                    />
                    <Button variant="outline" onClick={() => document.getElementById("product-image")?.click()}>
                      Select file
                    </Button>
                    <p className="text-sm text-neutral-500 mt-2">
                      {files.productImage ? files.productImage.name : "Upload File"}
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="tech-pack">Upload Tech Pack</Label>
                  <div className="mt-2 border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
                    <Input
                      id="tech-pack"
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "techPack")}
                      accept=".pdf,.doc,.docx"
                    />
                    <Button variant="outline" onClick={() => document.getElementById("tech-pack")?.click()}>
                      Select file
                    </Button>
                    <p className="text-sm text-neutral-500 mt-2">
                      {files.techPack ? files.techPack.name : "Upload File"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleSubmit} className="flex-1">
                  Submit Campaign
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
