"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit2, Plus, CheckCircle, Clock, Users, Zap, Target, Flame, X, Save, Upload, FileText, Download, RefreshCw, AlertCircle, Loader } from "lucide-react"

export default function CampaignsPage() {
  const [campaignFilter, setCampaignFilter] = useState("all")
  const [selectedColor, setSelectedColor] = useState("Red")
  const [selectedSize, setSelectedSize] = useState("M")
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [viewingCampaignId, setViewingCampaignId] = useState<string | null>(null)
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null)
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    fundingGoal: 0,
    daysLeft: 0,
    category: "",
    image: "",
    imageBack: "",
    techPackUrl: "",
    sizes: [] as string[],
    colors: [] as string[],
    status: "draft" as "draft" | "live",
  })
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined)
  const [imageBackPreview, setImageBackPreview] = useState<string | undefined>(undefined)
  const [frontImageFile, setFrontImageFile] = useState<File | null>(null)
  const [backImageFile, setBackImageFile] = useState<File | null>(null)
  const [techPackFile, setTechPackFile] = useState<File | null>(null)
  const [expandedSections, setExpandedSections] = useState({
    sizes: false,
    colors: false,
    techPack: false,
  })
  const [surveyResponses, setSurveyResponses] = useState<any>(null)
  const [surveyLoading, setSurveyLoading] = useState(false)
  const router = useRouter()

  // Helper function to get authorization token
  const getAuthToken = () => {
    const token = localStorage.getItem("auth_token")
    return token
  }

  // Fetch campaigns from backend with useCallback
  const fetchCampaigns = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      setError(null)
      const token = getAuthToken()

      if (!token) {
        setError("Not authenticated. Please log in first.")
        setLoading(false)
        return
      }

      const response = await fetch(`/api/campaign`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      })

      if (!response.ok) {
        const contentType = response.headers.get("content-type")
        let errorData = null
        try {
          if (contentType?.includes("application/json")) {
            errorData = await response.json()
          } else {
            errorData = await response.text()
          }
        } catch {
          errorData = "Unable to parse error response"
        }
        
        throw new Error(`API Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.status && data.campaigns) {
        let campaignsList = Array.isArray(data.campaigns.data) ? data.campaigns.data : [data.campaigns]
        
        console.log('Raw campaigns from API:', campaignsList.map((c: any) => ({ id: c.id, title: c.title, status: c.status })))
        
        // Normalize campaign data - ensure sizes and colors are arrays
        campaignsList = campaignsList.map((campaign: any) => {
          const normalizedCampaign = { ...campaign }
          
          // Convert sizes string to array if needed
          if (normalizedCampaign.sizes && typeof normalizedCampaign.sizes === "string") {
            normalizedCampaign.sizes = normalizedCampaign.sizes.split(",").map((s: string) => s.trim()).filter(Boolean)
          } else if (!Array.isArray(normalizedCampaign.sizes)) {
            normalizedCampaign.sizes = []
          }
          
          // Convert colors string to array if needed
          if (normalizedCampaign.colors && typeof normalizedCampaign.colors === "string") {
            normalizedCampaign.colors = normalizedCampaign.colors.split(",").map((c: string) => c.trim()).filter(Boolean)
          } else if (!Array.isArray(normalizedCampaign.colors)) {
            normalizedCampaign.colors = []
          }
          
          // Ensure product_images is an array
          if (!Array.isArray(normalizedCampaign.product_images)) {
            normalizedCampaign.product_images = []
          }
          
          return normalizedCampaign
        })
        
        console.log('Normalized campaigns:', campaignsList.map((c: any) => ({ id: c.id, title: c.title, status: c.status })))
        setCampaigns(campaignsList)
      } else {
        setCampaigns([])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load campaigns - Unknown error"
      setError(errorMessage)
      setCampaigns([])
    } finally {
      setLastUpdated(new Date())
      setLoading(false)
    }
  }, [])

  // Fetch survey responses for active campaign
  const fetchSurveyResponses = useCallback(async (campaignId: string) => {
    try {
      setSurveyLoading(true)
      const response = await fetch(`/api/campaign/${campaignId}/question-statistics`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.status && data.data) {
          setSurveyResponses(data.data)
        }
      }
    } catch (err) {
      console.error("Failed to fetch survey responses:", err)
    } finally {
      setSurveyLoading(false)
    }
  }, [])

  // Initial fetch on mount
  useEffect(() => {
    fetchCampaigns(true)
  }, [fetchCampaigns])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    let isMounted = true
    let refreshTimer: NodeJS.Timeout

    const autoRefresh = () => {
      if (isMounted && !editingCampaignId) {
        fetchCampaigns(false)
      }
    }

    refreshTimer = setInterval(autoRefresh, 30000) // 30 seconds

    return () => {
      isMounted = false
      clearInterval(refreshTimer)
    }
  }, [fetchCampaigns, editingCampaignId])

  // Fetch survey responses when active campaign changes
  useEffect(() => {
    const activeCampaign = campaigns.find((c) => c.status === "live")
    if (activeCampaign && activeCampaign.id) {
      fetchSurveyResponses(activeCampaign.id)
    }
  }, [campaigns, fetchSurveyResponses])

  // Helper function to calculate campaign health
  const calculateCampaignHealth = (funded: number, goal: number, daysLeft: number, backers: number) => {
    const fundingPercentage = (funded / goal) * 100
    let status = "On Track"
    let color = "bg-green-100 text-green-800"

    if (fundingPercentage >= 100) {
      status = "Funded"
      color = "bg-emerald-100 text-emerald-800"
    } else if (fundingPercentage >= 75) {
      status = "On Track"
      color = "bg-green-100 text-green-800"
    } else if (fundingPercentage >= 50) {
      status = "Needs Boost"
      color = "bg-yellow-100 text-yellow-800"
    } else {
      status = "Critical"
      color = "bg-red-100 text-red-800"
    }

    return { status, color, fundingPercentage }
  }

  const getStatusBadgeClasses = (status?: string) => {
    if (status === "live") {
      return "bg-emerald-100 text-emerald-700 border-emerald-200"
    }

    return "bg-slate-100 text-slate-700 border-slate-200"
  }

  const getStatusLabel = (status?: string) => {
    return status === "live" ? "Published" : "Draft"
  }

  // Helper function to filter campaigns
  const filteredCampaigns = campaigns.filter((campaign) => {
    if (campaignFilter === "active") return campaign.status === "live"
    if (campaignFilter === "completed") return campaign.status === "completed"
    if (campaignFilter === "draft") return campaign.status === "draft"
    return true
  })

  // Handle Edit Campaign
  const handleEditCampaign = (campaign: any) => {
    router.push(`/campaign/${campaign.id}/edit`)
  }

  // Handle Image Upload (Front)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFrontImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle Image Upload (Back)
  const handleImageBackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBackImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImageBackPreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle Tech Pack Upload
  const handleTechPackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setTechPackFile(file)
      setEditFormData({ ...editFormData, techPackUrl: file.name })
    }
  }

  // Save Campaign Changes
  const handleSaveCampaign = async (isDraft: boolean = true) => {
    try {
      const token = getAuthToken()
      if (!token) {
        setError("Not authenticated")
        return
      }

      // First, update campaign metadata
      const updateData = {
        title: editFormData.title,
        description: editFormData.description,
        funding_goal: editFormData.fundingGoal,
        product_name: editFormData.title,
        product_description: editFormData.description,
        days_active: editFormData.daysLeft,
        sizes: editFormData.sizes,
        colors: editFormData.colors,
        status: isDraft ? "draft" : "live"
      }

      console.log('Sending update request:', { campaignId: editingCampaignId, isDraft, data: updateData })

const response = await fetch(`/api/campaign/${editingCampaignId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      const responseData = await response.json()
      console.log('Update response:', responseData)

      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || `Failed to update campaign: ${response.status}`)
      }

      console.log('Campaign metadata updated successfully')

      // Upload images if any new ones were selected
      if (frontImageFile || backImageFile || techPackFile) {
        const formData = new FormData()
        
        const imageMetadata: any[] = []
        let fileIndex = 0
        
        // Add front image if selected
        if (frontImageFile) {
          formData.append('product_images[]', frontImageFile)
          imageMetadata.push({
            fileIndex,
            type: 'front',
            name: frontImageFile.name
          })
          fileIndex++
        }
        
        // Add back image if selected
        if (backImageFile) {
          formData.append('product_images[]', backImageFile)
          imageMetadata.push({
            fileIndex,
            type: 'back',
            name: backImageFile.name
          })
          fileIndex++
        }
        
        // Add image metadata
        if (imageMetadata.length > 0) {
          formData.append('image_metadata', JSON.stringify(imageMetadata))
        }
        
        // Add tech pack if selected
        if (techPackFile) {
          formData.append('tech_pack_file', techPackFile)
        }

        console.log('Uploading files:', { hasImages: imageMetadata.length > 0, hasTechPack: !!techPackFile })

        const uploadResponse = await fetch(`/api/campaign/${editingCampaignId}/upload-files`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formData,
        })

        const uploadData = await uploadResponse.json()
        console.log('File upload response:', uploadData)

        if (!uploadResponse.ok) {
          throw new Error(uploadData.message || `Failed to upload files: ${uploadResponse.status}`)
        }
      }

      // Refresh campaigns list
      await fetchCampaigns()

      setEditingCampaignId(null)
      setImagePreview(undefined)
      setImageBackPreview(undefined)
      setFrontImageFile(null)
      setBackImageFile(null)
      setTechPackFile(null)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error("Error saving campaign:", err)
      setError(err instanceof Error ? err.message : "Failed to save campaign")
    }
  }

  // Handle publish/draft status change
  const handleToggleCampaignStatus = async (campaign: any) => {
    const nextStatus = campaign.status === "live" ? "draft" : "live"

    try {
      setStatusUpdatingId(campaign.id)
      const token = getAuthToken()
      if (!token) {
        setError("Not authenticated")
        return
      }

      const response = await fetch(`/api/campaign/${campaign.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      })

      const responseData = await response.json()
      console.log('Campaign status update response:', responseData)

      if (!response.ok) {
        throw new Error(responseData.message || `Failed to update campaign status: ${response.status}`)
      }

      await fetchCampaigns()
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error("Error updating campaign status:", err)
      setError(err instanceof Error ? err.message : "Failed to update campaign status")
    } finally {
      setStatusUpdatingId(null)
    }
  }

  // Get campaign for viewing
  const viewingCampaign = viewingCampaignId ? campaigns.find((c) => c.id === viewingCampaignId) : null
  const activeCampaignData = campaigns.find((c) => c.status === "live")

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-8">
        <Card className="p-12 text-center">
          <div className="inline-block">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-neutral-600 mt-4">Loading campaigns...</p>
        </Card>
      </div>
    )
  }

  // Show error state
  if (error && campaigns.length === 0) {
    const apiUrl = `/api/campaign`
    return (
      <div className="space-y-8">
        <Card className="p-8 border border-red-200 bg-red-50">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Connection Error</h3>
              <p className="text-red-600 font-semibold">{error}</p>
            </div>
            
            <div className="bg-white p-4 rounded border border-red-200">
              <p className="text-sm font-mono text-neutral-700 break-all">
                <span className="text-neutral-500">API URL: </span>
                <span className="font-bold">{apiUrl}</span>
              </p>
            </div>

            <div className="text-sm text-red-700">
              <p className="font-semibold mb-2">🔍 Debugging Steps:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Check browser DevTools Console (F12) for detailed logs</li>
                <li>Ensure Laravel backend is running on localhost</li>
                <li>Visit {apiUrl} in your browser to test the endpoint</li>
                <li>Make sure you're logged in (auth_token in localStorage)</li>
                <li>Check CORS headers in Network tab</li>
              </ol>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button onClick={() => fetchCampaigns()} className="bg-blue-600 hover:bg-blue-700">
                Retry
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  navigator.clipboard.writeText(apiUrl)
                  alert("API URL copied! Paste in browser to test: " + apiUrl)
                }}
              >
                Copy & Test API URL
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  const token = getAuthToken()

                  alert(token ? "Token found (check console)" : "No token found - please log in")
                }}
              >
                Check Token
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 md:space-y-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Error Alert */}
      {error && (
        <Card className="p-4 border border-red-200 bg-red-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-red-900">Error Loading Campaigns</p>
              <p className="text-sm text-red-800 mt-1">{error}</p>
            </div>
            <button
              onClick={() => fetchCampaigns(true)}
              className="text-sm font-medium text-red-600 hover:text-red-700 whitespace-nowrap"
            >
              Retry
            </button>
          </div>
        </Card>
      )}

      {/* Loading Spinner */}
      {loading && campaigns.length === 0 ? (
        <Card className="p-12 text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-neutral-600">Loading campaigns...</p>
        </Card>
      ) : (
        <>
          {/* View Campaign Modal */}
      {viewingCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">{viewingCampaign.title}</h2>
                <button onClick={() => setViewingCampaignId(null)} className="text-neutral-400 hover:text-neutral-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Campaign Info */}
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-neutral-600">{viewingCampaign.description}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-xs text-neutral-600 mb-1">Goal</p>
                    <p className="text-xl font-bold">${viewingCampaign.funding_goal?.toLocaleString() || "0"}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-xs text-neutral-600 mb-1">Status</p>
                    <p className="text-xl font-bold capitalize">{viewingCampaign.status}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-xs text-neutral-600 mb-1">Days Active</p>
                    <p className="text-xl font-bold">{viewingCampaign.days_active || 0}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-xs text-neutral-600 mb-1">Created</p>
                    <p className="text-xl font-bold">{new Date(viewingCampaign.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button className="flex-1" onClick={() => setViewingCampaignId(null)}>
                    Close
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      handleEditCampaign(viewingCampaign)
                      setViewingCampaignId(null)
                    }}
                  >
                    Edit Campaign
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Edit Campaign Modal - REMOVED: Users now navigate to dedicated edit page */}
      {false && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[95vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Edit Campaign</h2>
                <button onClick={() => {
                  setEditingCampaignId(null)
                  setImagePreview(undefined)
                  setImageBackPreview(undefined)
                  setFrontImageFile(null)
                  setBackImageFile(null)
                  setTechPackFile(null)
                }} className="text-neutral-400 hover:text-neutral-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6 mb-6">
                {/* Campaign Status - Read Only */}
                <div>
                  <Label className="font-semibold mb-2 block">Campaign Status</Label>
                  <div className="bg-neutral-100 p-3 rounded-lg border border-neutral-200">
                    <p className="text-sm font-semibold capitalize">{editFormData.status}</p>
                  </div>
                </div>

                {/* Campaign Title */}
                <div>
                  <Label className="font-semibold mb-2 block">Campaign Title</Label>
                  <Input value={editFormData.title} onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })} placeholder="Enter campaign title" />
                </div>

                {/* Campaign Image Upload - Front & Back */}
                <div>
                  <Label className="font-semibold mb-2 block">Campaign Images (Front & Back)</Label>
                  <div className="space-y-4">
                    {/* Front Image */}
                    <div>
                      <p className="text-sm font-medium text-neutral-600 mb-2">Front Image</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-blue-500 cursor-pointer transition-all">
                            <label className="cursor-pointer">
                              <div className="flex flex-col items-center gap-2">
                                <Upload className="w-8 h-8 text-neutral-400" />
                                <span className="text-sm font-medium text-neutral-600">Click to upload</span>
                                <span className="text-xs text-neutral-500">PNG, JPG up to 10MB</span>
                              </div>
                              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                          </div>
                        </div>
                        {imagePreview && (
                          <div className="rounded-lg overflow-hidden border border-neutral-200 h-48">
                            <img src={imagePreview} alt="Front Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Back Image */}
                    <div>
                      <p className="text-sm font-medium text-neutral-600 mb-2">Back Image</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-blue-500 cursor-pointer transition-all">
                            <label className="cursor-pointer">
                              <div className="flex flex-col items-center gap-2">
                                <Upload className="w-8 h-8 text-neutral-400" />
                                <span className="text-sm font-medium text-neutral-600">Click to upload</span>
                                <span className="text-xs text-neutral-500">PNG, JPG up to 10MB</span>
                              </div>
                              <input type="file" accept="image/*" onChange={handleImageBackUpload} className="hidden" />
                            </label>
                          </div>
                        </div>
                        {imageBackPreview && (
                          <div className="rounded-lg overflow-hidden border border-neutral-200 h-48">
                            <img src={imageBackPreview} alt="Back Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label className="font-semibold mb-2 block">Description</Label>
                  <textarea
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Enter campaign description"
                  />
                </div>

                {/* Category */}
                <div>
                  <Label className="font-semibold mb-2 block">Category</Label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select category</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Home">Home</option>
                    <option value="Sports">Sports</option>
                    <option value="Tech">Tech</option>
                  </select>
                </div>

                {/* Funding & Timeline */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold mb-2 block">Funding Goal ($)</Label>
                    <Input type="number" value={editFormData.fundingGoal} onChange={(e) => setEditFormData({ ...editFormData, fundingGoal: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <Label className="font-semibold mb-2 block">Days Left</Label>
                    <Input type="number" value={editFormData.daysLeft} onChange={(e) => setEditFormData({ ...editFormData, daysLeft: parseInt(e.target.value) || 0 })} />
                  </div>
                </div>

                {/* Available Sizes */}
                <div className="border border-neutral-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedSections({ ...expandedSections, sizes: !expandedSections.sizes })}
                    className="w-full px-4 py-3 bg-neutral-50 hover:bg-neutral-100 flex items-center justify-between font-semibold text-neutral-900 transition-colors"
                  >
                    <span>Available Sizes</span>
                    <span className={`transform transition-transform ${expandedSections.sizes ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  </button>
                  {expandedSections.sizes && (
                    <div className="px-4 py-3 bg-white border-t border-neutral-200">
                      <Input
                        value={editFormData.sizes.join(", ")}
                        onChange={(e) => setEditFormData({ ...editFormData, sizes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                        placeholder="e.g., XS, S, M, L, XL, 2XL (comma-separated)"
                      />
                      <p className="text-xs text-neutral-500 mt-2">Enter sizes separated by commas</p>
                    </div>
                  )}
                </div>

                {/* Available Colors */}
                <div className="border border-neutral-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedSections({ ...expandedSections, colors: !expandedSections.colors })}
                    className="w-full px-4 py-3 bg-neutral-50 hover:bg-neutral-100 flex items-center justify-between font-semibold text-neutral-900 transition-colors"
                  >
                    <span>Available Colors</span>
                    <span className={`transform transition-transform ${expandedSections.colors ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  </button>
                  {expandedSections.colors && (
                    <div className="px-4 py-3 bg-white border-t border-neutral-200">
                      <Input
                        value={editFormData.colors.join(", ")}
                        onChange={(e) => setEditFormData({ ...editFormData, colors: e.target.value.split(",").map((c) => c.trim()).filter(Boolean) })}
                        placeholder="e.g., Black, White, Navy, Red (comma-separated)"
                      />
                      <p className="text-xs text-neutral-500 mt-2">Enter colors separated by commas</p>
                    </div>
                  )}
                </div>

                {/* Tech Pack Upload */}
                <div className="border border-neutral-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedSections({ ...expandedSections, techPack: !expandedSections.techPack })}
                    className="w-full px-4 py-3 bg-neutral-50 hover:bg-neutral-100 flex items-center justify-between font-semibold text-neutral-900 transition-colors"
                  >
                    <span>Tech Pack (Optional)</span>
                    <span className={`transform transition-transform ${expandedSections.techPack ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  </button>
                  {expandedSections.techPack && (
                    <div className="px-4 py-3 bg-white border-t border-neutral-200 space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-neutral-300 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-all">
                          <FileText className="w-5 h-5 text-neutral-400" />
                          <span className="text-sm font-medium text-neutral-600">
                            {techPackFile?.name ?? "Click to upload PDF"}
                          </span>
                          <input type="file" accept=".pdf" onChange={handleTechPackUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                    
                    {/* Display current tech pack if exists */}
                    {editFormData.techPackUrl && (
                      <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <div>
                            <span className="text-sm font-medium text-blue-900">{editFormData.techPackUrl.split('/').pop() || 'Tech Pack'}</span>
                            <p className="text-xs text-blue-700 mt-1">Current tech pack</p>
                          </div>
                        </div>
                        <a 
                          href={editFormData.techPackUrl}
                          download
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-semibold hover:underline transition-colors"
                          title="Download tech pack"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                      </div>
                    )}
                    
                    {/* Show newly selected file */}
                    {techPackFile && (
                      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-900">{techPackFile?.name ?? "Tech pack"} (new)</span>
                        </div>
                        <button
                          onClick={() => {
                            setTechPackFile(null)
                            setEditFormData({ ...editFormData, techPackUrl: "" })
                          }}
                          className="text-red-600 hover:text-red-700 text-sm font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-neutral-500">Upload PDF file with technical specifications</p>
                    </div>
                  )}
                </div>
              </div>

              {saveSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Changes saved successfully
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleSaveCampaign(false)}>
                  <Flame className="w-4 h-4 mr-2" />
                  Publish
                </Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => handleSaveCampaign(true)}>
                  <Save className="w-4 h-4 mr-2" />
                  Save as Draft
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => {
                  setEditingCampaignId(null)
                  setImagePreview(undefined)
                  setImageBackPreview(undefined)
                  setFrontImageFile(null)
                  setBackImageFile(null)
                  setTechPackFile(null)
                }}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Active Campaign Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold">Active Campaign</h2>
        </div>
        {activeCampaignData ? (
          <Card className="p-4 md:p-6 lg:p-8 overflow-hidden">
            <div className="space-y-4 md:space-y-6 w-full">
              {/* Top Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                <div className="p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs md:text-sm text-blue-600 font-semibold mb-1 md:mb-2">Funding Goal</p>
                  <p className="text-2xl md:text-3xl font-bold text-blue-900">${activeCampaignData.funding_goal?.toLocaleString() || "0"}</p>
                  <p className="text-xs text-blue-600 mt-1">Campaign target</p>
                </div>

                <div className="p-3 md:p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1 md:mb-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <p className="text-xs md:text-sm text-orange-600 font-semibold">Time Limit</p>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-orange-600">{activeCampaignData.days_active || 90}</p>
                  <p className="text-xs text-orange-600">days active</p>
                </div>

                <div className="p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs md:text-sm text-green-600 font-semibold mb-1 md:mb-2">Status</p>
                  <p className="text-xl md:text-2xl font-bold text-green-900 capitalize">{activeCampaignData.status}</p>
                  <p className="text-xs text-green-600 mt-1">{new Date(activeCampaignData.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Main Campaign Gallery & Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {/* Campaign Images Section */}
                <div className="md:col-span-1 lg:col-span-2">
                {activeCampaignData.product_images && Array.isArray(activeCampaignData.product_images) && activeCampaignData.product_images.length > 0 ? (
                  <div className="space-y-4">
                    {/* Main Image Display */}
                    <div className="bg-neutral-100 rounded-xl overflow-hidden border border-neutral-200">
                      <div className="relative aspect-square w-full flex items-center justify-center">
                        <img
                          src={
                            activeCampaignData.product_images[selectedImageIndex]?.path
                              ? activeCampaignData.product_images[selectedImageIndex].path.startsWith('/api')
                                ? activeCampaignData.product_images[selectedImageIndex].path
                                : `/api/storage/${activeCampaignData.product_images[selectedImageIndex].path}`
                              : '/placeholder.svg'
                          }
                          alt={`Campaign ${activeCampaignData.product_images[selectedImageIndex]?.type || 'image'}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg'
                          }}
                        />
                      </div>
                    </div>

                    {/* Image Thumbnails */}
                    {activeCampaignData.product_images.length > 1 && (
                      <div className="flex gap-3">
                        {activeCampaignData.product_images.map((img: any, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedImageIndex(idx)}
                            className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                              selectedImageIndex === idx
                                ? 'border-blue-600 ring-2 ring-blue-500'
                                : 'border-neutral-300 hover:border-neutral-400'
                            }`}
                          >
                            <div className="w-20 h-20 bg-neutral-100 flex items-center justify-center">
                              <img
                                src={
                                  img.path
                                    ? img.path.startsWith('/api')
                                      ? img.path
                                      : `/api/storage/${img.path}`
                                    : '/placeholder.svg'
                                }
                                alt={`Thumbnail ${idx}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder.svg'
                                }}
                              />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <div className="bg-black bg-opacity-40 text-white text-xs font-semibold px-2 py-1 rounded capitalize">
                                {img.type || 'photo'}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Image Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-900 font-semibold">
                        {activeCampaignData.product_images[selectedImageIndex]?.type === 'front' && '👕 Front View'}
                        {activeCampaignData.product_images[selectedImageIndex]?.type === 'back' && '👔 Back View'}
                        {!['front', 'back'].includes(activeCampaignData.product_images[selectedImageIndex]?.type) && '🖼️ Campaign Image'}
                      </p>
                      {activeCampaignData.product_images[selectedImageIndex]?.name && (
                        <p className="text-xs text-blue-700 mt-1">
                          {activeCampaignData.product_images[selectedImageIndex].name}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-neutral-100 rounded-xl border-2 border-dashed border-neutral-300 h-96 flex flex-col items-center justify-center text-center">
                    <div className="text-neutral-400 mb-3">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-neutral-600 font-semibold mb-1">No Campaign Images</p>
                    <p className="text-neutral-500 text-sm">Upload images when editing your campaign</p>
                  </div>
                )}
              </div>

              {/* Campaign Details Section */}
              <div className="md:col-span-1 lg:col-span-1 overflow-hidden">
                <div className="space-y-4 md:space-y-6 w-full">
                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                      activeCampaignData.status === 'live'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      <span className={`w-2 h-2 rounded-full mr-1.5 md:mr-2 flex-shrink-0 ${
                        activeCampaignData.status === 'live' ? 'bg-green-600' : 'bg-blue-600'
                      }`}></span>
                      {activeCampaignData.status === 'live' ? '🔴 LIVE' : '📋 DRAFT'}
                    </span>
                  </div>

                  {/* Campaign Title */}
                  <div className="w-full min-w-0">
                    <h1 className="text-lg md:text-2xl font-bold text-neutral-900 mb-2 break-words overflow-hidden">{activeCampaignData.title}</h1>
                    <p className="text-neutral-600 text-xs md:text-sm line-clamp-3 overflow-hidden">{activeCampaignData.description}</p>
                  </div>

                  {/* Funding Progress */}
                  <div className="space-y-2 md:space-y-3 border-t border-b border-neutral-200 py-3 md:py-4">
                    <div className="flex justify-between items-baseline gap-2 flex-wrap">
                      <p className="text-xs font-semibold text-neutral-500 uppercase">Funding Progress</p>
                      <p className="text-sm font-bold text-neutral-900">
                        {activeCampaignData.current_funding ? ((activeCampaignData.current_funding / activeCampaignData.funding_goal) * 100).toFixed(0) : 0}%
                      </p>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-500 rounded-full"
                        style={{ width: `${Math.min(((activeCampaignData.current_funding || 0) / activeCampaignData.funding_goal) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-neutral-600 gap-2 flex-wrap">
                      <span className="truncate">${activeCampaignData.current_funding?.toLocaleString() || "0"} raised</span>
                      <span className="truncate">${(activeCampaignData.funding_goal - (activeCampaignData.current_funding || 0)).toLocaleString()} to go</span>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                    <div className="bg-blue-50 rounded-lg p-2 md:p-3 border border-blue-200 text-center">
                      <p className="text-xs text-blue-600 font-bold uppercase mb-1">Backers</p>
                      <p className="text-lg md:text-xl font-bold text-blue-900">{activeCampaignData.backer_count || 0}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2 md:p-3 border border-purple-200 text-center">
                      <p className="text-xs text-purple-600 font-bold uppercase mb-1">Views</p>
                      <p className="text-lg md:text-xl font-bold text-purple-900">{activeCampaignData.views || 0}</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-2 md:p-3 border border-orange-200 text-center">
                      <p className="text-xs text-orange-600 font-bold uppercase mb-1">Conversion</p>
                      <p className="text-lg md:text-xl font-bold text-orange-900">
                        {activeCampaignData.views ? ((activeCampaignData.backer_count || 0) / activeCampaignData.views * 100).toFixed(0) : 0}%
                      </p>
                    </div>
                  </div>

                  {/* Survey Responses Section */}
                  <div className="bg-neutral-50 rounded-lg p-3 md:p-4 border border-neutral-200 space-y-3 md:space-y-4">
                    <p className="text-xs font-bold text-neutral-600 uppercase truncate">Survey Responses</p>
                    
                    {surveyLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin h-5 w-5 text-blue-600 mr-2"></div>
                        <span className="text-sm text-neutral-600">Loading responses...</span>
                      </div>
                    ) : surveyResponses && surveyResponses.questions && surveyResponses.questions.length > 0 ? (
                      <>
                        {surveyResponses.questions.map((question: any, qIdx: number) => {
                          const totalResponses = question.total_responses
                          const responseCounts = question.response_counts || {}
                          
                          return (
                            <div key={question.id || qIdx}>
                              <div className="space-y-2">
                                <p className="text-sm text-neutral-700 font-medium">{question.question_text}</p>
                                <div className="space-y-1.5">
                                  {Object.entries(responseCounts).map(([answer, count]: [string, any], idx: number) => {
                                    const percentage = totalResponses > 0 ? ((count / totalResponses) * 100).toFixed(0) : 0
                                    return (
                                      <div key={idx} className="flex justify-between items-center text-xs">
                                        <span className="text-neutral-600">{answer}</span>
                                        <span className="font-semibold text-neutral-900">{percentage}%</span>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                              {qIdx < surveyResponses.questions.length - 1 && (
                                <div className="border-t border-neutral-200 my-3"></div>
                              )}
                            </div>
                          )
                        })}
                        
                        {/* View All Responses Link */}
                        <div className="border-t border-neutral-200 pt-2">
                          <a href="#" className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-semibold hover:underline">
                            <span>◀</span> View all responses ({surveyResponses.total_responses} total)
                          </a>
                        </div>
                      </>
                    ) : (
                      <div className="py-4 text-center">
                        <p className="text-sm text-neutral-500">No survey responses yet</p>
                        <p className="text-xs text-neutral-400 mt-1">Survey responses will appear here as customers submit them</p>
                      </div>
                    )}
                  </div>

                  {/* Success Message */}
                  {saveSuccess && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Changes saved successfully
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2 md:space-y-3">
                    <Button 
                      onClick={() => {
                        setSelectedImageIndex(0)
                        handleEditCampaign(activeCampaignData)
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10 md:h-11 font-semibold rounded-lg transition-all text-sm md:text-base"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Campaign
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleToggleCampaignStatus(activeCampaignData)}
                      disabled={statusUpdatingId === activeCampaignData.id}
                      className="w-full h-10 md:h-11 font-semibold rounded-lg transition-all text-sm md:text-base"
                    >
                      {statusUpdatingId === activeCampaignData.id ? (
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                      ) : null}
                      {activeCampaignData.status === "live" ? "Move to Draft" : "Publish Campaign"}
                    </Button>
                    {activeCampaignData.status === 'live' && (
                      <Link href={`/campaign/${activeCampaignData.id}`}>
                        <Button 
                          variant="outline"
                          className="w-full h-10 md:h-11 font-semibold rounded-lg transition-all hover:bg-neutral-50 text-sm md:text-base"
                        >
                          👁️ View Live Campaign
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          </Card>
        ) : (
          <Card className="p-12 text-center border-2 border-dashed border-neutral-300 bg-neutral-50">
            <Flame className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
            <p className="text-neutral-600 mb-4 text-lg font-semibold">No active campaigns at the moment</p>
            <p className="text-neutral-500 mb-6">Launch your first campaign to get started and reach your audience</p>
            <Link href="/launch-campaign">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Flame className="w-4 h-4 mr-2" /> Launch Campaign
              </Button>
            </Link>
          </Card>
        )}
      </div>

      {/* All Campaigns Section */}
      <div className="space-y-6 pt-6 md:pt-8 border-t border-neutral-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">All Campaigns</h2>
            {lastUpdated && (
              <p className="text-xs text-neutral-500 mt-1">Last updated: {lastUpdated.toLocaleTimeString()}</p>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={campaignFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setCampaignFilter("all")}
              className="rounded-lg"
            >
              All
            </Button>
            <Button
              variant={campaignFilter === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setCampaignFilter("active")}
              className="rounded-lg"
            >
              Active
            </Button>
            <Button
              variant={campaignFilter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setCampaignFilter("completed")}
              className="rounded-lg"
            >
              Completed
            </Button>
            <Button
              variant={campaignFilter === "draft" ? "default" : "outline"}
              size="sm"
              onClick={() => setCampaignFilter("draft")}
              className="rounded-lg"
            >
              Draft
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 rounded-lg" 
              onClick={() => fetchCampaigns(true)} 
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Link href="/launch-campaign">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 rounded-lg">
                <Plus className="w-4 h-4 mr-1" /> New
              </Button>
            </Link>
          </div>
        </div>

        {filteredCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredCampaigns.map((campaign) => {
              const fundingPercentage = campaign.funding_goal ? (campaign.current_funding || 0) / campaign.funding_goal * 100 : 0
              const isPublished = campaign.status === "live"

              return (
                <Card key={campaign.id} className="overflow-hidden border border-neutral-200 bg-white shadow-sm transition-all hover:shadow-md">
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-56 h-56 bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-300 flex-shrink-0 relative overflow-hidden">
                      {campaign.product_images && campaign.product_images.length > 0 ? (
                        (() => {
                          const img = campaign.product_images[0]
                          let imagePath = typeof img === "object" ? (img.path || img.url) : img

                          if (imagePath?.includes("storage/")) {
                            imagePath = imagePath.substring(imagePath.indexOf("storage/") + 8)
                          }

                          const apiImageUrl = `/api/storage/${imagePath}`

                          return (
                            <img
                              src={apiImageUrl}
                              alt={campaign.title}
                              className="w-full h-full object-cover"
                              style={{ display: "block" }}
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg"
                              }}
                            />
                          )
                        })()
                      ) : (
                        <>
                          <img src="/placeholder.svg" alt={campaign.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100/90 text-xs text-neutral-500 px-3 text-center">
                            No images available yet
                          </div>
                        </>
                      )}
                      <div className={`absolute top-3 right-3 border px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeClasses(campaign.status)}`}>
                        {getStatusLabel(campaign.status)}
                      </div>
                    </div>

                    <div className="flex-1 p-5 md:p-6 flex flex-col justify-between gap-4">
                      <div className="space-y-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-neutral-900">{campaign.title}</h3>
                            <p className="mt-1 text-sm text-neutral-600 line-clamp-2">{campaign.description || "A polished campaign ready for your audience."}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`border px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClasses(campaign.status)}`}>
                              {getStatusLabel(campaign.status)}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggleCampaignStatus(campaign)}
                              disabled={statusUpdatingId === campaign.id}
                              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${isPublished ? "bg-emerald-600" : "bg-slate-300"}`}
                              aria-label={isPublished ? "Switch to draft" : "Switch to published"}
                            >
                              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${isPublished ? "translate-x-7" : "translate-x-1"}`} />
                            </button>
                          </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                          <div className="bg-neutral-50 p-3 rounded-lg">
                            <p className="text-xs font-semibold uppercase text-neutral-500">Raised</p>
                            <p className="mt-1 text-lg font-bold text-neutral-900">${(campaign.current_funding || 0).toLocaleString()}</p>
                          </div>
                          <div className="bg-neutral-50 p-3 rounded-lg">
                            <p className="text-xs font-semibold uppercase text-neutral-500">Goal</p>
                            <p className="mt-1 text-lg font-bold text-blue-600">${campaign.funding_goal?.toLocaleString() || "0"}</p>
                          </div>
                          <div className="bg-neutral-50 p-3 rounded-lg">
                            <p className="text-xs font-semibold uppercase text-neutral-500">Created</p>
                            <p className="mt-1 text-lg font-bold text-neutral-700">{new Date(campaign.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-neutral-700">Progress</span>
                            <span className="text-sm font-semibold text-blue-600">{Math.round(fundingPercentage)}%</span>
                          </div>
                          <div className="h-2.5 w-full rounded-full bg-neutral-200">
                            <div
                              className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                              style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Button variant="outline" className="flex-1 rounded-lg" onClick={() => setViewingCampaignId(campaign.id)}>
                          View Product
                        </Button>
                        <Button variant="outline" className="flex-1 rounded-lg" onClick={() => handleEditCampaign(campaign)}>
                          <Edit2 className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button className={`flex-1 rounded-lg ${isPublished ? "bg-slate-700 hover:bg-slate-800" : "bg-emerald-600 hover:bg-emerald-700"}`} onClick={() => handleToggleCampaignStatus(campaign)} disabled={statusUpdatingId === campaign.id}>
                          {statusUpdatingId === campaign.id ? <Loader className="w-4 h-4 mr-1 animate-spin" /> : null}
                          {isPublished ? "Move to Draft" : "Publish"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="p-12 text-center border-2 border-dashed border-neutral-300 bg-neutral-50">
            <Target className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
            <p className="text-neutral-600 mb-2 text-lg font-semibold">No campaigns found</p>
            <p className="text-neutral-500 mb-6">Try adjusting your filters or launch a new campaign</p>
            <Link href="/launch-campaign">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" /> Create Campaign
              </Button>
            </Link>
          </Card>
        )}
      </div>
        </>
      )}
    </div>
  )
}
