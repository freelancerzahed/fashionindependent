"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Upload, X, HelpCircle } from "lucide-react"
import type { ProductImage, ProductSize } from "@/lib/types/campaign"

interface CampaignLaunchFormProps {
  onSubmit: (formData: CampaignFormData) => Promise<void>
  onPublish?: (formData: CampaignFormData) => Promise<void>
  isLoading?: boolean
  onBack?: () => void
  initialData?: Partial<CampaignFormData>
}

export interface MaterialItem {
  name: string
  percentage: string
}

export interface CampaignFormData {
  productName: string
  productDescription: string
  productType: "product" | "collection"
  materials: MaterialItem[]
  colors: string[]
  sizes: ProductSize[]
  productImages: ProductImage[]
  projectDuration: number
  upvoteGoal: number
  fundingGoal: number
  salePrice: number
  questionnaire: {
    previousSalesChannels: string[]
    existingInventory: string | null
    manufacturerRestockTime: string | null
    manufacturingAssistance: string[]
    businessRegistration: string | null
  }
}

export function CampaignLaunchForm({ onSubmit, onPublish, isLoading = false, onBack, initialData }: CampaignLaunchFormProps) {
  const PRODUCT_NAME_LIMIT = 30
  const PRODUCT_TYPE_OPTIONS = [
    { value: "product", label: "Product" },
    { value: "collection", label: "Collection" },
  ] as const
  const MATERIAL_OPTIONS = [
    "Cotton",
    "Polyester",
    "Linen",
    "Silk",
    "Wool",
    "Nylon",
    "Denim",
    "Leather",
    "Velvet",
    "Other",
  ]

  // Standard sizes with their classifications
  const STANDARD_SIZES = [
    { classification: "US 0 - 2 (Extra Small)", sizeKey: "xs" },
    { classification: "US 4 - 6 (Small)", sizeKey: "s" },
    { classification: "US 8 - 10 (Medium)", sizeKey: "m" },
    { classification: "US 12 (Large)", sizeKey: "l" },
  ]

  const defaultFormData: CampaignFormData = {
    productName: "",
    productDescription: "",
    productType: "product",
    materials: [{ name: "", percentage: "" }],
    colors: [""],
    sizes: STANDARD_SIZES.map(size => ({
      classification: size.classification,
      measurement: "",
      sizeKey: size.sizeKey,
    })),
    productImages: [],
    projectDuration: 14,
    upvoteGoal: 5000,
    fundingGoal: 5000,
    salePrice: 0,
    questionnaire: {
      previousSalesChannels: [],
      existingInventory: null,
      manufacturerRestockTime: null,
      manufacturingAssistance: [],
      businessRegistration: null,
    },
  }

  const [formData, setFormData] = useState<CampaignFormData>(
    initialData ? { ...defaultFormData, ...initialData } : defaultFormData
  )

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [imagePreview, setImagePreview] = useState<{ [key: string]: string }>({})
  const [showVoteGoalInfo, setShowVoteGoalInfo] = useState(false)

  // Initialize image previews when initialData changes
  useEffect(() => {
    if (initialData?.productImages) {
      const previews: { [key: string]: string } = {}
      initialData.productImages.forEach((img) => {
        if (img.preview) {
          previews[img.id] = img.preview
        }
      })
      setImagePreview(previews)
    }
  }, [initialData?.productImages])

  const handleTextInputChange = (field: "productName" | "productDescription", value: string) => {
    const nextValue = field === "productName" ? value.slice(0, PRODUCT_NAME_LIMIT) : value

    setFormData((prev) => ({
      ...prev,
      [field]: nextValue,
    }))
  }

  const handleNumericInputChange = (
    field: "projectDuration" | "upvoteGoal" | "fundingGoal" | "salePrice",
    value: string
  ) => {
    const parsed = Number(value)

    setFormData((prev) => ({
      ...prev,
      [field]: Number.isFinite(parsed) ? parsed : 0,
    }))
  }

  const handleArrayInputChange = (field: "materials" | "colors", index: number, value: string) => {
    if (field === "materials") {
      // This shouldn't be called for materials anymore, but keep for colors
      return
    }
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  const handleMaterialChange = (index: number, field: "name" | "percentage", value: string) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.map((material, i) =>
        i === index ? { ...material, [field]: value } : material
      ),
    }))
  }

  const handleAddMaterial = () => {
    setFormData((prev) => ({
      ...prev,
      materials: [...prev.materials, { name: "", percentage: "" }],
    }))
  }

  const handleRemoveMaterial = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index),
    }))
  }

  const handleAddArrayItem = (field: "colors") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const handleRemoveArrayItem = (field: "colors", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const handleSizeChange = (index: number, field: "classification" | "measurement", value: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.map((size, i) => (i === index ? { ...size, [field]: value } : size)),
    }))
  }

  const handleAddSize = () => {
    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { classification: "", measurement: "" }],
    }))
  }

  const handleRemoveSize = (index: number) => {
    // Don't allow removing the first 4 required sizes
    if (index < 4) return
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "front" | "back" | "additional") => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      // Check max 10 limit for additional images
      if (type === "additional") {
        const currentAdditionalCount = formData.productImages.filter((img) => img.type === "additional").length
        if (currentAdditionalCount >= 10) {
          setErrors((prev) => ({
            ...prev,
            imageUpload: "Maximum 10 additional images allowed",
          }))
          return
        }
      }

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
        
        // Validate image dimensions
        const img = new Image()
        img.onload = () => {
          if (img.width < 1000 || img.height < 1000) {
            setErrors((prev) => ({
              ...prev,
              imageUpload: `Image must be at least 1000x1000px. Your image is ${img.width}x${img.height}px`,
            }))
            return
          }

          const newImage: ProductImage = {
            id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            file: file,
            preview: previewUrl,
            type,
            width: img.width,
            height: img.height,
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
        img.onerror = () => {
          setErrors((prev) => ({
            ...prev,
            imageUpload: "Failed to load image. Please try another file.",
          }))
        }
        img.src = previewUrl
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

  const handleQuestionnaireMultiSelect = (
    field: "previousSalesChannels" | "manufacturingAssistance",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      questionnaire: {
        ...prev.questionnaire,
        [field]: prev.questionnaire[field].includes(value)
          ? prev.questionnaire[field].filter((item) => item !== value)
          : [...prev.questionnaire[field], value],
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
    } else if (formData.productName.trim().length < 4) {
      newErrors.productName = "Product name must be at least 4 characters"
    } else if (formData.productName.trim().length > PRODUCT_NAME_LIMIT) {
      newErrors.productName = `Product name cannot exceed ${PRODUCT_NAME_LIMIT} characters`
    }

    if (!formData.productDescription.trim()) {
      newErrors.productDescription = "Product description is required"
    }

    if (formData.productDescription.length < 20) {
      newErrors.productDescription = "Description must be at least 20 characters"
    }

    // Validate images
    const frontImage = formData.productImages.find((img) => img.type === "front")
    const backImage = formData.productImages.find((img) => img.type === "back")
    
    if (!frontImage) {
      newErrors.frontImage = "Front image is required"
    }
    if (!backImage) {
      newErrors.backImage = "Back image is required"
    }

    // Validate materials
    const nonEmptyMaterials = formData.materials.filter((m) => m.name.trim())
    if (nonEmptyMaterials.length === 0) {
      newErrors.materials = "At least one material is required"
    } else {
      for (let i = 0; i < formData.materials.length; i++) {
        if (formData.materials[i].name.trim() && !formData.materials[i].percentage.trim()) {
          newErrors[`materialPercentage-${i}`] = "Percentage is required"
        }
        if (formData.materials[i].percentage.trim()) {
          const percentage = parseFloat(formData.materials[i].percentage)
          if (isNaN(percentage) || percentage < 0 || percentage > 100) {
            newErrors[`materialPercentage-${i}`] = "Percentage must be a number between 0 and 100"
          }
        }
      }
    }

    const nonEmptyColors = formData.colors.filter((c) => c.trim())
    if (nonEmptyColors.length === 0) {
      newErrors.colors = "At least one color is required"
    }

    // Validate first 4 required sizes
    for (let i = 0; i < 4; i++) {
      if (!formData.sizes[i]) {
        newErrors[`size-${i}`] = "Size is required"
        continue
      }
      if (!formData.sizes[i].measurement.trim()) {
        newErrors[`sizeMeasurement-${i}`] = "Measurement is required"
      } else {
        // Validate measurement format (should contain numbers)
        const hasMeasurement = /\d/.test(formData.sizes[i].measurement)
        if (!hasMeasurement) {
          newErrors[`sizeMeasurement-${i}`] = "Measurement must contain numbers"
        }
      }
    }
    // Validate additional sizes if they exist
    for (let i = 4; i < formData.sizes.length; i++) {
      if (formData.sizes[i].classification.trim() && !formData.sizes[i].measurement.trim()) {
        newErrors[`sizeMeasurement-${i}`] = "Measurement is required"
      } else if (formData.sizes[i].measurement.trim()) {
        const hasMeasurement = /\d/.test(formData.sizes[i].measurement)
        if (!hasMeasurement) {
          newErrors[`sizeMeasurement-${i}`] = "Measurement must contain numbers"
        }
      }
    }

    if (formData.projectDuration < 7 || formData.projectDuration > 30) {
      newErrors.projectDuration = "Project duration must be between 7 and 30 days"
    }

    if (!formData.fundingGoal || formData.fundingGoal <= 0) {
      newErrors.fundingGoal = "Funding goal is required"
    }

    if (formData.salePrice && formData.salePrice <= 0) {
      newErrors.salePrice = "Sale price must be greater than 0"
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
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!onPublish) {
      return
    }

    try {
      await onPublish(formData)
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: error instanceof Error ? error.message : "Failed to publish campaign",
      }))
    }
  }
  const frontImage = formData.productImages.find((img) => img.type === "front")
  const backImage = formData.productImages.find((img) => img.type === "back")
  const additionalImages = formData.productImages.filter((img) => img.type === "additional")
  const productImageHelperText = formData.productType === "collection"
    ? "Upload the main photo for your collection."
    : "Upload the main photo for your product."

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {errors.submit && (
        <Card className="p-4 bg-red-50 border-red-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-red-700">{errors.submit}</p>
        </Card>
      )}

      {/* Your Products */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Your Products</h3>
        <p className="text-sm text-muted-foreground">
          Select whether you are launching a single product or an entire collection.
        </p>

        <div className="space-y-2">
          <Label htmlFor="productType">Product / Collection</Label>
          <Select
            value={formData.productType}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                productType: value as "product" | "collection",
              }))
            }
          >
            <SelectTrigger id="productType" className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {PRODUCT_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

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
            minLength={4}
            maxLength={PRODUCT_NAME_LIMIT}
          />
          <p className="text-xs text-muted-foreground">
            {formData.productName.length}/{PRODUCT_NAME_LIMIT} characters
          </p>
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
          <div key={index} className="flex gap-3 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor={`material-name-${index}`}>Material {index + 1}</Label>
              <Select
                value={material.name || undefined}
                onValueChange={(value) => handleMaterialChange(index, "name", value)}
              >
                <SelectTrigger
                  id={`material-name-${index}`}
                  className={errors[`materialName-${index}`] || (errors.materials && !material.name.trim()) ? "border-red-500 w-full" : "w-full"}
                >
                  <SelectValue placeholder="Select a material" />
                </SelectTrigger>
                <SelectContent>
                  {MATERIAL_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors[`materialName-${index}`] && (
                <p className="text-sm text-red-600">{errors[`materialName-${index}`]}</p>
              )}
            </div>
            <div className="w-32 space-y-2">
              <Label htmlFor={`material-percentage-${index}`}>Percentage</Label>
              <div className="relative">
                <Input
                  id={`material-percentage-${index}`}
                  type="number"
                  placeholder="e.g., 100"
                  min="0"
                  max="100"
                  step="0.1"
                  value={material.percentage}
                  onChange={(e) => handleMaterialChange(index, "percentage", e.target.value)}
                  className={`${errors[`materialPercentage-${index}`] ? "border-red-500" : ""} pr-6`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">%</span>
              </div>
              {errors[`materialPercentage-${index}`] && (
                <p className="text-sm text-red-600">{errors[`materialPercentage-${index}`]}</p>
              )}
            </div>
            {formData.materials.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveMaterial(index)}
                className="mb-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        {errors.materials && <p className="text-sm text-red-600 font-semibold">{errors.materials}</p>}
        <Button type="button" variant="outline" size="sm" onClick={() => handleAddMaterial()}>
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
                className={errors.colors ? "border-red-500" : ""}
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
          Designers must offer sizing equivalent to US 0–12 (XS–L), roughly 80–97 cm bust, 62–79 cm waist, and 86–104 cm hips. Though not required, plus size are strongly encouraged.
        </p>

        {formData.sizes.map((size, index) => (
          <div key={index} className="space-y-1">
            <div className="flex gap-3 items-start">
              <div className="flex-1 space-y-1">
                <Label htmlFor={`size-classification-${index}`} className="text-sm">
                  {index < 4 ? `Size ${index + 1}` : `Size ${index + 1} (Optional)`}
                </Label>
                <Input
                  id={`size-classification-${index}`}
                  placeholder={index < 4 ? "" : "e.g., US XL, Oversized"}
                  value={size.classification}
                  onChange={(e) => handleSizeChange(index, "classification", e.target.value)}
                  disabled={index < 4}
                  className={`${errors[`size-${index}`] ? "border-red-500" : ""} ${index < 4 ? "bg-muted cursor-not-allowed" : ""}`}
                />
                {errors[`size-${index}`] && (
                  <p className="text-xs text-red-600">{errors[`size-${index}`]}</p>
                )}
              </div>
              <div className="w-48 space-y-1">
                <Label htmlFor={`size-measurement-${index}`} className="text-sm">
                  Measurement (in,cm)
                </Label>
                <Input
                  id={`size-measurement-${index}`}
                  placeholder="e.g., 34 - 38cm"
                  value={size.measurement}
                  onChange={(e) => handleSizeChange(index, "measurement", e.target.value)}
                  className={errors[`sizeMeasurement-${index}`] ? "border-red-500" : ""}
                />
                {errors[`sizeMeasurement-${index}`] && (
                  <p className="text-xs text-red-600">{errors[`sizeMeasurement-${index}`]}</p>
                )}
              </div>
              {index >= 4 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveSize(index)}
                  className="mt-5"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
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
          {productImageHelperText}
        </p>

        {/* Front Image */}
        <div className="space-y-2">
          <Label>Front Image *</Label>
          {!frontImage ? (
            <label className={`border-2 border-dashed rounded-lg p-8 cursor-pointer hover:bg-muted/50 transition flex flex-col items-center justify-center gap-2 ${
              errors.frontImage ? "border-red-500 bg-red-50" : ""
            }`}>
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
          {errors.frontImage && <p className="text-sm text-red-600">{errors.frontImage}</p>}
        </div>

        {/* Back Image */}
        <div className="space-y-2">
          <Label>Back Image *</Label>
          {!backImage ? (
            <label className={`border-2 border-dashed rounded-lg p-8 cursor-pointer hover:bg-muted/50 transition flex flex-col items-center justify-center gap-2 ${
              errors.backImage ? "border-red-500 bg-red-50" : ""
            }`}>
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
          {errors.backImage && <p className="text-sm text-red-600">{errors.backImage}</p>}
        </div>

        {/* Additional Images */}
        <div className="space-y-2">
          <Label>Additional Images (Optional, max 10) - {additionalImages.length}/10</Label>
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
            {additionalImages.length < 10 && (
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
            )}
          </div>
          {additionalImages.length >= 10 && (
            <p className="text-sm text-amber-600">Maximum 10 additional images reached</p>
          )}
        </div>

        {errors.productImages && <p className="text-sm text-red-600">{errors.productImages}</p>}
        {errors.imageUpload && <p className="text-sm text-red-600">{errors.imageUpload}</p>}
      </Card>

      {/* Funding and Sale Price */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Funding & Limited Drop Price</h3>
        <p className="text-sm text-muted-foreground">
          Your funding goal is the amount needed to make the product. The sale price is what customers will pay after the campaign succeeds and the product becomes a limited drop.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fundingGoal">Funding Goal ($)</Label>
            <Input
              id="fundingGoal"
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 5000"
              value={formData.fundingGoal || ""}
              onChange={(e) => handleNumericInputChange("fundingGoal", e.target.value)}
              className={errors.fundingGoal ? "border-red-500" : ""}
            />
            {errors.fundingGoal && <p className="text-sm text-red-600">{errors.fundingGoal}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="salePrice">Limited Drop Sale Price ($)</Label>
            <Input
              id="salePrice"
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 89"
              value={formData.salePrice || ""}
              onChange={(e) => handleNumericInputChange("salePrice", e.target.value)}
              className={errors.salePrice ? "border-red-500" : ""}
            />
            {errors.salePrice && <p className="text-sm text-red-600">{errors.salePrice}</p>}
          </div>
        </div>
      </Card>

      {/* Vote Goal */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Vote Goal</h3>
          <button
            type="button"
            onClick={() => setShowVoteGoalInfo(!showVoteGoalInfo)}
            className="text-muted-foreground hover:text-foreground transition"
            title="Vote goal information"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        {showVoteGoalInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
            <p>Set your campaign's upvote goal. This is the target number of upvotes you'd like to reach. Currently, only 5,000 upvotes is available.</p>
          </div>
        )}

        <p className="text-sm font-semibold text-muted-foreground">How many upvotes would you like to reach?</p>
        <div className="space-y-3">
          {[
            { value: 5000, label: "5,000" },
            { value: 10000, label: "10,000" },
            { value: 20000, label: "20,000" },
            { value: 25000, label: "25,000" },
          ].map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg border transition ${
                formData.upvoteGoal === option.value
                  ? "border-neutral-900 bg-neutral-50"
                  : option.value === 5000
                  ? "border-neutral-200 hover:bg-neutral-50"
                  : "border-neutral-200 bg-neutral-50 cursor-not-allowed opacity-50"
              }`}
            >
              <input
                type="radio"
                name="upvoteGoal"
                value={option.value}
                checked={formData.upvoteGoal === option.value}
                onChange={(e) => setFormData((prev) => ({ ...prev, upvoteGoal: parseInt(e.target.value) }))}
                disabled={option.value !== 5000}
                className="w-4 h-4"
              />
              <span className={option.value !== 5000 ? "text-muted-foreground" : ""}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
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
            max="20"
            value={formData.projectDuration}
            onChange={(e) => handleNumericInputChange("projectDuration", e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>7 days (minimum)</span>
            <span>20 days (maximum)</span>
          </div>
        </div>
        {errors.projectDuration && <p className="text-sm text-red-600">{errors.projectDuration}</p>}
      </Card>

      {/* Questionnaire */}
      <Card className="p-6 space-y-8">
        <div>
          <h3 className="text-lg font-semibold">Business Readiness Questionnaire</h3>
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

      {/* Submit Button */}
      <div className="flex flex-col gap-4 md:flex-row">
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack} disabled={isLoading} className="flex-1 h-12">
            Back
          </Button>
        )}
        <Button type="submit" disabled={isLoading} className="flex-1 h-12">
          {isLoading ? "Saving..." : "Submit"}
        </Button>
        {onPublish && (
          <Button
            type="button"
            onClick={handlePublish}
            disabled={isLoading}
            className="flex-1 h-12 bg-green-600 hover:bg-green-700"
          >
            {isLoading ? "Publishing..." : "Publish Campaign"}
          </Button>
        )}
      </div>
    </form>
  )
}
