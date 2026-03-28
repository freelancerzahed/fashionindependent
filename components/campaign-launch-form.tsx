"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { AlertCircle, Upload, X } from "lucide-react"
import type { ProductImage, ProductSize } from "@/lib/types/campaign"

interface CampaignLaunchFormProps {
  onSubmit: (formData: CampaignFormData) => Promise<void>
  isLoading?: boolean
  onBack?: () => void
}

export interface CampaignFormData {
  productName: string
  productDescription: string
  materials: string[]
  colors: string[]
  sizes: ProductSize[]
  productImages: ProductImage[]
  techPackFile: File | null
  projectDuration: number
  questionnaire: {
    previousSalesChannels: string[]
    existingInventory: string | null
    manufacturerRestockTime: string | null
    manufacturingAssistance: string[]
    businessRegistration: string | null
  }
}

export function CampaignLaunchForm({ onSubmit, isLoading = false, onBack }: CampaignLaunchFormProps) {
  const [formData, setFormData] = useState<CampaignFormData>({
    productName: "",
    productDescription: "",
    materials: [""],
    colors: [""],
    sizes: [{ size: "" }],
    productImages: [],
    techPackFile: null,
    projectDuration: 7,
    questionnaire: {
      previousSalesChannels: [],
      existingInventory: null,
      manufacturerRestockTime: null,
      manufacturingAssistance: [],
      businessRegistration: null,
    },
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [imagePreview, setImagePreview] = useState<{ [key: string]: string }>({})

  const handleTextInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleArrayInputChange = (field: "materials" | "colors", index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  const handleAddArrayItem = (field: "materials" | "colors") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const handleRemoveArrayItem = (field: "materials" | "colors", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const handleSizeChange = (index: number, field: "size" | "measurements", value: any) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.map((size, i) => (i === index ? { ...size, [field]: value } : size)),
    }))
  }

  const handleAddSize = () => {
    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { size: "" }],
    }))
  }

  const handleRemoveSize = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "front" | "back" | "additional") => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          imageUpload: "Only image files are allowed",
        }))
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const previewUrl = reader.result as string
        const newImage: ProductImage = {
          id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          file: file, // Store the actual file object
          preview: previewUrl, // Store preview for display
          type,
          uploadedAt: new Date().toISOString(),
        }

        setFormData((prev) => ({
          ...prev,
          productImages: [...prev.productImages, newImage],
        }))

        setImagePreview((prev) => ({
          ...prev,
          [newImage.id]: previewUrl,
        }))

        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.imageUpload
          return newErrors
        })
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemoveImage = (imageId: string) => {
    setFormData((prev) => ({
      ...prev,
      productImages: prev.productImages.filter((img) => img.id !== imageId),
    }))

    setImagePreview((prev) => {
      const newPreview = { ...prev }
      delete newPreview[imageId]
      return newPreview
    })
  }

  const handleTechPackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      setErrors((prev) => ({
        ...prev,
        techPack: "Only PDF files are allowed for tech pack",
      }))
      return
    }

    setFormData((prev) => ({
      ...prev,
      techPackFile: file,
    }))

    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors.techPack
      return newErrors
    })
  }

  const handleQuestionnaireMultiSelect = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      questionnaire: {
        ...prev.questionnaire,
        [field]: prev.questionnaire[field as keyof typeof prev.questionnaire].includes(value)
          ? (prev.questionnaire[field as keyof typeof prev.questionnaire] as string[]).filter(
              (item) => item !== value
            )
          : [...(prev.questionnaire[field as keyof typeof prev.questionnaire] as string[]), value],
      },
    }))
  }

  const handleQuestionnaireSingleSelect = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      questionnaire: {
        ...prev.questionnaire,
        [field]: prev.questionnaire[field as keyof typeof prev.questionnaire] === value ? null : value,
      },
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.productName.trim()) {
      newErrors.productName = "Product name is required"
    }

    if (!formData.productDescription.trim()) {
      newErrors.productDescription = "Product description is required"
    }

    if (formData.productDescription.length < 20) {
      newErrors.productDescription = "Description must be at least 20 characters"
    }

    const nonEmptyMaterials = formData.materials.filter((m) => m.trim())
    if (nonEmptyMaterials.length === 0) {
      newErrors.materials = "At least one material is required"
    }

    const nonEmptyColors = formData.colors.filter((c) => c.trim())
    if (nonEmptyColors.length === 0) {
      newErrors.colors = "At least one color is required"
    }

    const nonEmptySizes = formData.sizes.filter((s) => s.size.trim())
    if (nonEmptySizes.length === 0) {
      newErrors.sizes = "At least one size is required"
    }

    // NOTE: File uploads (images and tech pack) are now optional
    // They can be added after campaign creation via a separate file upload API
    // const frontImage = formData.productImages.find((img) => img.type === "front")
    // const backImage = formData.productImages.find((img) => img.type === "back")
    //
    // if (!frontImage || !backImage) {
    //   newErrors.productImages = "Both front and back images are required"
    // }
    //
    // if (!formData.techPackFile) {
    //   newErrors.techPack = "Tech pack PDF is required"
    // }

    if (formData.projectDuration < 7 || formData.projectDuration > 30) {
      newErrors.projectDuration = "Project duration must be between 7 and 30 days"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: error instanceof Error ? error.message : "Failed to submit campaign",
      }))
    }
  }

  const frontImage = formData.productImages.find((img) => img.type === "front")
  const backImage = formData.productImages.find((img) => img.type === "back")
  const additionalImages = formData.productImages.filter((img) => img.type === "additional")

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {errors.submit && (
        <Card className="p-4 bg-red-50 border-red-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-red-700">{errors.submit}</p>
        </Card>
      )}

      {/* Product Basic Info */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Product Information</h3>

        <div className="space-y-2">
          <Label htmlFor="productName">Product Name</Label>
          <Input
            id="productName"
            placeholder="e.g., Women's Henley Top"
            value={formData.productName}
            onChange={(e) => handleTextInputChange("productName", e.target.value)}
            className={errors.productName ? "border-red-500" : ""}
          />
          {errors.productName && <p className="text-sm text-red-600">{errors.productName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="productDescription">Product Description</Label>
          <p className="text-sm text-muted-foreground">
            Describe the style, cut, and design. E.g., "Natural fit long sleeve henley women's top with an asymmetrical
            hemline"
          </p>
          <Textarea
            id="productDescription"
            placeholder="Describe the garment style, fit, and details..."
            value={formData.productDescription}
            onChange={(e) => handleTextInputChange("productDescription", e.target.value)}
            rows={4}
            className={errors.productDescription ? "border-red-500" : ""}
          />
          {errors.productDescription && <p className="text-sm text-red-600">{errors.productDescription}</p>}
        </div>
      </Card>

      {/* Materials */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Materials</h3>
        {formData.materials.map((material, index) => (
          <div key={index} className="flex gap-2 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor={`material-${index}`}>Material {index + 1}</Label>
              <Input
                id={`material-${index}`}
                placeholder="e.g., 100% Cotton, 70% Polyester"
                value={material}
                onChange={(e) => handleArrayInputChange("materials", index, e.target.value)}
              />
            </div>
            {formData.materials.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveArrayItem("materials", index)}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        {errors.materials && <p className="text-sm text-red-600">{errors.materials}</p>}
        <Button type="button" variant="outline" size="sm" onClick={() => handleAddArrayItem("materials")}>
          Add Material
        </Button>
      </Card>

      {/* Colors */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Available Colors</h3>
        {formData.colors.map((color, index) => (
          <div key={index} className="flex gap-2 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor={`color-${index}`}>Color {index + 1}</Label>
              <Input
                id={`color-${index}`}
                placeholder="e.g., Black, Navy Blue, Red"
                value={color}
                onChange={(e) => handleArrayInputChange("colors", index, e.target.value)}
              />
            </div>
            {formData.colors.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveArrayItem("colors", index)}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        {errors.colors && <p className="text-sm text-red-600">{errors.colors}</p>}
        <Button type="button" variant="outline" size="sm" onClick={() => handleAddArrayItem("colors")}>
          Add Color
        </Button>
      </Card>

      {/* Sizes */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Available Sizes</h3>
        <p className="text-sm text-muted-foreground">
          Reference size charts at{" "}
          <a href="https://www.aeropostale.com/size-charts/size-charts.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Aeropostale Size Charts
          </a>
        </p>
        {formData.sizes.map((size, index) => (
          <div key={index} className="flex gap-2 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor={`size-${index}`}>Size {index + 1}</Label>
              <Input
                id={`size-${index}`}
                placeholder="e.g., XS, S, M, L, XL, XXL"
                value={size.size}
                onChange={(e) => handleSizeChange(index, "size", e.target.value)}
              />
            </div>
            {formData.sizes.length > 1 && (
              <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveSize(index)}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        {errors.sizes && <p className="text-sm text-red-600">{errors.sizes}</p>}
        <Button type="button" variant="outline" size="sm" onClick={() => handleAddSize()}>
          Add Size
        </Button>
      </Card>

      {/* Images */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Product Images</h3>
        <p className="text-sm text-muted-foreground">
          Front and back images are required. Minimum size: 1200x1200px. You can add more images later.
        </p>

        {/* Front Image */}
        <div className="space-y-2">
          <Label>Front Image *</Label>
          {!frontImage ? (
            <label className="border-2 border-dashed rounded-lg p-8 cursor-pointer hover:bg-muted/50 transition flex flex-col items-center justify-center gap-2">
              <Upload className="w-6 h-6 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Click to upload front image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "front")}
                hidden
              />
            </label>
          ) : (
            <div className="relative w-full h-64 rounded-lg overflow-hidden bg-muted">
              <img src={imagePreview[frontImage.id]} alt="Front" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveImage(frontImage.id)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Back Image */}
        <div className="space-y-2">
          <Label>Back Image *</Label>
          {!backImage ? (
            <label className="border-2 border-dashed rounded-lg p-8 cursor-pointer hover:bg-muted/50 transition flex flex-col items-center justify-center gap-2">
              <Upload className="w-6 h-6 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Click to upload back image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "back")}
                hidden
              />
            </label>
          ) : (
            <div className="relative w-full h-64 rounded-lg overflow-hidden bg-muted">
              <img src={imagePreview[backImage.id]} alt="Back" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveImage(backImage.id)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Additional Images */}
        <div className="space-y-2">
          <Label>Additional Images (Optional)</Label>
          <div className="grid grid-cols-2 gap-4">
            {additionalImages.map((image) => (
              <div key={image.id} className="relative h-40 rounded-lg overflow-hidden bg-muted">
                <img src={imagePreview[image.id]} alt="Additional" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(image.id)}
                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <label className="border-2 border-dashed rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition flex flex-col items-center justify-center gap-2">
              <Upload className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Add more</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e, "additional")}
                hidden
              />
            </label>
          </div>
        </div>

        {errors.productImages && <p className="text-sm text-red-600">{errors.productImages}</p>}
        {errors.imageUpload && <p className="text-sm text-red-600">{errors.imageUpload}</p>}
      </Card>

      {/* Questionnaire */}
      <Card className="p-6 space-y-8">
        <div>
          <h3 className="text-lg font-semibold">Questionnaire</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Help us understand your business needs to provide better support
          </p>
        </div>

        {/* Question 1: Previous Sales Channels */}
        <div className="border-t pt-6 space-y-4">
          <p className="font-bold text-neutral-900">
            I have previously sold this product to customers (check all that apply)
          </p>
          <div className="space-y-3 ml-2">
            {["own_website", "third_party_website", "physical_store", "other"].map((channel) => {
              const labels: Record<string, string> = {
                own_website: "On a website I own",
                third_party_website: "On a third-party website",
                physical_store: "In a physical store",
                other: "Other",
              }
              return (
                <div key={channel} className="flex items-center space-x-3">
                  <Checkbox
                    id={`sales-channel-${channel}`}
                    checked={formData.questionnaire.previousSalesChannels.includes(channel)}
                    onCheckedChange={() => handleQuestionnaireMultiSelect("previousSalesChannels", channel)}
                  />
                  <Label htmlFor={`sales-channel-${channel}`} className="text-base cursor-pointer">
                    {labels[channel]}
                  </Label>
                </div>
              )
            })}
          </div>
        </div>

        {/* Question 2: Existing Inventory */}
        <div className="border-t pt-6 space-y-4">
          <p className="font-bold text-neutral-900">I have existing inventory</p>
          <div className="space-y-3 ml-2">
            {[
              { id: "inventory_1_50", label: "1 – 50 units" },
              { id: "inventory_50_200", label: "50 – 200 units" },
              { id: "inventory_200_500", label: "200 - 500 units" },
              { id: "inventory_500_plus", label: "500+ units" },
              { id: "no_inventory", label: "I do not have inventory" },
            ].map((option) => (
              <div key={option.id} className="flex items-center space-x-3">
                <Checkbox
                  id={option.id}
                  checked={formData.questionnaire.existingInventory === option.id}
                  onCheckedChange={() => handleQuestionnaireSingleSelect("existingInventory", option.id)}
                />
                <Label htmlFor={option.id} className="text-base cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Question 3: Manufacturer Restock Time - Show only if has inventory */}
        {formData.questionnaire.existingInventory &&
          formData.questionnaire.existingInventory !== "no_inventory" && (
            <div className="border-t pt-6 space-y-4 bg-blue-50 p-4 rounded-lg">
              <p className="font-bold text-neutral-900">
                I have an existing manufacturer who can restock my inventory in
              </p>
              <div className="space-y-3 ml-2">
                {[
                  { id: "restock_10", label: "10 days" },
                  { id: "restock_14", label: "14 days" },
                  { id: "restock_30", label: "30 days" },
                  { id: "restock_60", label: "60 days" },
                  { id: "restock_60_plus", label: "60+ days" },
                ].map((option) => (
                  <div key={option.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={option.id}
                      checked={formData.questionnaire.manufacturerRestockTime === option.id}
                      onCheckedChange={() => handleQuestionnaireSingleSelect("manufacturerRestockTime", option.id)}
                    />
                    <Label htmlFor={option.id} className="text-base cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Question 4: Manufacturing Assistance - Show if no inventory or if inventory selected but no manufacturer confirmed */}
        {(formData.questionnaire.existingInventory === "no_inventory" ||
          (formData.questionnaire.existingInventory &&
            formData.questionnaire.existingInventory !== "no_inventory" &&
            !formData.questionnaire.manufacturerRestockTime)) && (
          <div className="border-t pt-6 space-y-4 bg-amber-50 p-4 rounded-lg">
            <p className="font-bold text-neutral-900">
              I require manufacturing assistance (check all that apply)
            </p>
            <div className="space-y-3 ml-2">
              {[
                { id: "has_tech_pack", label: "I have a factory ready tech pack" },
                { id: "has_manufacturer", label: "I have a manufacturing partner" },
              ].map((option) => (
                <div key={option.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={option.id}
                    checked={formData.questionnaire.manufacturingAssistance.includes(option.id)}
                    onCheckedChange={() => handleQuestionnaireMultiSelect("manufacturingAssistance", option.id)}
                  />
                  <Label htmlFor={option.id} className="text-base cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Question 5: Business Registration */}
        <div className="border-t pt-6 space-y-4">
          <p className="font-bold text-neutral-900">My fashion brand is currently registered as a business</p>
          <div className="space-y-3 ml-2">
            {[
              { id: "business_yes", label: "Yes" },
              { id: "business_no", label: "No" },
              { id: "business_in_progress", label: "In progress" },
            ].map((option) => (
              <div key={option.id} className="flex items-center space-x-3">
                <Checkbox
                  id={option.id}
                  checked={formData.questionnaire.businessRegistration === option.id}
                  onCheckedChange={() => handleQuestionnaireSingleSelect("businessRegistration", option.id)}
                />
                <Label htmlFor={option.id} className="text-base cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </Card>
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Tech Pack</h3>
        <p className="text-sm text-muted-foreground">Upload a PDF file with technical specifications for your product.</p>

        {!formData.techPackFile ? (
          <label className="border-2 border-dashed rounded-lg p-8 cursor-pointer hover:bg-muted/50 transition flex flex-col items-center justify-center gap-2">
            <Upload className="w-6 h-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Click to upload tech pack (PDF)</span>
            <input type="file" accept=".pdf" onChange={handleTechPackUpload} hidden />
          </label>
        ) : (
          <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-red-600">PDF</span>
              </div>
              <div>
                <p className="font-medium">{formData.techPackFile.name}</p>
                <p className="text-sm text-muted-foreground">{(formData.techPackFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  techPackFile: null,
                }))
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {errors.techPack && <p className="text-sm text-red-600">{errors.techPack}</p>}
      </Card>

      {/* Project Duration */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Project Duration</h3>
        <div className="space-y-2">
          <Label htmlFor="duration">Campaign Duration (days): {formData.projectDuration}</Label>
          <input
            id="duration"
            type="range"
            min="7"
            max="30"
            value={formData.projectDuration}
            onChange={(e) => handleTextInputChange("projectDuration", e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>7 days (minimum)</span>
            <span>30 days (maximum)</span>
          </div>
        </div>
        {errors.projectDuration && <p className="text-sm text-red-600">{errors.projectDuration}</p>}
      </Card>

      {/* Submit Button */}
      <div className="grid grid-cols-2 gap-4">
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack} disabled={isLoading} className="h-12">
            Back
          </Button>
        )}
        <Button type="submit" disabled={isLoading} className="flex-1 h-12">
          {isLoading ? "Launching Campaign..." : "Launch Campaign"}
        </Button>
      </div>
    </form>
  )
}
