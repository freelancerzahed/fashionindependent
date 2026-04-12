"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, Trash2, CheckCircle, AlertCircle, Loader2, RefreshCw } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { BACKEND_URL } from "@/config"

interface Document {
  id: number
  type: string
  fileName: string
  fileSize: number
  mimeType: string
  status: string
  uploadedAt: string
  filePath: string
}

export function DocumentsSection() {
  const { token } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("checklist")
  const [documents, setDocuments] = useState<{ [key: string]: Document | null }>({
    checklist: null,
    id_front: null,
    id_back: null,
    partnership_agreement: null,
    tech_pack: null,
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [techPackOption, setTechPackOption] = useState<"one" | "three" | "five">("one")
  const [verificationChecklist, setVerificationChecklist] = useState<any[]>([])
  const [verificationLoading, setVerificationLoading] = useState(true)
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const [verificationError, setVerificationError] = useState("")
  const [verificationRetryCount, setVerificationRetryCount] = useState(0)
  const [verificationRetryIn, setVerificationRetryIn] = useState(0)

  // Fetch documents with useCallback to prevent infinite loops
  const fetchDocuments = useCallback(async (showLoading = true) => {
    if (!token) return

    if (showLoading) setLoading(true)
    setError("")
    try {
      console.log("[Documents] Fetching with token:", token.substring(0, 20) + "...")
      
      const response = await fetch(`${BACKEND_URL}/creator/documents`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("[Documents] Response status:", response.status)
      
      if (!response.ok) {
        let errorMessage = `API Error ${response.status}: ${response.statusText}`
        try {
          const contentType = response.headers.get("content-type")
          if (contentType?.includes("application/json")) {
            const errorData = await response.json()
            console.error("[Documents] Error response:", errorData)
            errorMessage = errorData.message || errorMessage
          } else {
            const text = await response.text()
            console.error("[Documents] Error response text:", text)
          }
        } catch (e) {
          console.error("[Documents] Error parsing error response:", e)
        }
        throw new Error(errorMessage)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType?.includes("application/json")) {
        throw new Error(`Invalid response type. Expected JSON, got: ${contentType}`)
      }
      
      const data = await response.json()
      console.log("[Documents] Response data:", data)
      
      if (data.status && data.documents) {
        const documentMap: { tech_pack: Document | null; id_front: Document | null; id_back: Document | null } = {
          tech_pack: null,
          id_front: null,
          id_back: null,
        }
        data.documents.forEach((doc: Document) => {
          documentMap[doc.type as keyof typeof documentMap] = doc
        })
        setDocuments(documentMap)
        setLastUpdated(new Date())
        console.log("[Documents] Loaded documents successfully")
      } else {
        console.warn("[Documents] Unexpected response format:", data)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      console.error("[Documents] Error fetching documents:", errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [token])

  // Fetch verification checklist
  const fetchVerificationChecklist = useCallback(async () => {
    if (!token) return

    setVerificationLoading(true)
    setVerificationError("")
    setVerificationRetryIn(0)
    try {
      const response = await fetch(`${BACKEND_URL}/creator/verification/checklist`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorMsg = `Failed to fetch verification: ${response.status}`
        console.warn("[Verification]", errorMsg)
        setVerificationError(errorMsg)
        setVerificationLoading(false)
        
        // Auto-retry after 10 seconds
        setVerificationRetryIn(10)
        const retryTimer = setInterval(() => {
          setVerificationRetryIn((prev) => {
            if (prev <= 1) {
              clearInterval(retryTimer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
        
        return
      }

      const data = await response.json()
      setVerificationError("")
      setVerificationRetryCount(0)
      if (data.status && data.checklist) {
        setVerificationChecklist(data.checklist)
        setCompletionPercentage(data.completionPercentage || 0)
        console.log("[Verification] Checklist loaded:", data.checklist)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      console.warn("[Verification] Error fetching checklist:", errorMsg)
      setVerificationError(errorMsg)
      setVerificationLoading(false)
      
      // Auto-retry after 10 seconds
      setVerificationRetryIn(10)
      const retryTimer = setInterval(() => {
        setVerificationRetryIn((prev) => {
          if (prev <= 1) {
            clearInterval(retryTimer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } finally {
      setVerificationLoading(false)
    }
  }, [token])

  // Auto-retry when timer reaches 0
  useEffect(() => {
    if (verificationRetryIn === 0 && verificationError) {
      setVerificationRetryCount((prev) => {
        const newCount = prev + 1
        if (newCount <= 3) {
          // Auto-retry up to 3 times
          fetchVerificationChecklist()
        }
        return newCount
      })
    }
  }, [verificationRetryIn, verificationError, fetchVerificationChecklist])

  // Initial fetch on mount
  useEffect(() => {
    if (token) {
      fetchVerificationChecklist()
    }
  }, [fetchVerificationChecklist, token])

  // Auto-refresh verification every 60 seconds
  useEffect(() => {
    let isMounted = true
    let refreshTimer: NodeJS.Timeout

    const autoRefresh = () => {
      if (isMounted) {
        fetchVerificationChecklist()
      }
    }

    refreshTimer = setInterval(autoRefresh, 60000) // 60 seconds

    return () => {
      isMounted = false
      clearInterval(refreshTimer)
    }
  }, [fetchVerificationChecklist])

  // Initial fetch on mount
  useEffect(() => {
    if (token) {
      fetchDocuments(true)
    }
  }, [fetchDocuments, token])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    let isMounted = true
    let refreshTimer: NodeJS.Timeout

    const autoRefresh = () => {
      if (isMounted && !uploading) {
        fetchDocuments(false)
      }
    }

    refreshTimer = setInterval(autoRefresh, 30000) // 30 seconds

    return () => {
      isMounted = false
      clearInterval(refreshTimer)
    }
  }, [fetchDocuments, uploading])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: "Tech_pack" | "id_front" | "id_back" | "partnership_agreement" | "checklist") => {
    const file = e.target.files?.[0]
    if (!file || !token) return

    setUploading(true)
    setError("")
    setSuccessMessage("")

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("document_type", docType)

      console.log("[Documents] Uploading:", { fileName: file.name, docType, size: file.size })

      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      }

      const response = await fetch(`${BACKEND_URL}/creator/documents/upload`, {
        method: "POST",
        headers,
        body: formData,
      })

      console.log("[Documents] Upload response status:", response.status)

      const contentType = response.headers.get("content-type")
      if (!contentType?.includes("application/json")) {
        const text = await response.text()
        console.error("[Documents] Invalid response type:", contentType, text)
        throw new Error(`Invalid response type. Expected JSON, got: ${contentType}`)
      }

      const data = await response.json()
      console.log("[Documents] Upload response data:", data)

      if (!response.ok || !data.status) {
        const errorMsg = data.message || data.error || "Upload failed"
        throw new Error(errorMsg)
      }

      setDocuments((prev) => ({
        ...prev,
        [docType]: data.document,
      }))
      setLastUpdated(new Date())
      setSuccessMessage(`${file.name} uploaded successfully!`)
      setTimeout(() => setSuccessMessage(""), 3000)
      console.log("[Documents] Upload successful")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      console.error("[Documents] Error uploading document:", errorMessage)
      setError(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteDocument = async (docType: "tech_pack" | "id_front" | "id_back" | "partnership_agreement" | "checklist") => {
    if (!token) return

    setError("")
    setSuccessMessage("")

    try {
      console.log("[Documents] Deleting:", docType)

      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }

      const response = await fetch(`${BACKEND_URL}/creator/documents/type/${docType}`, {
        method: "DELETE",
        headers,
      })

      console.log("[Documents] Delete response status:", response.status)

      const data = await response.json()
      console.log("[Documents] Delete response data:", data)

      if (!response.ok || !data.status) {
        const errorMsg = data.message || data.error || "Delete failed"
        throw new Error(errorMsg)
      }

      setDocuments((prev) => ({
        ...prev,
        [docType]: null,
      }))
      setLastUpdated(new Date())
      setSuccessMessage("Document deleted successfully!")
      setTimeout(() => setSuccessMessage(""), 3000)
      console.log("[Documents] Delete successful")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      console.error("[Documents] Error deleting document:", errorMessage)
      setError(errorMessage)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
  }

  if (loading && Object.values(documents).every(doc => doc === null)) {
    return (
      <Card className="p-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="text-neutral-600">Loading documents...</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Card className="p-4 border border-red-200 bg-red-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button
              onClick={() => fetchDocuments(true)}
              className="text-sm font-medium text-red-600 hover:text-red-700 whitespace-nowrap"
            >
              Retry
            </button>
          </div>
        </Card>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-900">Success</p>
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Documents Management</h3>
          {lastUpdated && (
            <p className="text-xs text-neutral-500 mt-1">Last updated: {lastUpdated.toLocaleTimeString()}</p>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2" 
          onClick={() => fetchDocuments(true)} 
          disabled={loading || uploading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-8 overflow-x-auto">
          {[
            { id: "checklist", label: "Checklist" },
            { id: "id-verification", label: "ID Verification" },
            { id: "partnership-agreement", label: "Partnership Agreement" },
            { id: "tech-pack", label: "Tech Pack" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 border-b-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Checklist Tab */}
      {activeTab === "checklist" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Creator Checklist</h2>
            <p className="text-muted-foreground text-lg">Complete all required steps to launch your campaigns</p>
          </div>

          {/* Verification Status Banner */}
          {!verificationLoading && (
            <Card
              className={`p-4 border-l-4 ${
                verificationError
                  ? "border-l-red-600 bg-red-50 border-red-200"
                  : completionPercentage === 100
                  ? "border-l-green-600 bg-green-50 border-green-200"
                  : "border-l-blue-600 bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex items-center gap-3 justify-between">
                {verificationError ? (
                  <>
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-red-900">Verification Failed</p>
                        <p className="text-sm text-red-700 mt-1">
                          Unable to load verification status. Try refreshing or check your connection.
                        </p>
                        {verificationRetryIn > 0 && (
                          <p className="text-xs text-red-600 mt-2">
                            Retrying automatically in {verificationRetryIn}s... (Attempt {verificationRetryCount}/3)
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={fetchVerificationChecklist}
                      className="flex-shrink-0 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium whitespace-nowrap ml-4"
                    >
                      Try Again
                    </button>
                  </>
                ) : completionPercentage === 100 ? (
                  <>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-green-900">Verification Successful</p>
                        <p className="text-sm text-green-700">All requirements have been verified. You're all set!</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-6 h-6 text-blue-600 flex-shrink-0 animate-spin" />
                      <div>
                        <p className="font-semibold text-blue-900">Verification In Progress</p>
                        <p className="text-sm text-blue-700">
                          {completionPercentage === 0
                            ? "Complete all steps below to finish verification."
                            : `${Math.round(completionPercentage)}% complete. Keep going!`}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>
          )}

          <Card className="p-8">
            {verificationLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                  <p className="text-muted-foreground">Loading verification status...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Progress Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-sm">
                      Completion: {verificationChecklist.filter((item) => item.completed).length} of {verificationChecklist.length}
                    </span>
                    <span className="text-sm text-muted-foreground text-right">
                      {Math.round(completionPercentage)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-green-600 h-full transition-all duration-300"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Verification Items */}
                <div className="space-y-3">
                  {verificationChecklist.map((item, index) => (
                    <div
                      key={item.id}
                      className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                        item.completed
                          ? "border-green-200 bg-green-50"
                          : "border-yellow-200 bg-yellow-50"
                      }`}
                    >
                      {item.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-yellow-500 flex items-center justify-center text-yellow-600 font-semibold text-xs flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className={`font-semibold ${item.completed ? "text-green-900" : "text-yellow-900"}`}>
                          {item.name}
                        </p>
                        <p className="text-sm text-neutral-600 mt-1">{item.description}</p>
                        {item.completed && item.completedAt && (
                          <p className="text-xs text-green-700 mt-2">
                            ✓ Completed on {new Date(item.completedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Last Updated */}
                {verificationChecklist.length > 0 && (
                  <div className="flex items-center justify-center pt-4 border-t gap-2">
                    <p className="text-xs text-muted-foreground">Last updated: just now</p>
                    <button
                      onClick={fetchVerificationChecklist}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Refresh
                    </button>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}

      
      {activeTab === "tech-pack" && (
        <div className="space-y-8">
          {/* Header Section */}
          <div>
            <h2 className="text-3xl font-bold mb-2">Tech Pack Upload</h2>
            <p className="text-muted-foreground text-lg">Upload your factory-ready tech pack to get started</p>
          </div>

          {/* Main Upload Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Area */}
            <Card className="p-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Upload Your Tech Pack</h3>
                <p className="text-sm text-muted-foreground">
                  Upload a clear .pdf file or high-quality image of your tech pack
                </p>

                {!documents.tech_pack ? (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors">
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="font-medium text-foreground mb-2">Drag and drop your file here</p>
                    <p className="text-sm text-muted-foreground mb-4">or</p>
                    <input
                      type="file"
                      id="techPack"
                      onChange={(e) => handleFileUpload(e, "tech_pack")}
                      className="hidden"
                      accept=".pdf,image/*"
                      disabled={uploading}
                    />
                    <Button
                      onClick={() => document.getElementById("techPack")?.click()}
                      disabled={uploading}
                      className="cursor-pointer"
                    >
                      {uploading ? "Uploading..." : "Choose File"}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4">PDF or JPG, PNG up to 10MB</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-blue-900">File uploaded</p>
                        <p className="text-sm text-blue-700">{documents.tech_pack.fileName}</p>
                        <p className="text-xs text-blue-600 mt-1">{formatFileSize(documents.tech_pack.fileSize)}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDeleteDocument("tech_pack")}
                      variant="outline"
                      className="w-full text-red-600 hover:text-red-700"
                      disabled={uploading}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove File
                    </Button>
                    <input
                      type="file"
                      id="techPackReplace"
                      onChange={(e) => handleFileUpload(e, "tech_pack")}
                      className="hidden"
                      accept=".pdf,image/*"
                      disabled={uploading}
                    />
                    <label htmlFor="techPackReplace">
                      <Button variant="outline" className="w-full cursor-pointer" disabled={uploading}>
                        Replace File
                      </Button>
                    </label>
                  </div>
                )}
              </div>
            </Card>

            {/* Pricing Section */}
            <Card className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Tech Pack Pricing</h3>
                  <p className="text-sm text-muted-foreground">
                    Don't have a tech pack? Purchase one at 10% discount below
                  </p>
                </div>

                {/* Pricing Options */}
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
                    <input type="radio" name="techPackOption" value="one" checked={techPackOption === "one"} onChange={() => setTechPackOption("one")} className="w-5 h-5" />
                    <div className="ml-4 flex-1">
                      <p className="font-semibold">One Tech Pack</p>
                      <p className="text-sm text-muted-foreground">Single tech pack</p>
                    </div>
                    <p className="text-lg font-bold">$68.00</p>
                  </label>

                  <label className="flex items-center p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
                    <input type="radio" name="techPackOption" value="three" checked={techPackOption === "three"} onChange={() => setTechPackOption("three")} className="w-5 h-5" />
                    <div className="ml-4 flex-1">
                      <p className="font-semibold">Three Tech Packs</p>
                      <p className="text-sm text-muted-foreground">Save 8%</p>
                    </div>
                    <p className="text-lg font-bold">$188.00</p>
                  </label>

                  <label className="flex items-center p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors bg-blue-50 border-blue-300">
                    <input type="radio" name="techPackOption" value="five" checked={techPackOption === "five"} onChange={() => setTechPackOption("five")} className="w-5 h-5" />
                    <div className="ml-4 flex-1">
                      <p className="font-semibold">Five Tech Packs</p>
                      <p className="text-sm text-muted-foreground">Save 15% (Best Value)</p>
                    </div>
                    <p className="text-lg font-bold">$324.00</p>
                  </label>
                </div>

                {/* Buy Button */}
                <Button 
                  onClick={() => {
                    router.push(`/checkout?productType=techpack&packType=${techPackOption}`)
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 font-semibold text-base"
                >
                  Buy Now
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Cost will be deducted from your campaign earnings at the end of your campaign
                </p>
              </div>
            </Card>
          </div>

          {/* Info Box */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex gap-4">
              <div className="text-blue-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-blue-900 mb-1">What is a Tech Pack?</p>
                <p className="text-sm text-blue-800">
                  A tech pack is a comprehensive document containing design specifications, measurements, material details, and production instructions for manufacturers.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ID Verification Tab */}
      {activeTab === "id-verification" && (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">ID Verification</h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              Upload clear pictures of your personal identification. Business owners providing a Business Name and EIN (or equivalent business registration number for non-U.S. based entities) do not need to upload personal identification.
            </p>
            <p className="text-neutral-700">
              <Link href="#" className="text-neutral-800 hover:underline">[View acceptable forms of ID]</Link>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ID Front */}
            <Card className="p-6">
              <h4 className="font-semibold mb-1">ID - Front Side</h4>
              <p className="text-sm text-muted-foreground mb-4">Upload a clear photo of the front of your ID</p>

              {!documents.id_front ? (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">Drag and drop or click to upload</p>
                  <input
                    type="file"
                    id="idFront"
                    onChange={(e) => handleFileUpload(e, "id_front")}
                    className="hidden"
                    accept="image/*"
                    disabled={uploading}
                  />
                  <Button
                    onClick={() => document.getElementById("idFront")?.click()}
                    variant="outline"
                    className="w-full cursor-pointer"
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Choose File"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900">Uploaded</p>
                      <p className="text-sm text-green-700">{documents.id_front.fileName}</p>
                      <p className="text-xs text-green-600 mt-1">{formatFileSize(documents.id_front.fileSize)}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDeleteDocument("id_front")}
                    variant="outline"
                    className="w-full text-red-600 hover:text-red-700"
                    disabled={uploading}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              )}
            </Card>

            {/* ID Back */}
            <Card className="p-6">
              <h4 className="font-semibold mb-1">ID - Back Side</h4>
              <p className="text-sm text-muted-foreground mb-4">Upload a clear photo of the back of your ID</p>

              {!documents.id_back ? (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">Drag and drop or click to upload</p>
                  <input
                    type="file"
                    id="idBack"
                    onChange={(e) => handleFileUpload(e, "id_back")}
                    className="hidden"
                    accept="image/*"
                    disabled={uploading}
                  />
                  <Button
                    onClick={() => document.getElementById("idBack")?.click()}
                    variant="outline"
                    className="w-full cursor-pointer"
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Choose File"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900">Uploaded</p>
                      <p className="text-sm text-green-700">{documents.id_back.fileName}</p>
                      <p className="text-xs text-green-600 mt-1">{formatFileSize(documents.id_back.fileSize)}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDeleteDocument("id_back")}
                    variant="outline"
                    className="w-full text-red-600 hover:text-red-700"
                    disabled={uploading}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* Partnership Agreement Tab */}
      {activeTab === "partnership-agreement" && (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Partnership Agreement</h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              Review and sign the creator partnership agreement. This agreement outlines the terms and conditions for using our platform.
            </p>
          </div>

          <Card className="p-8 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Partnership Agreement Document</h3>
              <p className="text-sm text-neutral-600 mb-6">
                Please carefully review the partnership agreement before signing. You can download a copy for your records.
              </p>

              {!documents.partnership_agreement ? (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">Upload signed agreement</p>
                  <input
                    type="file"
                    id="partnershipAgreement"
                    onChange={(e) => handleFileUpload(e, "partnership_agreement")}
                    className="hidden"
                    accept=".pdf,image/*"
                    disabled={uploading}
                  />
                  <Button
                    onClick={() => document.getElementById("partnershipAgreement")?.click()}
                    variant="outline"
                    className="cursor-pointer"
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Choose File"}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">PDF or JPG, PNG up to 10MB</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-green-900">Signed Agreement Uploaded</p>
                      <p className="text-sm text-green-700">{documents.partnership_agreement.fileName}</p>
                      <p className="text-xs text-green-600 mt-1">{formatFileSize(documents.partnership_agreement.fileSize)}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDeleteDocument("partnership_agreement")}
                    variant="outline"
                    className="w-full text-red-600 hover:text-red-700"
                    disabled={uploading}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove File
                  </Button>
                  <input
                    type="file"
                    id="partnershipAgreementReplace"
                    onChange={(e) => handleFileUpload(e, "partnership_agreement")}
                    className="hidden"
                    accept=".pdf,image/*"
                    disabled={uploading}
                  />
                  <label htmlFor="partnershipAgreementReplace">
                    <Button variant="outline" className="w-full cursor-pointer" disabled={uploading}>
                      Replace File
                    </Button>
                  </label>
                </div>
              )}
            </div>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex gap-4">
                <div className="text-blue-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-blue-900 mb-1">Important</p>
                  <p className="text-sm text-blue-800">
                    By uploading a signed agreement, you confirm that you have read, understood, and agree to all terms and conditions outlined in the partnership agreement.
                  </p>
                </div>
              </div>
            </Card>
          </Card>
        </div>
      )}
    </div>
  )
}
