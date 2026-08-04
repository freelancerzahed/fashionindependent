"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/lib/auth-context"
import { CampaignLaunchForm, type CampaignFormData } from "@/components/campaign-launch-form"

export default function LaunchCampaignPage() {
  const [step, setStep] = useState(1)
  const [productReadiness, setProductReadiness] = useState<"inventory" | "manufacturer" | "tech-pack" | "">("")
  const [isSubmittingCampaign, setIsSubmittingCampaign] = useState(false)
  const [step1Error, setStep1Error] = useState("")
  const [step2Errors, setStep2Errors] = useState<Record<string, string>>({})
  const [step3Error, setStep3Error] = useState("")
  const [submissionError, setSubmissionError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [disclosures, setDisclosures] = useState({
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
              You need to be a registered creative to launch a campaign.
            </p>
            <div className="flex gap-4">
              <Link href="/signup?role=creator" className="flex-1">
                <Button className="w-full bg-neutral-900 text-white hover:bg-neutral-800 h-12 font-semibold text-base">
                  Become a Creative
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
    setStep1Error("")
    if (!productReadiness) {
      setStep1Error("Please select one of the options above to continue")
      return
    }
    setStep(2)
  }

  const handleContinueStep2 = () => {
    setStep2Errors({})
    // User is already logged in, so we can proceed directly
    setStep(3)
  }

  const handleCampaignFormSubmit = async (campaignData: CampaignFormData) => {
    setSubmissionError("")
    setIsSubmittingCampaign(true)
    try {
      const token = localStorage.getItem("auth_token")
      const userData = localStorage.getItem("user")
      if (!token) {
        setSubmissionError("You need to sign in before launching a campaign.")
        router.push("/login")
        return
      }

      let parsedUser = null
      try {
        parsedUser = userData ? JSON.parse(userData) : null
      } catch {
        parsedUser = null
      }

      console.log("[Campaign] Submitting campaign with token:", token.substring(0, 30) + "...")
      console.log("[Campaign] Current user from storage:", parsedUser)

      const normalizedProductName = campaignData.productName.trim().slice(0, 30)
      const payload = {
        title: normalizedProductName,
        description: campaignData.productDescription,
        funding_goal: Number(campaignData.fundingGoal || 5000),
        sale_price: Number(campaignData.salePrice || 0),
        product_name: normalizedProductName,
        product_description: campaignData.productDescription,
        materials: campaignData.materials
          .filter(m => m.name.trim() && m.percentage.trim())
          .map(m => ({
            name: m.name.trim(),
            percentage: parseFloat(m.percentage.trim())
          })),
        colors: campaignData.colors.filter(c => c.trim()),
        sizes: campaignData.sizes
          .filter(s => s.measurement.trim())
          .map(s => ({
            classification: s.classification || "",
            measurement: s.measurement.trim(),
            sizeKey: s.sizeKey
          })),
        projectDuration: campaignData.projectDuration,
        upvote_goal: campaignData.upvoteGoal,
        previous_sales: Array.isArray(campaignData.questionnaire.previousSalesChannels) ? campaignData.questionnaire.previousSalesChannels : [],
        existing_inventory: campaignData.questionnaire.existingInventory ? [campaignData.questionnaire.existingInventory] : [],
        manufacturer_restock: campaignData.questionnaire.manufacturerRestockTime ? [campaignData.questionnaire.manufacturerRestockTime] : [],
        manufacturing_assistance: Array.isArray(campaignData.questionnaire.manufacturingAssistance) ? campaignData.questionnaire.manufacturingAssistance : [],
        business_registration: campaignData.questionnaire.businessRegistration ? [campaignData.questionnaire.businessRegistration] : [],
      }

      console.log("[Campaign] Sending campaign payload:", {
        title: payload.title,
        hasImages: campaignData.productImages.length > 0,
        imageCount: campaignData.productImages.filter(img => img.file).length,
        materialsCount: payload.materials.length,
        colorsCount: payload.colors.length,
        sizesCount: payload.sizes.length,
        projectDuration: payload.projectDuration,
        upvoteGoal: payload.upvote_goal,
        questionnaireFields: {
          previous_sales: payload.previous_sales,
          existing_inventory: payload.existing_inventory,
          manufacturer_restock: payload.manufacturer_restock,
          manufacturing_assistance: payload.manufacturing_assistance,
          business_registration: payload.business_registration,
        },
      })
      console.log("[Campaign] Full payload:", JSON.stringify(payload, null, 2))

      let response;
      try {
        response = await fetch("/api/campaign", {
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
          
          try {
            const errorData = JSON.parse(responseText)
            console.error("[Campaign] Parsed error data:", errorData)

            const rawPayload = errorData.raw && typeof errorData.raw === "object" ? errorData.raw : {}
            const nestedMessage = [
              rawPayload.message,
              rawPayload.error,
              rawPayload.detail,
              rawPayload.title,
            ]
              .filter((value): value is string => typeof value === "string" && value.trim() !== "")
              .join(" - ")

            const backendMessage = nestedMessage || errorData.error || errorData.message || errorData.detail || errorData.title || ""
            const validationErrors = errorData.errors || errorData.validation_errors || rawPayload.errors || rawPayload.validation_errors || null
            const errorDetails = validationErrors
              ? Object.entries(validationErrors as Record<string, unknown>)
                  .map(([field, msgs]) => {
                    const fieldName = String(field).replace(/_/g, " ")
                    const message = Array.isArray(msgs)
                      ? msgs.filter((msg): msg is string => typeof msg === "string" && msg.trim() !== "").join(", ")
                      : typeof msgs === "string" && msgs.trim()
                        ? msgs
                        : JSON.stringify(msgs)
                    return `${fieldName}: ${message}`
                  })
                  .join("\n")
              : ""

            if (response.status === 401) {
              errorMessage = backendMessage || "Unauthenticated. Please sign in again to continue."
              setSubmissionError(errorMessage)
              router.push("/login")
            } else if (response.status === 403) {
              errorMessage = backendMessage || "You need to complete your creative profile to launch campaigns."
            } else if (response.status === 400) {
              errorMessage = backendMessage || "The campaign data is incomplete or invalid."
            } else if (response.status === 422) {
              errorMessage = backendMessage || "Please fill in all required fields correctly."
              if (errorDetails) {
                errorMessage += "\n" + errorDetails
              }
            } else if (response.status === 503) {
              errorMessage = "The backend server is temporarily unavailable. Please try again in a few moments."
            } else if (response.status === 500 || response.status >= 500) {
              errorMessage = backendMessage || "Server error. Please try again later."
            } else {
              errorMessage = backendMessage || errorMessage
            }
          } catch (parseError) {
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

      if (campaignId) {
        const submitResponse = await fetch(`/api/campaign/${campaignId}/submit`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        const submitResult = await submitResponse.json().catch(() => ({}))
        if (!submitResponse.ok) {
          throw new Error(submitResult.message || submitResult.error || "Failed to submit campaign for review")
        }

        console.log("Campaign submitted for review successfully:", submitResult)
      }
      
      // Now upload files if they exist
      if (campaignId && campaignData.productImages.length > 0) {
        console.log("[Campaign] Uploading files for campaign:", campaignId)
        console.log("[Campaign] Images to upload:", campaignData.productImages.length)
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
      setSubmissionError(errorMessage)
    } finally {
      setIsSubmittingCampaign(false)
    }
  }

  const handleSubmit = () => {
    setStep3Error("")
    if (
      !disclosures.collaborationAgreement ||
      !disclosures.termsAndConditions ||
      !disclosures.ageConfirmation
    ) {
      setStep3Error("Please agree to all terms and conditions")
      return
    }

    router.push("/dashboard/campaigns")
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
                The Fashion Independent helps indie fashion designers promote a product or collection. To qualify, designers must be 
                production ready and have a real image or 3D rendering of the product. Hand drawings or 2D flats are not accepted. 
              </p>

              <div className="border-t pt-8 space-y-6">
                <p className="font-bold text-neutral-900">Which of the following applies to your product?</p>

                <RadioGroup value={productReadiness} onValueChange={(value) => setProductReadiness(value as "inventory" | "manufacturer" | "tech-pack")}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="inventory" id="readiness" />
                    <Label htmlFor="readiness" className="text-base cursor-pointer">I have finished inventory ready to ship immediately </Label>
                  </div>

                  <div className="flex items-center space-x-3"> 
                    <RadioGroupItem value="manufacturer" id="inventory" />
                    <Label htmlFor="inventory" className="text-base cursor-pointer">I have a confirmed manufacturer and production timeline</Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="tech-pack" id="techpack" />
                    <Label htmlFor="techpack" className="text-base cursor-pointer">I need help finding a manufacturer or creating a tech pack </Label>
                  </div>
                </RadioGroup>

              </div>

              {step1Error && (
                <div className="border-l-4 border-red-500 bg-red-50 p-4">
                  <p className="text-sm text-red-600">{step1Error}</p>
                </div>
              )}

              {/* Warning/Note Section */}
              <div className="border-l-4 border-red-600 bg-red-50 p-6 space-y-3">
                <div className="flex gap-3">
                  <span className="text-red-600 font-bold text-2xl flex-shrink-0">⚠️</span>
                  <p className="text-neutral-700 text-sm">
                    We verify each designer's credentials and product readiness to prevent fraud. Designers who select the third option will be directed to The Fashion Independent's manufacturing and tech pack services. All costs will be deducted from your campaign earnings. For complete details, see our <Link href="/rules" className="text-blue-600 hover:underline">rules and guidelines</Link>.
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
                {/* Show user info message - user is already logged in */}
                <div className="bg-neutral-50 p-4 rounded-lg text-sm text-neutral-600">
                  <p>✓ Logged in as creator</p>
                </div>

                {/* Campaign Launch Form */}
                <div className="pt-8 space-y-6">
                  <h2 className="text-2xl font-semibold">Campaign Details</h2>
                  {submissionError && (
                    <div className="border-l-4 border-red-500 bg-red-50 p-4">
                      <p className="text-sm text-red-600">{submissionError}</p>
                    </div>
                  )}
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
                    id="collaboration"
                    checked={disclosures.collaborationAgreement}
                    onCheckedChange={(checked) => handleDisclosureChange("collaborationAgreement", checked as boolean)}
                  />
                  <Label htmlFor="collaboration" className="text-base cursor-pointer pt-0.5">
                    I have read and agree to the <a href="/partnership-agreement" className="text-blue-600 no-underline hover:text-yellow-400">
                    Partnership Agreement</a>
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={disclosures.termsAndConditions}
                    onCheckedChange={(checked) => handleDisclosureChange("termsAndConditions", checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-base cursor-pointer pt-0.5">
                    I have read and agree to the <a href="/terms" className="text-blue-600 no-underline hover:text-yellow-400">
                    Terms & Conditions</a> of the site
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

              {step3Error && (
                <div className="border-l-4 border-red-500 bg-red-50 p-4">
                  <p className="text-sm text-red-600">{step3Error}</p>
                </div>
              )}

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
                  Submit
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
