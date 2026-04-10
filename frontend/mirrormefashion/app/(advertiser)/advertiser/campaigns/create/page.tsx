"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

interface CampaignData {
  name: string
  objective: string
  budget: string
  startDate: string
  endDate: string
  targetAudience: string
  adFormat: string
  description: string
  creatives: File[]
}

export default function CreateCampaignPage() {
  const router = useRouter()
  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: "",
    objective: "",
    budget: "",
    startDate: "",
    endDate: "",
    targetAudience: "",
    adFormat: "",
    description: "",
    creatives: [],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof CampaignData, value: string) => {
    setCampaignData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files)
      setCampaignData((prev) => ({
        ...prev,
        creatives: [...prev.creatives, ...newFiles],
      }))
    }
  }

  const removeFile = (index: number) => {
    setCampaignData((prev) => ({
      ...prev,
      creatives: prev.creatives.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    router.push("/advertiser/campaigns")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/advertiser/campaigns">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Campaigns
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Campaign</h1>
          <p className="text-gray-600">Set up your advertising campaign</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Campaign Name *</Label>
                <Input
                  id="name"
                  value={campaignData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter campaign name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="objective">Campaign Objective *</Label>
                <Select value={campaignData.objective} onValueChange={(value) => handleInputChange("objective", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select objective" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brand-awareness">Brand Awareness</SelectItem>
                    <SelectItem value="traffic">Website Traffic</SelectItem>
                    <SelectItem value="conversions">Conversions</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={campaignData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your campaign goals and strategy"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Budget & Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Budget & Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="budget">Total Budget ($) *</Label>
                <Input
                  id="budget"
                  type="number"
                  value={campaignData.budget}
                  onChange={(e) => handleInputChange("budget", e.target.value)}
                  placeholder="5000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={campaignData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={campaignData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Targeting */}
        <Card>
          <CardHeader>
            <CardTitle>Targeting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="targetAudience">Target Audience *</Label>
                <Select
                  value={campaignData.targetAudience}
                  onValueChange={(value) => handleInputChange("targetAudience", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="young-adults">Young Adults (18-25)</SelectItem>
                    <SelectItem value="millennials">Millennials (26-35)</SelectItem>
                    <SelectItem value="gen-x">Gen X (36-50)</SelectItem>
                    <SelectItem value="all-adults">All Adults (18+)</SelectItem>
                    <SelectItem value="custom">Custom Audience</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="adFormat">Ad Format *</Label>
                <Select value={campaignData.adFormat} onValueChange={(value) => handleInputChange("adFormat", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ad format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Image Ads</SelectItem>
                    <SelectItem value="video">Video Ads</SelectItem>
                    <SelectItem value="carousel">Carousel Ads</SelectItem>
                    <SelectItem value="story">Story Ads</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Creative Assets */}
        <Card>
          <CardHeader>
            <CardTitle>Creative Assets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-2">Upload your ad creatives</p>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <Button type="button" variant="outline">
                  Choose Files
                </Button>
              </Label>
            </div>

            {campaignData.creatives.length > 0 && (
              <div className="space-y-2">
                <p className="font-medium">Uploaded Files:</p>
                {campaignData.creatives.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm">{file.name}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Link href="/advertiser/campaigns">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting} className="bg-primary-600 hover:bg-primary-700 text-white">
            {isSubmitting ? "Creating..." : "Create Campaign"}
          </Button>
        </div>
      </form>
    </div>
  )
}
