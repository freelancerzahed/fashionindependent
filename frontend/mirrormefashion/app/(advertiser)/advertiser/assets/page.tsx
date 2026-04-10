"use client"

import { useState } from "react"
import {
  Upload,
  Search,
  Grid3X3,
  List,
  ImageIcon,
  Video,
  FileText,
  MoreHorizontal,
  Download,
  Edit,
  Trash2,
  Eye,
  Plus,
  Folder,
  FolderPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Asset {
  id: string
  name: string
  type: "image" | "video" | "document"
  size: string
  dimensions?: string
  uploadDate: string
  folderName: string
  url: string
  campaigns: string[]
  status: "active" | "archived"
}

interface AssetFolder {
  id: string
  name: string
  assetCount: number
  createdDate: string
}

export default function AssetsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFolder, setSelectedFolder] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")

  const folders: AssetFolder[] = [
    { id: "1", name: "Summer Campaign", assetCount: 24, createdDate: "2024-06-01" },
    { id: "2", name: "Product Photos", assetCount: 18, createdDate: "2024-05-15" },
    { id: "3", name: "Video Ads", assetCount: 8, createdDate: "2024-07-01" },
    { id: "4", name: "Brand Assets", assetCount: 12, createdDate: "2024-04-20" },
  ]

  const assets: Asset[] = [
    {
      id: "1",
      name: "summer-collection-hero.jpg",
      type: "image",
      size: "2.4 MB",
      dimensions: "1920x1080",
      uploadDate: "2024-07-15",
      folderName: "Summer Campaign",
      url: "/summer-fashion-hero.png",
      campaigns: ["Summer Fashion Collection 2024"],
      status: "active",
    },
    {
      id: "2",
      name: "product-showcase.mp4",
      type: "video",
      size: "15.2 MB",
      dimensions: "1080x1920",
      uploadDate: "2024-07-14",
      folderName: "Video Ads",
      url: "/product-showcase-thumbnail.png",
      campaigns: ["Back to School Promotion"],
      status: "active",
    },
    {
      id: "3",
      name: "brand-logo-white.png",
      type: "image",
      size: "156 KB",
      dimensions: "512x512",
      uploadDate: "2024-07-10",
      folderName: "Brand Assets",
      url: "/white-abstract-logo.png",
      campaigns: ["Summer Fashion Collection 2024", "Back to School Promotion"],
      status: "active",
    },
    {
      id: "4",
      name: "campaign-brief.pdf",
      type: "document",
      size: "1.8 MB",
      uploadDate: "2024-07-08",
      folderName: "Summer Campaign",
      url: "",
      campaigns: ["Summer Fashion Collection 2024"],
      status: "active",
    },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-4 h-4" />
      case "video":
        return <Video className="w-4 h-4" />
      case "document":
        return <FileText className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "image":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "video":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "document":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFolder = selectedFolder === "all" || asset.folderName === selectedFolder
    const matchesType = selectedType === "all" || asset.type === selectedType
    return matchesSearch && matchesFolder && matchesType
  })

  const handleCreateFolder = () => {
    // Handle folder creation logic here
    setIsCreateFolderOpen(false)
    setNewFolderName("")
  }

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      // Handle file upload logic here
      console.log("Uploading files:", Array.from(files))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Creative Assets</h1>
          <p className="text-gray-600">Manage your advertising creatives and media files</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FolderPlus className="w-4 h-4 mr-2" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="folder-name">Folder Name</Label>
                  <Input
                    id="folder-name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Enter folder name"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateFolderOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateFolder} className="bg-primary-600 hover:bg-primary-700 text-white">
                    Create Folder
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary-600 hover:bg-primary-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Upload Assets
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Upload Assets</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">Drag and drop files here</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*,.pdf,.doc,.docx"
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
                <div>
                  <Label htmlFor="upload-folder">Upload to Folder</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select folder" />
                    </SelectTrigger>
                    <SelectContent>
                      {folders.map((folder) => (
                        <SelectItem key={folder.id} value={folder.name}>
                          {folder.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Folders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="w-5 h-5" />
            Folders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {folders.map((folder) => (
              <div
                key={folder.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedFolder(folder.name)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
                    <Folder className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{folder.name}</h4>
                    <p className="text-sm text-gray-600">{folder.assetCount} assets</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Folders</SelectItem>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.name}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border border-gray-300 rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assets Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => (
            <Card key={asset.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  {asset.type === "image" || asset.type === "video" ? (
                    <img
                      src={asset.url || "/placeholder.svg"}
                      alt={asset.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-gray-900 text-sm truncate flex-1">{asset.name}</h4>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getTypeColor(asset.type)}>
                      {getTypeIcon(asset.type)} {asset.type}
                    </Badge>
                    <span className="text-xs text-gray-500">{asset.size}</span>
                  </div>
                  {asset.dimensions && <p className="text-xs text-gray-500">{asset.dimensions}</p>}
                  <p className="text-xs text-gray-500">Uploaded: {asset.uploadDate}</p>
                  {asset.campaigns.length > 0 && (
                    <div className="text-xs text-gray-500">
                      Used in: {asset.campaigns.slice(0, 1).join(", ")}
                      {asset.campaigns.length > 1 && ` +${asset.campaigns.length - 1} more`}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Size</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Folder</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Upload Date</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                            {getTypeIcon(asset.type)}
                          </div>
                          <span className="font-medium text-gray-900">{asset.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getTypeColor(asset.type)}>{asset.type}</Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{asset.size}</td>
                      <td className="py-3 px-4 text-gray-600">{asset.folderName}</td>
                      <td className="py-3 px-4 text-gray-600">{asset.uploadDate}</td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredAssets.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No assets found</p>
            <p className="text-sm text-gray-400">Upload your first creative assets to get started</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
