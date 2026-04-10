"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DashboardProfileCard } from "@/components/dashboard-profile-card"
import { ApiDiagnosticsPanel } from "@/components/api-diagnostics-panel"
import { Edit2, Plus, X, Loader, RefreshCw, AlertCircle, CheckCircle2, ChevronDown } from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()
  const [editingSettings, setEditingSettings] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showDiagnostics, setShowDiagnostics] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [socialLinks, setSocialLinks] = useState(["", "", "", "", ""])
  const [originalData, setOriginalData] = useState<any>(null)
  const [settingsData, setSettingsData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    mailingAddress: "",
    businessName: "",
    about: "",
    einNumber: "",
    businessRegistrationNumber: "",
    brandName: "",
    website: "",
    jobTitle: "",
    bankRoutingNumber: "",
    bankAccountNumber: "",
  })

  // Fetch creator profile data
  const fetchCreatorProfile = useCallback(async (showLoadingState = true) => {
    try {
      if (showLoadingState) setLoading(true)
      setError("")
      const token = localStorage.getItem("auth_token")
      
      if (!token) {
        setError("Authentication token not found. Please login again.")
        setLoading(false)
        return
      }

      console.log("Fetching creator profile...")
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/creator/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Creator profile response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("API Error:", errorData)
        throw new Error(errorData.message || `API Error: ${response.status}`)
      }

      const data = await response.json()
      console.log("Creator profile data:", data)
      
      if (data.status && data.creator) {
        const creator = data.creator
        const newData = {
          fullName: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
          mailingAddress: user?.address || "",
          businessName: creator.brand_name || "",
          about: creator.bio || creator.about || "",
          einNumber: "",
          businessRegistrationNumber: "",
          brandName: creator.brand_name || "",
          website: creator.website || "",
          jobTitle: creator.job_title || "",
          bankRoutingNumber: creator.routing_number || "",
          bankAccountNumber: creator.bank_account || "",
        }
        setSettingsData(newData)
        setOriginalData(newData)
        setLastUpdated(new Date())
        setHasUnsavedChanges(false)
        console.log("Profile loaded successfully")
      } else {
        throw new Error(data.message || "Failed to load creator profile")
      }
    } catch (err) {
      console.error("Error fetching creator profile:", err)
      setError(err instanceof Error ? err.message : "Failed to load settings")
    } finally {
      setLoading(false)
    }
  }, [user?.name, user?.email, user?.phone, user?.address])

  // Initial fetch on mount
  useEffect(() => {
    if (user) {
      fetchCreatorProfile()
    }
  }, []) // Only run once on mount - empty dependency array

  // Auto-refresh profile every 30 seconds (separate from main fetch)
  useEffect(() => {
    // Don't set up auto-refresh while editing
    if (editingSettings || hasUnsavedChanges) {
      return
    }

    let isMounted = true
    let refreshTimer: NodeJS.Timeout

    const autoRefresh = async () => {
      if (isMounted && !editingSettings && !hasUnsavedChanges) {
        try {
          const token = localStorage.getItem("auth_token")
          if (!token) return

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/creator/profile`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok && isMounted) {
            const data = await response.json()
            if (data.status && data.creator) {
              const creator = data.creator
              const newData = {
                fullName: user?.name || "",
                email: user?.email || "",
                phone: user?.phone || "",
                mailingAddress: user?.address || "",
                businessName: creator.brand_name || "",
                about: creator.bio || creator.about || "",
                einNumber: "",
                businessRegistrationNumber: "",
                brandName: creator.brand_name || "",
                website: creator.website || "",
                jobTitle: creator.job_title || "",
                bankRoutingNumber: creator.routing_number || "",
                bankAccountNumber: creator.bank_account || "",
              }
              setSettingsData(newData)
              setLastUpdated(new Date())
              console.log("Auto-refresh completed successfully")
            }
          }
        } catch (err) {
          console.error("Auto-refresh error:", err)
        }
      }
    }

    // Set up interval for auto-refresh every 30 seconds
    refreshTimer = setInterval(autoRefresh, 30000)

    return () => {
      isMounted = false
      clearInterval(refreshTimer)
    }
  }, [editingSettings, hasUnsavedChanges, user])

  const handleSettingsChange = (field: string, value: any) => {
    setSettingsData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setHasUnsavedChanges(true)
    
    // Clear field error when user starts editing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const updated = { ...prev }
        delete updated[field]
        return updated
      })
    }

    // Real-time validation
    validateField(field, value)
  }

  // Validate individual fields
  const validateField = (field: string, value: any): boolean => {
    let isValid = true
    const errors: Record<string, string> = { ...fieldErrors }

    switch (field) {
      case "email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = "Please enter a valid email address"
          isValid = false
        } else {
          delete errors.email
        }
        break
      case "phone":
        if (value && !/^\+?[\d\s\-()]{10,}$/.test(value.replace(/\s/g, ""))) {
          errors.phone = "Please enter a valid phone number"
          isValid = false
        } else {
          delete errors.phone
        }
        break
      case "website":
        if (value && !/^https?:\/\/.+\..+/i.test(value)) {
          errors.website = "Please enter a valid website URL (start with http:// or https://)"
          isValid = false
        } else {
          delete errors.website
        }
        break
    }

    setFieldErrors(errors)
    return isValid
  }

  // Validate all fields before saving
  const validateAllFields = (): boolean => {
    let isValid = true
    const errors: Record<string, string> = {}

    if (!settingsData.fullName?.trim()) {
      errors.fullName = "Full name is required"
      isValid = false
    }
    if (!settingsData.email?.trim()) {
      errors.email = "Email is required"
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settingsData.email)) {
      errors.email = "Please enter a valid email address"
      isValid = false
    }
    if (settingsData.phone && !/^\+?[\d\s\-()]{10,}$/.test(settingsData.phone.replace(/\s/g, ""))) {
      errors.phone = "Please enter a valid phone number"
      isValid = false
    }
    if (settingsData.website && !/^https?:\/\/.+\..+/i.test(settingsData.website)) {
      errors.website = "Please enter a valid website URL"
      isValid = false
    }

    setFieldErrors(errors)
    return isValid
  }

  const handleSaveSettings = async () => {
    try {
      // Validate all fields before saving
      if (!validateAllFields()) {
        setError("Please fix the errors below before saving")
        return
      }

      setSaving(true)
      setError("")
      setSuccess("")

      const token = localStorage.getItem("auth_token")
      
      if (!token) {
        setError("Authentication token not found. Please login again.")
        setSaving(false)
        return
      }

      // Function to extract CSRF token from cookie
      const getCsrfToken = () => {
        const name = "XSRF-TOKEN"
        const decodedCookies = decodeURIComponent(document.cookie)
        const cookieArray = decodedCookies.split(";")
        
        for (let cookie of cookieArray) {
          cookie = cookie.trim()
          if (cookie.startsWith(name + "=")) {
            return cookie.substring(name.length + 1)
          }
        }
        
        // Fallback: check common Laravel CSRF cookie names
        const csrfMatch = document.cookie.match(/(XSRF-TOKEN|csrf-token)=([^;]+)/)
        return csrfMatch ? decodeURIComponent(csrfMatch[2]) : null
      }

      const updatePayload = {
        name: settingsData.fullName,
        email: settingsData.email,
        phone: settingsData.phone,
        address: settingsData.mailingAddress,
        brand_name: settingsData.brandName,
        bio: settingsData.about,
        bank_account: settingsData.bankAccountNumber,
        routing_number: settingsData.bankRoutingNumber,
        account_holder: settingsData.fullName,
      }

      console.log("Saving settings with payload:", updatePayload)

      // Build headers
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }

      // Note: CSRF token not needed for Bearer token auth with API exemptions

      console.log("Request headers:", { ...headers, Authorization: "Bearer [token]" })
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/creator/profile`
      console.log("Full API URL:", apiUrl)

      const response = await fetch(apiUrl, {
        method: "PUT",
        headers,
        body: JSON.stringify(updatePayload),
      })

      console.log("Save response status:", response.status)
      console.log("Save response headers:", {
        "content-type": response.headers.get("content-type"),
        "access-control-allow-origin": response.headers.get("access-control-allow-origin"),
      })
      
      const responseText = await response.text()
      console.log("Save response text:", responseText)

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText)
          console.error("Save API Error (parsed):", errorData)
          throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`)
        } catch (parseErr) {
          console.error("Save API Error (could not parse):", responseText)
          throw new Error(`API Error: ${response.status} ${response.statusText} - ${responseText}`)
        }
      }

      const data = JSON.parse(responseText)
      console.log("Save response data:", data)
      
      if (data.status) {
        setSuccess("✓ Settings saved successfully!")
        setEditingSettings(false)
        setHasUnsavedChanges(false)
        setLastUpdated(new Date())
        setFieldErrors({})
        setTimeout(() => setSuccess(""), 4000)
      } else {
        setError(data.message || "Failed to save settings")
      }
    } catch (err) {
      console.error("Error saving settings:", err)
      
      // Check if it's a network error or CORS error
      if (err instanceof TypeError) {
        if (err.message.includes("Failed to fetch")) {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL
          setError(
            `Failed to fetch: Cannot connect to the backend server.\n\n` +
            `Backend URL: ${apiUrl}\n\n` +
            `Possible causes:\n` +
            `• Laragon server is not running\n` +
            `• Backend is not accessible at the configured URL\n` +
            `• Network or firewall blocking the connection\n\n` +
            `Click "Try Test Connection" above to verify backend availability.`
          )
        } else {
          setError(`Network error: ${err.message}`)
        }
      } else {
        setError(err instanceof Error ? err.message : "Failed to save settings. Please try again.")
      }
    } finally {
      setSaving(false)
    }
  }

  // Discard changes and reload original data
  const handleDiscardChanges = () => {
    if (originalData) {
      setSettingsData(originalData)
      setEditingSettings(false)
      setHasUnsavedChanges(false)
      setFieldErrors({})
    }
  }

  // Manual refresh
  const handleManualRefresh = async () => {
    if (!hasUnsavedChanges) {
      await fetchCreatorProfile()
    }
  }

  // Test backend connectivity
  const testBackendConnection = async () => {
    try {
      setError("")
      setSuccess("")
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      if (!apiUrl) {
        setError("API URL not configured in environment variables")
        return
      }

      const token = localStorage.getItem("auth_token")
      if (!token) {
        setError("No authentication token found. Please login first.")
        return
      }

      // Test GET request first
      const testUrl = `${apiUrl}/creator/profile`
      console.log("Testing GET connection to:", testUrl)
      
      const getResponse = await fetch(testUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Backend GET test response status:", getResponse.status)
      const getData = await getResponse.json()
      console.log("Backend GET test response:", getData)

      if (!getResponse.ok || !getData.status) {
        setError(
          `GET request test failed:\n\n` +
          `Status: ${getResponse.status}\n` +
          `Message: ${getData.message || "Unknown error"}`
        )
        return
      }

      // Now test PUT request
      console.log("Testing PUT connection to:", testUrl)
      
      const putResponse = await fetch(testUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bio: "test" }), // Minimal test payload
      })

      console.log("Backend PUT test response status:", putResponse.status)
      const putText = await putResponse.text()
      console.log("Backend PUT test response text:", putText)
      
      let putData: any = {}
      try {
        putData = JSON.parse(putText)
      } catch (e) {
        putData = { error: "Could not parse response" }
      }

      if (putResponse.ok && putData.status) {
        setSuccess(
          `✓ BOTH GET and PUT requests work!\n\n` +
          `Server: ${apiUrl}\n` +
          `GET Status: 200 OK ✓\n` +
          `PUT Status: ${putResponse.status} OK ✓\n\n` +
          `Your settings should save properly now.`
        )
      } else if (!putResponse.ok) {
        setError(
          `PUT request failed:\n\n` +
          `Status: ${putResponse.status}\n` +
          `Response: ${putText.substring(0, 200)}\n\n` +
          `GET works but PUT doesn't. This might be a server configuration issue.`
        )
      } else {
        setError(
          `PUT returned unexpected response:\n\n` +
          `Status: ${putResponse.status}\n` +
          `Message: ${putData.message || "Unknown error"}`
        )
      }
    } catch (err) {
      console.error("Backend connection test failed:", err)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      setError(
        `Backend connection failed!\n\n` +
        `Error: ${err instanceof Error ? err.message : "Unknown error"}\n\n` +
        `Trying to reach: ${apiUrl}\n\n` +
        `Please ensure:\n` +
        `1. Laragon Apache server is running\n` +
        `2. Backend URL is correct: ${apiUrl}\n` +
        `3. No firewall is blocking the connection\n\n` +
        `Check browser console (F12) for more details.`
      )
    }
  }


  return (
    <div className="space-y-6">
      {/* Profile Picture Section */}
      <DashboardProfileCard />

      {/* Account Settings Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Account Settings</h2>
          {lastUpdated && !hasUnsavedChanges && (
            <p className="text-xs text-neutral-500 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
          {hasUnsavedChanges && (
            <p className="text-xs text-orange-600 font-semibold mt-1 flex items-center gap-1">
              ⚠️ You have unsaved changes
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {!editingSettings && !loading && (
            <>
              <Button 
                onClick={testBackendConnection} 
                variant="outline" 
                size="sm"
                title="Test if backend server is reachable"
              >
                🔗 Test Connection
              </Button>
              <Button 
                onClick={handleManualRefresh} 
                variant="outline" 
                size="sm"
                disabled={hasUnsavedChanges}
                title="Refresh settings from server"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button onClick={() => setEditingSettings(true)} variant="outline">
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Settings
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="p-4 bg-red-50 border border-red-200">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-900 text-sm font-semibold">Error</p>
              <p className="text-red-800 text-sm whitespace-pre-wrap mt-1">{error}</p>
              {error.includes("Failed to fetch") && (
                <Button
                  onClick={testBackendConnection}
                  variant="outline"
                  size="sm"
                  className="mt-3 text-xs border-red-300"
                >
                  🔗 Try Test Connection
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Success Alert */}
      {success && (
        <Card className="p-4 bg-green-50 border border-green-200">
          <div className="flex gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800 text-sm font-semibold">{success}</p>
          </div>
        </Card>
      )}

      {/* Loading State */}
      {loading ? (
        <Card className="p-12 text-center">
          <Loader className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-600" />
          <p className="text-neutral-600">Loading settings...</p>
          <p className="text-xs text-neutral-500 mt-2">If this takes longer than 5 seconds, there might be a connection issue.</p>
        </Card>
      ) : editingSettings ? (
        <Card className="p-8">
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-600">Personal Information *</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold mb-2 block">Full Name *</Label>
                  <Input 
                    value={settingsData.fullName} 
                    onChange={(e) => handleSettingsChange("fullName", e.target.value)} 
                    placeholder="John Designer"
                    className={fieldErrors.fullName ? "border-red-500" : ""}
                  />
                  {fieldErrors.fullName && <p className="text-xs text-red-600 mt-1">{fieldErrors.fullName}</p>}
                </div>
                <div>
                  <Label className="font-semibold mb-2 block">Email Address *</Label>
                  <Input 
                    type="email" 
                    value={settingsData.email} 
                    onChange={(e) => handleSettingsChange("email", e.target.value)} 
                    placeholder="john@example.com"
                    className={fieldErrors.email ? "border-red-500" : ""}
                  />
                  {fieldErrors.email && <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>}
                </div>
                <div>
                  <Label className="font-semibold mb-2 block">Phone Number</Label>
                  <Input 
                    value={settingsData.phone} 
                    onChange={(e) => handleSettingsChange("phone", e.target.value)} 
                    placeholder="+1 (555) 123-4567"
                    className={fieldErrors.phone ? "border-red-500" : ""}
                  />
                  {fieldErrors.phone && <p className="text-xs text-red-600 mt-1">{fieldErrors.phone}</p>}
                </div>
                <div>
                  <Label className="font-semibold mb-2 block">Mailing Address</Label>
                  <Input value={settingsData.mailingAddress} onChange={(e) => handleSettingsChange("mailingAddress", e.target.value)} placeholder="123 Fashion St, New York, NY 10001" />
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-600">Business Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold mb-2 block">Business Name</Label>
                  <Input value={settingsData.businessName} onChange={(e) => handleSettingsChange("businessName", e.target.value)} placeholder="Arturo's Brick & Masonry LLC" />
                </div>
                <div>
                  <Label className="font-semibold mb-2 block">EIN Number</Label>
                  <Input value={settingsData.einNumber || ""} onChange={(e) => handleSettingsChange("einNumber", e.target.value)} placeholder="12-3456789" />
                </div>
                <div className="md:col-span-2">
                  <Label className="font-semibold mb-2 block">About Your Business</Label>
                  <textarea 
                    value={settingsData.about || ""} 
                    onChange={(e) => handleSettingsChange("about", e.target.value)} 
                    placeholder="Tell us about your business, your story, and what makes you unique..."
                    rows={4}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Share your brand story and what makes your business unique</p>
                </div>
                <div>
                  <Label className="font-semibold mb-2 block">Business Registration Number</Label>
                  <Input value={settingsData.businessRegistrationNumber || ""} onChange={(e) => handleSettingsChange("businessRegistrationNumber", e.target.value)} placeholder="For non-U.S. based companies" />
                </div>
                <div>
                  <Label className="font-semibold mb-2 block">Brand Name</Label>
                  <Input value={settingsData.brandName || ""} onChange={(e) => handleSettingsChange("brandName", e.target.value)} placeholder="Designer Creations" />
                </div>
                <div>
                  <Label className="font-semibold mb-2 block">Website</Label>
                  <Input 
                    value={settingsData.website || ""} 
                    onChange={(e) => handleSettingsChange("website", e.target.value)} 
                    placeholder="https://www.designercreations.com"
                    className={fieldErrors.website ? "border-red-500" : ""}
                  />
                  {fieldErrors.website && <p className="text-xs text-red-600 mt-1">{fieldErrors.website}</p>}
                </div>
                <div>
                  <Label className="font-semibold mb-2 block">Job Title *</Label>
                  <select value={settingsData.jobTitle || ""} onChange={(e) => handleSettingsChange("jobTitle", e.target.value)} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select a job title</option>
                    <option value="ceo">CEO</option>
                    <option value="coo">COO</option>
                    <option value="cto">CTO</option>
                    <option value="business-owner">Business Owner</option>
                    <option value="president">President</option>
                    <option value="senior-management">Senior Management</option>
                    <option value="fashion-designer">Fashion Designer</option>
                    <option value="graphic-designer">Graphic Designer</option>
                    <option value="photographer">Photographer</option>
                    <option value="seamstress">Seamstress</option>
                    <option value="pattern-maker">Pattern Maker</option>
                    <option value="technical-designer">Technical Designer</option>
                    <option value="cad-designer">CAD Designer</option>
                    <option value="model">Model</option>
                    <option value="screen-printer">Screen Printer</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-600">Social Links (Optional)</h3>
              <div className="space-y-3">
                {socialLinks.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <Input value={link} onChange={(e) => {
                        const newLinks = [...socialLinks]
                        newLinks[index] = e.target.value
                        setSocialLinks(newLinks)
                      }} placeholder="https://instagram.com/yourprofile" />
                    {socialLinks.filter((l) => l).length > 1 && (
                      <Button
                        onClick={() => {
                          setSocialLinks(socialLinks.filter((_, i) => i !== index))
                        }}
                        variant="outline"
                        className="text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {socialLinks.length < 5 && (
                  <Button onClick={() => setSocialLinks([...socialLinks, ""])} variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Social Link
                  </Button>
                )}
              </div>
            </div>

            {/* Banking Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-600">Banking Information (Encrypted) *</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">🔒 Your banking information will be encrypted and securely stored.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold mb-2 block">Bank Routing Number *</Label>
                  <Input type="password" value={settingsData.bankRoutingNumber || ""} onChange={(e) => handleSettingsChange("bankRoutingNumber", e.target.value)} placeholder="Enter your bank routing number" />
                </div>
                <div>
                  <Label className="font-semibold mb-2 block">Bank Account Number *</Label>
                  <Input type="password" value={settingsData.bankAccountNumber || ""} onChange={(e) => handleSettingsChange("bankAccountNumber", e.target.value)} placeholder="Enter your bank account number" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t">
              <Button onClick={handleSaveSettings} className="flex-1" disabled={saving}>
                {saving ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button onClick={handleDiscardChanges} variant="outline" className="flex-1" disabled={saving}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Personal Information</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-neutral-600">Full Name</p>
                <p className="font-semibold">{settingsData.fullName}</p>
              </div>
              <div>
                <p className="text-neutral-600">Email Address</p>
                <p className="font-semibold">{settingsData.email}</p>
              </div>
              <div>
                <p className="text-neutral-600">Phone Number</p>
                <p className="font-semibold">{settingsData.phone}</p>
              </div>
              <div>
                <p className="text-neutral-600">Mailing Address</p>
                <p className="font-semibold">{settingsData.mailingAddress}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Business Information</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-neutral-600">Business Name</p>
                <p className="font-semibold">{settingsData.businessName || "—"}</p>
              </div>
              <div>
                <p className="text-neutral-600">Brand Name</p>
                <p className="font-semibold">{settingsData.brandName || "—"}</p>
              </div>
              <div>
                <p className="text-neutral-600">Job Title</p>
                <p className="font-semibold capitalize">{(settingsData.jobTitle || "").replace("-", " ")}</p>
              </div>
              <div>
                <p className="text-neutral-600">Website</p>
                <p className="font-semibold">{settingsData.website || "—"}</p>
              </div>
              {settingsData.about && (
                <div>
                  <p className="text-neutral-600">About Your Business</p>
                  <p className="font-semibold whitespace-pre-wrap leading-relaxed">{settingsData.about}</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Social Links</h3>
            <div className="space-y-2 text-sm">
              {socialLinks.filter((l) => l).length > 0 ? (
                socialLinks.map((link, index) =>
                  link ? (
                    <div key={index}>
                      <p className="text-neutral-600">Link {index + 1}</p>
                      <a href={link} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">
                        {link}
                      </a>
                    </div>
                  ) : null
                )
              ) : (
                <p className="text-neutral-600">No social links added</p>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Business Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-neutral-600">EIN Number</p>
                <p className="font-semibold">{settingsData.einNumber || "—"}</p>
              </div>
              <div>
                <p className="text-neutral-600">Business Registration Number</p>
                <p className="font-semibold">{settingsData.businessRegistrationNumber || "—"}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* API Diagnostics Section - for troubleshooting */}
      <Card className="p-0 border-0 shadow-none">
        <button
          onClick={() => setShowDiagnostics(!showDiagnostics)}
          className="w-full p-6 flex items-center justify-between hover:bg-neutral-50 rounded-lg border transition-colors"
        >
          <span className="font-semibold text-neutral-700">Profile Picture Upload Issues? 🔧</span>
          <ChevronDown
            className={`w-5 h-5 text-neutral-600 transition-transform ${showDiagnostics ? "rotate-180" : ""}`}
          />
        </button>
        {showDiagnostics && (
          <div className="px-6 pb-6 border-t border-neutral-200">
            <ApiDiagnosticsPanel />
          </div>
        )}
      </Card>
    </div>
  )
}
