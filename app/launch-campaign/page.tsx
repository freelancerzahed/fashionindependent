"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
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
  const [noTechPackOption, setNoTechPackOption] = useState("purchase")
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

  // Redirect to signup if not logged in
  if (!user) {
    return (
      <main className="flex-1 bg-neutral-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-lg p-8 text-center space-y-6">
            <h1 className="text-3xl font-bold">Launch Your Campaign</h1>
            <p className="text-neutral-700">
              You need to be a registered creator to launch a campaign.
            </p>
            <div className="flex gap-4">
              <Link href="/become-creator" className="flex-1">
                <Button className="w-full bg-neutral-900 text-white hover:bg-neutral-800 h-12 font-semibold text-base">
                  Become a Creator
                </Button>
              </Link>
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full h-12 font-semibold text-base">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
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
    // Only validate registration form if user is not logged in
    if (!user && (!formData.name || !formData.email || !formData.password)) {
      alert("Please fill in all fields")
      return
    }
    setStep(3)
  }

  const handleCampaignFormSubmit = async (campaignData: CampaignFormData) => {
    setIsSubmittingCampaign(true)
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        throw new Error("Authentication required. Please log in to continue.")
      }

      console.log("[Campaign] Submitting campaign with token:", token.substring(0, 30) + "...")

      // Create JSON payload instead of FormData for better compatibility
      // Files are optional for now - will be added later via separate file upload API
      const payload = {
        title: campaignData.productName,
        description: campaignData.productDescription,
        funding_goal: 5000, // Default funding goal
        product_name: campaignData.productName,
        product_description: campaignData.productDescription,
        materials: campaignData.materials.filter(m => m.trim()),
        colors: campaignData.colors.filter(c => c.trim()),
        sizes: campaignData.sizes.filter(s => s.size.trim()),
        projectDuration: campaignData.projectDuration,
      }

      console.log("[Campaign] Sending campaign payload:", {
        title: payload.title,
        hasImages: campaignData.productImages.length > 0,
        imageCount: campaignData.productImages.filter(img => img.file).length,
        hasTechPack: !!campaignData.techPackFile,
        materialsCount: payload.materials.length,
        colorsCount: payload.colors.length,
        sizesCount: payload.sizes.length,
      })

      let response;
      try {
        response = await fetch("/api/campaign", {  // Using the main campaign endpoint
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
      } catch (fetchError) {
        const errorMsg = fetchError instanceof Error ? fetchError.message : String(fetchError);
        console.error("[Campaign] Fetch request failed:", {
          error: errorMsg,
          type: fetchError instanceof TypeError ? "Network/Connection Error" : typeof fetchError,
        });
        
        throw new Error(
          `Failed to submit campaign form to the server. ${errorMsg}. ` +
          `Please check your internet connection and try again.`
        );
      }

      // Clone the response for error handling in case we need to read the body
      const responseClone = response.clone();

      if (!response.ok) {
        let errorMessage = "Failed to create campaign"
        let responseText = ""
        
        try {
          responseText = await responseClone.text()
          console.error("[Campaign] Error response body:", responseText)
          
          // Try to parse as JSON
          try {
            const errorData = JSON.parse(responseText)
            errorMessage = errorData.error || errorData.message || errorMessage
            
            // Provide helpful error messages based on status code
            if (response.status === 401) {
              errorMessage = "Your session has expired. Please log in again."
            } else if (response.status === 403) {
              errorMessage = errorData.message || "You need to complete your creator profile to launch campaigns."
            } else if (response.status === 422) {
              errorMessage = "Please fill in all required fields correctly."
              if (errorData.errors) {
                errorMessage += "\n" + Object.entries(errorData.errors)
                  .map(([field, msgs]: [string, any]) => `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
                  .join("\n")
              }
            } else if (response.status === 503) {
              // Backend server unreachable
              errorMessage = "The backend server is temporarily unavailable. Please try again in a few moments."
            } else if (response.status === 500 || response.status >= 500) {
              errorMessage = errorData.error || "Server error. Please try again later."
            }
          } catch (parseError) {
            // Response is not JSON, use the raw text
            if (responseText) {
              errorMessage = `Server error (${response.status}): ${responseText.substring(0, 200)}`
            } else if (response.status === 503) {
              errorMessage = "Cannot connect to the backend server. Please check that it is running and try again."
            } else {
              errorMessage = `Server error (${response.status}): No response body`
            }
          }
        } catch (readError) {
          errorMessage = `Failed to read error response: ${readError}`
        }
        
        console.error("[Campaign] Final error message:", errorMessage)
        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log("Campaign created successfully:", result)
      console.log("Campaign ID:", result?.campaign?.id)
      
      // Extract campaign ID - handle different response structures
      const campaignId = result?.campaign?.id || result?.id
      
      // Now upload files if they exist
      if (campaignId && (campaignData.productImages.length > 0 || campaignData.techPackFile)) {
        console.log("[Campaign] Uploading files for campaign:", campaignId)
        console.log("[Campaign] Images to upload:", campaignData.productImages.length)
        console.log("[Campaign] Tech pack:", !!campaignData.techPackFile)
        console.log("[Campaign] All product images:", campaignData.productImages.map(img => ({ type: img.type, name: img.file?.name, fileExists: !!img.file, fileType: img.file?.type })))
        
        const uploadFormData = new FormData()
        
        // Build image metadata array and add files
        const imageMetadata: Record<string, unknown>[] = []
        let fileIndex = 0
        let successfullyAddedFiles = 0
        
        // Add product images - use array notation to send all files
        campaignData.productImages.forEach((img) => {
          if (img.file && img.file instanceof File) {
            console.log(`[Campaign] Processing image (${img.type}):`, {
              name: img.file.name,
              size: img.file.size,
              type: img.file.type,
              fileIndex: fileIndex,
              isFile: img.file instanceof File
            })
            
            // Use array notation - product_images[] will append files to an array
            uploadFormData.append("product_images[]", img.file)
            
            // Track metadata with the correct index
            imageMetadata.push({
              fileIndex: fileIndex,
              type: img.type,
              name: img.file.name,
              size: img.file.size
            })
            
            fileIndex++
            successfullyAddedFiles++
          } else {
            const file = img.file
            console.warn(`[Campaign] Skipping image (${img.type}) - not a valid File object`, {
              hasFile: !!file,
              fileType: typeof file,
              isFile: typeof file === 'object' && file !== null
            })
          }
        })
        
        // Send metadata as JSON
        if (imageMetadata.length > 0) {
          uploadFormData.append("image_metadata", JSON.stringify(imageMetadata))
          console.log("[Campaign] Image metadata sent:", imageMetadata)
        }
        
        // Add tech pack
        if (campaignData.techPackFile && campaignData.techPackFile instanceof File) {
          console.log("[Campaign] Adding tech pack:", {
            name: campaignData.techPackFile.name,
            size: campaignData.techPackFile.size,
            type: campaignData.techPackFile.type,
            isFile: campaignData.techPackFile instanceof File
          })
          uploadFormData.append("tech_pack_file", campaignData.techPackFile)
        } else if (campaignData.techPackFile) {
          const file = campaignData.techPackFile
          console.warn("[Campaign] Tech pack exists but is not a valid File object", {
            fileType: typeof file,
            isFile: typeof file === 'object' && file !== null
          })
        }
        
        console.log("[Campaign] FormData prepared with", successfullyAddedFiles, "images")
        
        try {
          const uploadResponse = await fetch(`/api/campaign/upload/${campaignId}`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
            body: uploadFormData,
          })
          
          let uploadResult: any = {}
          const contentType = uploadResponse.headers.get('content-type')
          const isJsonResponse = contentType && contentType.includes('application/json')
          
          try {
            if (isJsonResponse) {
              uploadResult = await uploadResponse.json()
            } else {
              // Response is not JSON, try to get text for debugging
              const responseText = await uploadResponse.text()
              console.warn("[Campaign] File upload response is not JSON", {
                campaign_id: campaignId,
                status: uploadResponse.status,
                statusText: uploadResponse.statusText,
                contentType: contentType,
                responseLength: responseText.length,
                responsePreview: responseText.substring(0, 300),
              })
              
              if (!uploadResponse.ok) {
                throw new Error(
                  `File upload failed with status ${uploadResponse.status}. Server response: ${responseText.substring(0, 200)}`
                )
              }
              // If response is ok but not JSON, we'll just continue (files might have uploaded)
            }
          } catch (parseError) {
            const errorMessage = parseError instanceof Error ? parseError.message : String(parseError)
            console.error("[Campaign] Error processing upload response:", errorMessage)
            
            if (!uploadResponse.ok) {
              throw parseError
            }
            // If response is ok, continue anyway
          }
          
          if (!uploadResponse.ok) {
            console.warn("[Campaign] File upload failed, but campaign was created successfully", {
              error: uploadResult.error,
              campaign_id: campaignId,
              status: uploadResponse.status,
            })
            // Don't fail the campaign creation if files fail to upload
            // User can upload files later
          } else {
            console.log("[Campaign] Files uploaded successfully", {
              campaign_id: campaignId,
              uploaded_count: uploadResult.uploaded_count || 0,
              failed_count: uploadResult.failed_count || 0,
              images_uploaded: uploadResult.uploaded_images?.length || 0,
              image_errors: uploadResult.image_errors,
              tech_pack_uploaded: uploadResult.tech_pack_uploaded,
            })
            
            // Log detailed error information if any images failed
            if (uploadResult.image_errors && uploadResult.image_errors.length > 0) {
              console.warn("[Campaign] Some images failed to upload:", uploadResult.image_errors)
              uploadResult.image_errors.forEach((err: any) => {
                console.error(`  Index ${err.index} (${err.type || 'unknown'}): ${err.error}`)
              })
            }
          }
        } catch (uploadError) {
          const uploadErrorMsg = uploadError instanceof Error ? uploadError.message : String(uploadError)
          console.error("[Campaign] File upload error (campaign already created):", {
            error: uploadErrorMsg,
            campaign_id: campaignId,
          })
          // Don't fail the campaign creation if file upload fails
        }
      }
      
      // Move to next step after successful creation (files upload in background)
      setStep(3)
    } catch (error) {
      console.error("Error submitting campaign form:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to create campaign"
      alert(errorMessage)
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
    router.push("/dashboard")
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

              {/* Login Link for Existing Users */}
              <div className="text-center pt-4 border-t">
                <p className="text-neutral-600 mb-3">Already have an account?</p>
                <Link href="/login">
                  <Button variant="outline" className="w-full h-11 font-semibold">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Step 2: Personal Information */}
          {step === 2 && (
            <div className="space-y-8">
              <h1 className="text-3xl font-bold">Tell us about yourself</h1>
              <ProgressBar currentStep={2} />

              <div className="space-y-6">
                {/* Show registration form only if user is not logged in */}
                {!user && (
                  <>
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
                  </>
                )}

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
