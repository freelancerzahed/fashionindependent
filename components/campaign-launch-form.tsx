"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
    projectDuration: 30,
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
          url: previewUrl,
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

    const frontImage = formData.productImages.find((img) => img.type === "front")
    const backImage = formData.productImages.find((img) => img.type === "back")

    if (!frontImage || !backImage) {
      newErrors.productImages = "Both front and back images are required"
    }

    if (!formData.techPackFile) {
      newErrors.techPack = "Tech pack PDF is required"
    }

    if (formData.projectDuration < 30 || formData.projectDuration > 60) {
      newErrors.projectDuration = "Project duration must be between 30 and 60 days"
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

      {/* Tech Pack */}
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
            min="30"
            max="60"
            value={formData.projectDuration}
            onChange={(e) => handleTextInputChange("projectDuration", e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>30 days (minimum)</span>
            <span>60 days (maximum)</span>
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
