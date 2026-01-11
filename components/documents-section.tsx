"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, Trash2, CheckCircle } from "lucide-react"

export function DocumentsSection() {
  const [activeTab, setActiveTab] = useState("tech-pack")
  const [uploadedDocuments, setUploadedDocuments] = useState({
    idFront: null as File | null,
    idBack: null as File | null,
    techPack: null as File | null,
  })
  const [documentMessages, setDocumentMessages] = useState({
    idFront: "",
    idBack: "",
    techPack: "",
  })

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, docType: "idFront" | "idBack" | "techPack") => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedDocuments((prev) => ({
        ...prev,
        [docType]: file,
      }))
      setDocumentMessages((prev) => ({
        ...prev,
        [docType]: "Document successfully uploaded",
      }))
    }
  }

  const handleDeleteDocument = (docType: "idFront" | "idBack" | "techPack") => {
    setUploadedDocuments((prev) => ({
      ...prev,
      [docType]: null,
    }))
    setDocumentMessages((prev) => ({
      ...prev,
      [docType]: "",
    }))
  }

  const tabs = [
    { id: "tech-pack", label: "Tech Pack" },
    { id: "id-verification", label: "ID Verification" },
  ]

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-8">
          {tabs.map((tab) => (
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

      {/* Tech Pack Tab */}
      {activeTab === "tech-pack" && (
        <div className="space-y-8">
          {/* Header Section */}
          <div>
            <h2 className="text-3xl font-bold mb-2">Tech Pack Upload</h2>
            <p className="text-muted-foreground text-lg">Upload your factory-ready tech pack to get started</p>
          </div>

          {/* Success Message */}
          {documentMessages.techPack && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900">Document successfully uploaded</p>
                <p className="text-sm text-green-700">{uploadedDocuments.techPack?.name}</p>
              </div>
            </div>
          )}

          {/* Main Upload Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Area */}
            <Card className="p-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Upload Your Tech Pack</h3>
                <p className="text-sm text-muted-foreground">
                  Upload a clear .pdf file or high-quality image of your tech pack
                </p>

                {!uploadedDocuments.techPack ? (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="font-medium text-foreground mb-2">Drag and drop your file here</p>
                    <p className="text-sm text-muted-foreground mb-4">or</p>
                    <input
                      type="file"
                      id="techPack"
                      onChange={(e) => handleFileUpload(e, "techPack")}
                      className="hidden"
                      accept=".pdf,image/*"
                    />
                    <label htmlFor="techPack">
                      <Button className="cursor-pointer">Choose File</Button>
                    </label>
                    <p className="text-xs text-muted-foreground mt-4">PDF or JPG, PNG up to 10MB</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-blue-900">File uploaded</p>
                        <p className="text-sm text-blue-700">{uploadedDocuments.techPack?.name}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDeleteDocument("techPack")}
                      variant="outline"
                      className="w-full text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove File
                    </Button>
                    <input
                      type="file"
                      id="techPackReplace"
                      onChange={(e) => handleFileUpload(e, "techPack")}
                      className="hidden"
                      accept=".pdf,image/*"
                    />
                    <label htmlFor="techPackReplace">
                      <Button variant="outline" className="w-full cursor-pointer">
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
                    <input type="radio" name="techPackOption" value="one" defaultChecked className="w-5 h-5" />
                    <div className="ml-4 flex-1">
                      <p className="font-semibold">One Tech Pack</p>
                      <p className="text-sm text-muted-foreground">Single tech pack</p>
                    </div>
                    <p className="text-lg font-bold">$68.00</p>
                  </label>

                  <label className="flex items-center p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
                    <input type="radio" name="techPackOption" value="three" className="w-5 h-5" />
                    <div className="ml-4 flex-1">
                      <p className="font-semibold">Three Tech Packs</p>
                      <p className="text-sm text-muted-foreground">Save 8%</p>
                    </div>
                    <p className="text-lg font-bold">$188.00</p>
                  </label>

                  <label className="flex items-center p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors bg-blue-50 border-blue-300">
                    <input type="radio" name="techPackOption" value="five" className="w-5 h-5" />
                    <div className="ml-4 flex-1">
                      <p className="font-semibold">Five Tech Packs</p>
                      <p className="text-sm text-muted-foreground">Save 15% (Best Value)</p>
                    </div>
                    <p className="text-lg font-bold">$324.00</p>
                  </label>
                </div>

                {/* Buy Button */}
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 font-semibold text-base">
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

              {!uploadedDocuments.idFront ? (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">Drag and drop or click to upload</p>
                  <input
                    type="file"
                    id="idFront"
                    onChange={(e) => handleFileUpload(e, "idFront")}
                    className="hidden"
                    accept="image/*"
                  />
                  <label htmlFor="idFront">
                    <Button variant="outline" className="w-full cursor-pointer">
                      Choose File
                    </Button>
                  </label>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900">{documentMessages.idFront}</p>
                      <p className="text-sm text-green-700">{uploadedDocuments.idFront?.name}</p>
                    </div>
                  </div>
                  <Button onClick={() => handleDeleteDocument("idFront")} variant="outline" className="w-full text-red-600">
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

              {!uploadedDocuments.idBack ? (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">Drag and drop or click to upload</p>
                  <input
                    type="file"
                    id="idBack"
                    onChange={(e) => handleFileUpload(e, "idBack")}
                    className="hidden"
                    accept="image/*"
                  />
                  <label htmlFor="idBack">
                    <Button variant="outline" className="w-full cursor-pointer">
                      Choose File
                    </Button>
                  </label>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900">{documentMessages.idBack}</p>
                      <p className="text-sm text-green-700">{uploadedDocuments.idBack?.name}</p>
                    </div>
                  </div>
                  <Button onClick={() => handleDeleteDocument("idBack")} variant="outline" className="w-full text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
