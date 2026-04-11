"use client"

import type { ReactElement } from "react"
import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { CampaignLaunchForm, type CampaignFormData } from "@/components/campaign-launch-form"
import { BACKEND_URL } from "@/config"

export default function EditCampaignPage({ params }: { params: Promise<{ id: string }> }): ReactElement {
  const { user, token } = useAuth()
  const router = useRouter()
  const [resolvedId, setResolvedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [campaignData, setCampaignData] = useState<Partial<CampaignFormData> | null>(null)

  React.useEffect(() => {
    Promise.resolve(params).then((p) => setResolvedId(p.id))
  }, [params])

  // Fetch campaign data when ID is resolved
  React.useEffect(() => {
    if (!resolvedId) return

    const fetchCampaign = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/campaign/${resolvedId}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
        if (response.ok) {
          const data = await response.json()
          const campaign = data.campaign

          // Transform backend data to match CampaignFormData structure
          const formData: Partial<CampaignFormData> = {
            productName: campaign.product_name || campaign.title || "",
            productDescription: campaign.product_description || campaign.description || "",
            materials: campaign.materials && Array.isArray(campaign.materials) 
              ? campaign.materials.map((m: any) => ({
                  name: m.name || "",
                  percentage: m.percentage ? String(m.percentage) : "",
                }))
              : [{ name: "", percentage: "" }],
            colors: campaign.colors && Array.isArray(campaign.colors) 
              ? campaign.colors.filter((c: any) => c)
              : [""],
            sizes: campaign.sizes && Array.isArray(campaign.sizes)
              ? campaign.sizes.map((s: any) => ({
                  classification: s.classification || "",
                  measurement: s.measurement || "",
                  sizeKey: s.sizeKey || "",
                }))
              : [],
            productImages: campaign.product_images && Array.isArray(campaign.product_images)
              ? campaign.product_images.map((img: any) => {
                  // Construct proper image URL
                  let imageUrl = ""
                  if (img.path) {
                    // Path is stored as "campaigns/products/..."
                    // Need to construct: http://localhost/mirrormefashion/storage/campaigns/products/...
                    const baseUrl = BACKEND_URL.replace('/api/v2', '')
                    imageUrl = `${baseUrl}/storage/${img.path}`
                  }
                  return {
                    id: img.id || `img_${Date.now()}_${Math.random()}`,
                    type: img.type || "additional",
                    preview: imageUrl,
                    url: imageUrl,
                    width: img.width,
                    height: img.height,
                    uploadedAt: img.uploadedAt,
                  }
                })
              : [],
            projectDuration: campaign.days_active || 14,
            upvoteGoal: campaign.upvote_goal || 5000,
            questionnaire: {
              previousSalesChannels: campaign.previous_sales && Array.isArray(campaign.previous_sales)
                ? campaign.previous_sales
                : [],
              existingInventory: campaign.existing_inventory && Array.isArray(campaign.existing_inventory)
                ? campaign.existing_inventory[0]
                : null,
              manufacturerRestockTime: campaign.manufacturer_restock && Array.isArray(campaign.manufacturer_restock)
                ? campaign.manufacturer_restock[0]
                : null,
              manufacturingAssistance: campaign.manufacturing_assistance && Array.isArray(campaign.manufacturing_assistance)
                ? campaign.manufacturing_assistance
                : [],
              businessRegistration: campaign.business_registration && Array.isArray(campaign.business_registration)
                ? campaign.business_registration[0]
                : null,
            },
          }

          setCampaignData(formData)
        }
      } catch (error) {
        console.error("Error fetching campaign:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaign()
  }, [resolvedId, token])

  const handleSubmit = async (formData: CampaignFormData) => {
    if (!resolvedId) return

    setIsSubmitting(true)
    try {
      const payload = {
        title: formData.productName,
        description: formData.productDescription,
        product_name: formData.productName,
        product_description: formData.productDescription,
        materials: formData.materials
          .filter(m => m.name.trim() && m.percentage.trim())
          .map(m => ({
            name: m.name.trim(),
            percentage: parseFloat(m.percentage.trim())
          })),
        colors: formData.colors.filter(c => c.trim()),
        sizes: formData.sizes
          .filter(s => s.measurement.trim())
          .map(s => ({
            classification: s.classification || "",
            measurement: s.measurement.trim(),
            sizeKey: s.sizeKey
          })),
        projectDuration: formData.projectDuration,
        upvote_goal: formData.upvoteGoal,
        previous_sales: Array.isArray(formData.questionnaire.previousSalesChannels) ? formData.questionnaire.previousSalesChannels : [],
        existing_inventory: formData.questionnaire.existingInventory ? [formData.questionnaire.existingInventory] : [],
        manufacturer_restock: formData.questionnaire.manufacturerRestockTime ? [formData.questionnaire.manufacturerRestockTime] : [],
        manufacturing_assistance: Array.isArray(formData.questionnaire.manufacturingAssistance) ? formData.questionnaire.manufacturingAssistance : [],
        business_registration: formData.questionnaire.businessRegistration ? [formData.questionnaire.businessRegistration] : [],
      }

      const response = await fetch(`${BACKEND_URL}/campaign/${resolvedId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        router.push(`/dashboard/campaigns`)
      } else {
        const errorData = await response.json()
        console.error("Update failed:", errorData)
      }
    } catch (error) {
      console.error("Error updating campaign:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePublish = async (formData: CampaignFormData) => {
    if (!resolvedId) return

    setIsSubmitting(true)
    try {
      const payload = {
        title: formData.productName,
        description: formData.productDescription,
        product_name: formData.productName,
        product_description: formData.productDescription,
        materials: formData.materials
          .filter(m => m.name.trim() && m.percentage.trim())
          .map(m => ({
            name: m.name.trim(),
            percentage: parseFloat(m.percentage.trim())
          })),
        colors: formData.colors.filter(c => c.trim()),
        sizes: formData.sizes
          .filter(s => s.measurement.trim())
          .map(s => ({
            classification: s.classification || "",
            measurement: s.measurement.trim(),
            sizeKey: s.sizeKey
          })),
        projectDuration: formData.projectDuration,
        upvote_goal: formData.upvoteGoal,
        previous_sales: Array.isArray(formData.questionnaire.previousSalesChannels) ? formData.questionnaire.previousSalesChannels : [],
        existing_inventory: formData.questionnaire.existingInventory ? [formData.questionnaire.existingInventory] : [],
        manufacturer_restock: formData.questionnaire.manufacturerRestockTime ? [formData.questionnaire.manufacturerRestockTime] : [],
        manufacturing_assistance: Array.isArray(formData.questionnaire.manufacturingAssistance) ? formData.questionnaire.manufacturingAssistance : [],
        business_registration: formData.questionnaire.businessRegistration ? [formData.questionnaire.businessRegistration] : [],
        status: "live",
      }

      const response = await fetch(`${BACKEND_URL}/campaign/${resolvedId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        router.push(`/dashboard/campaigns`)
      } else {
        const errorData = await response.json()
        console.error("Publish failed:", errorData)
      }
    } catch (error) {
      console.error("Error publishing campaign:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading campaign...</p>
      </div>
    )
  }

  return (
    <main className="flex-1 bg-neutral-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Edit Campaign</h1>
        {loading ? (
          <p className="text-center text-gray-500">Loading campaign...</p>
        ) : campaignData ? (
          <CampaignLaunchForm 
            onSubmit={handleSubmit}
            onPublish={handlePublish}
            isLoading={isSubmitting}
            onBack={() => router.back()}
            initialData={campaignData}
          />
        ) : (
          <p className="text-center text-gray-500">Campaign not found</p>
        )}
      </div>
    </main>
  )
}
