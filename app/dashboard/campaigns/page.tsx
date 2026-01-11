"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit2, Plus, CheckCircle, Clock, Users, Zap, Target, Flame, X, Save, Upload, FileText, Download } from "lucide-react"
import { BACKEND_URL } from "@/config"

export default function CampaignsPage() {
  const [campaignFilter, setCampaignFilter] = useState("all")
  const [selectedColor, setSelectedColor] = useState("Red")
  const [selectedSize, setSelectedSize] = useState("M")
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [viewingCampaignId, setViewingCampaignId] = useState<string | null>(null)
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [campaigns, setCampaigns] = useState<any[]>([])
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
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageBackPreview, setImageBackPreview] = useState<string | null>(null)
  const [techPackFile, setTechPackFile] = useState<File | null>(null)
  // Fetch campaigns from API on mount
  useEffect(() => {
    fetchCampaigns()
  }, [])

  // Helper function to get authorization token
  const getAuthToken = () => {
    const token = localStorage.getItem("auth_token")
    return token
  }

  // Fetch campaigns from backend
  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = getAuthToken()

      if (!token) {
        setError("Not authenticated. Please log in first.")
        setLoading(false)
        return
      }

      const fetchUrl = `${BACKEND_URL}/campaign`

      if (!token) {
        setError("Not authenticated. Please log in first.")
        setLoading(false)
        return
      }

      const response = await fetch(fetchUrl, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        credentials: "include",
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
        
        setCampaigns(campaignsList)
      } else {
        setCampaigns([])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load campaigns - Unknown error"
      setError(errorMessage)
      setCampaigns([])
    } finally {
      setLoading(false)
    }
  }

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

  // Helper function to filter campaigns
  const filteredCampaigns = campaigns.filter((campaign) => {
    if (campaignFilter === "active") return campaign.status === "active"
    if (campaignFilter === "completed") return campaign.status === "completed"
    return true
  })

  // Handle Edit Campaign
  const handleEditCampaign = (campaign: any) => {
    setEditingCampaignId(campaign.id)
    
    // Ensure sizes is an array
    let sizesArray: string[] = []
    if (campaign.sizes) {
      if (typeof campaign.sizes === "string") {
        sizesArray = campaign.sizes.split(",").map((s: string) => s.trim()).filter(Boolean)
      } else if (Array.isArray(campaign.sizes)) {
        sizesArray = campaign.sizes
      }
    }
    
    // Ensure colors is an array
    let colorsArray: string[] = []
    if (campaign.colors) {
      if (typeof campaign.colors === "string") {
        colorsArray = campaign.colors.split(",").map((c: string) => c.trim()).filter(Boolean)
      } else if (Array.isArray(campaign.colors)) {
        colorsArray = campaign.colors
      }
    }
    
    // Get image preview URLs - convert to API route format if needed
    let frontImageUrl = ""
    let backImageUrl = ""
    
    if (campaign.product_images && Array.isArray(campaign.product_images)) {
      const frontImg = campaign.product_images.find((img: any) => img.type === "front")
      const backImg = campaign.product_images.find((img: any) => img.type === "back")
      if (frontImg && frontImg.path) {
        frontImageUrl = `/api/storage/${frontImg.path}`
      }
      if (backImg && backImg.path) {
        backImageUrl = `/api/storage/${backImg.path}`
      }
    }
    
    // Get tech pack URL - convert to API route format if needed
    let techPackUrl = ""
    // Try both field names (camelCase and snake_case)
    const techPackFile = campaign.techPackUrl || campaign.tech_pack_file
    if (techPackFile) {
      // If it's already a full path like campaigns/tech-packs/file.pdf, use API route
      if (!techPackFile.startsWith("/api")) {
        techPackUrl = `/api/storage/${techPackFile}`
      } else {
        techPackUrl = techPackFile
      }
    }
    
    setEditFormData({
      title: campaign.title,
      description: campaign.description,
      fundingGoal: campaign.fundingGoal,
      daysLeft: campaign.daysLeft,
      category: campaign.category,
      image: campaign.image || frontImageUrl,
      imageBack: campaign.imageBack || backImageUrl || "",
      techPackUrl: techPackUrl,
      sizes: sizesArray,
      colors: colorsArray,
    })
    setImagePreview(campaign.image || frontImageUrl || null)
    setImageBackPreview(campaign.imageBack || backImageUrl || null)
    setTechPackFile(null)
  }

  // Handle Image Upload (Front)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        setEditFormData({ ...editFormData, image: result })
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle Image Upload (Back)
  const handleImageBackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImageBackPreview(result)
        setEditFormData({ ...editFormData, imageBack: result })
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
  const handleSaveCampaign = async () => {
    try {
      const token = getAuthToken()
      if (!token) {
        setError("Not authenticated")
        return
      }

      // Prepare update data
      const updateData = {
        title: editFormData.title,
        description: editFormData.description,
        funding_goal: editFormData.fundingGoal,
        product_name: editFormData.title,
        product_description: editFormData.description,
        days_active: editFormData.daysLeft,
        category: editFormData.category,
        sizes: editFormData.sizes,
        colors: editFormData.colors,
      }

      const response = await fetch(`${BACKEND_URL}/campaign/${editingCampaignId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Failed to update campaign: ${response.status}`)
      }

      // Refresh campaigns list
      await fetchCampaigns()

      setEditingCampaignId(null)
      setImagePreview(null)
      setImageBackPreview(null)
      setTechPackFile(null)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error("Error saving campaign:", err)
      setError(err instanceof Error ? err.message : "Failed to save campaign")
    }
  }

  // Get campaign for viewing
  const viewingCampaign = viewingCampaignId ? campaigns.find((c) => c.id === viewingCampaignId) : null
  const activeCampaignData = campaigns.find((c) => c.status === "active")

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
    const apiUrl = `${BACKEND_URL}/campaign`
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
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
          {error}
        </div>
      )}

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

      {/* Edit Campaign Modal */}
      {editingCampaignId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[95vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Edit Campaign</h2>
                <button onClick={() => setEditingCampaignId(null)} className="text-neutral-400 hover:text-neutral-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6 mb-6">
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
                <div>
                  <Label className="font-semibold mb-2 block">Available Sizes</Label>
                  <Input
                    value={editFormData.sizes.join(", ")}
                    onChange={(e) => setEditFormData({ ...editFormData, sizes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                    placeholder="e.g., XS, S, M, L, XL, 2XL (comma-separated)"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Enter sizes separated by commas</p>
                </div>

                {/* Available Colors */}
                <div>
                  <Label className="font-semibold mb-2 block">Available Colors</Label>
                  <Input
                    value={editFormData.colors.join(", ")}
                    onChange={(e) => setEditFormData({ ...editFormData, colors: e.target.value.split(",").map((c) => c.trim()).filter(Boolean) })}
                    placeholder="e.g., Black, White, Navy, Red (comma-separated)"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Enter colors separated by commas</p>
                </div>

                {/* Tech Pack Upload */}
                <div>
                  <Label className="font-semibold mb-2 block">Tech Pack (Optional)</Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-neutral-300 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-all">
                          <FileText className="w-5 h-5 text-neutral-400" />
                          <span className="text-sm font-medium text-neutral-600">
                            {techPackFile ? techPackFile.name : "Click to upload PDF"}
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
                          <span className="text-sm font-medium text-green-900">{techPackFile.name} (new)</span>
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
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">Upload PDF file with technical specifications</p>
                </div>
              </div>

              {saveSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Changes saved successfully
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleSaveCampaign}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setEditingCampaignId(null)}>
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
          <h2 className="text-3xl font-bold">Active Campaign</h2>
        </div>
        {activeCampaignData ? (
          <div className="space-y-6">
            {/* Health Score Badge and Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <p className="text-sm text-neutral-600 mb-1">Funding Goal</p>
                <p className="text-2xl font-bold mb-2">${activeCampaignData.funding_goal?.toLocaleString() || "0"}</p>
                <p className="text-xs text-neutral-500">Campaign target</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <p className="text-sm text-neutral-600">Time Limit</p>
                </div>
                <p className="text-3xl font-bold text-orange-600">{activeCampaignData.days_active || 90}</p>
                <p className="text-xs text-neutral-500">days active</p>
              </Card>

              <Card className="p-4">
                <p className="text-sm text-neutral-600 mb-1">Status</p>
                <p className="text-2xl font-bold mb-2 capitalize">{activeCampaignData.status}</p>
                <p className="text-xs text-neutral-500">{new Date(activeCampaignData.created_at).toLocaleDateString()}</p>
              </Card>
            </div>

            {/* Main Campaign Details Section */}
            <Card className="p-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{activeCampaignData.title}</h3>
                <p className="text-neutral-600 mb-4">{activeCampaignData.description}</p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-600 font-semibold capitalize">{activeCampaignData.status} Campaign</span>
                </div>
              </div>

              {saveSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-semibold flex items-center gap-2 mb-4">
                  <CheckCircle className="w-4 h-4" /> Changes saved successfully
                </div>
              )}

              <Button onClick={() => handleEditCampaign(activeCampaignData)} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white h-11 font-semibold hover:from-blue-700 hover:to-blue-800 rounded-lg">
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Campaign
              </Button>
            </Card>
          </div>
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
      <div className="space-y-6 pt-8 border-t border-neutral-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold">All Campaigns</h2>
          <div className="flex gap-2">
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

              return (
                <Card key={campaign.id} className="overflow-hidden hover:shadow-lg transition-all border border-neutral-200">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-48 h-48 bg-gradient-to-br from-neutral-200 to-neutral-300 flex-shrink-0 relative overflow-hidden">
                      {campaign.product_images && campaign.product_images.length > 0 ? (
                        (() => {
                          const img = campaign.product_images[0]
                          
                          // Handle both object format {url, path} and string format
                          let imagePath = typeof img === "object" ? (img.path || img.url) : img

                          
                          // Remove storage prefix if present and use API route
                          if (imagePath?.includes("storage/")) {
                            imagePath = imagePath.substring(imagePath.indexOf("storage/") + 8)
                          }
                          
                          // Construct API route URL for image proxy
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
                              onLoad={() => {

                              }}
                            />
                          )
                        })()
                      ) : (
                        <>
                          <img src="/placeholder.svg" alt={campaign.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 text-xs text-neutral-500">
                            No images (product_images length: {campaign.product_images?.length || 0})
                          </div>
                        </>
                      )}
                      <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${campaign.status === "active" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                        {campaign.status === "active" ? "Active" : "Draft"}
                      </div>
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <h3 className="text-xl font-bold">{campaign.title}</h3>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${campaign.status === "active" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                            {campaign.status === "active" ? "Active" : "Draft"}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-semibold text-neutral-700">${(campaign.current_funding || 0).toLocaleString()} of ${campaign.funding_goal?.toLocaleString() || "0"}</span>
                            <span className="text-sm font-bold text-blue-600">{Math.round(fundingPercentage)}%</span>
                          </div>
                          <div className="w-full bg-neutral-200 rounded-full h-2.5">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all"
                              style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
                            />
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-neutral-50 p-3 rounded-lg">
                            <p className="text-xs text-neutral-600 font-semibold mb-1">Status</p>
                            <p className="text-lg font-bold text-neutral-900 capitalize">{campaign.status}</p>
                          </div>
                          <div className="bg-neutral-50 p-3 rounded-lg">
                            <p className="text-xs text-neutral-600 font-semibold mb-1">Days Left</p>
                            <p className="text-lg font-bold text-blue-600">{campaign.days_active || 0}</p>
                          </div>
                          <div className="bg-neutral-50 p-3 rounded-lg">
                            <p className="text-xs text-neutral-600 font-semibold mb-1">Created</p>
                            <p className="text-lg font-bold text-neutral-700">{new Date(campaign.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button variant="outline" className="flex-1 rounded-lg" onClick={() => setViewingCampaignId(campaign.id)}>
                          View Campaign
                        </Button>
                        <Button variant="outline" className="rounded-lg" onClick={() => handleEditCampaign(campaign)}>
                          <Edit2 className="w-4 h-4 mr-1" /> Edit
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
    </div>
  )
}
