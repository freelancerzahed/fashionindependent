"use client"

import type React from "react"

import { useState } from "react"
import {
  Users,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Target,
  TrendingUp,
  MapPin,
  Heart,
  Calendar,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

interface Audience {
  id: string
  name: string
  description: string
  size: number
  type: "demographic" | "interest" | "custom" | "lookalike"
  status: "active" | "inactive"
  createdDate: string
  lastUsed: string
  campaigns: string[]
  targeting: {
    ageRange: string
    gender: string[]
    location: string[]
    interests: string[]
    behaviors: string[]
  }
}

interface AudienceInsight {
  metric: string
  value: string
  change: number
  icon: React.ReactNode
}

export default function AudiencesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newAudience, setNewAudience] = useState({
    name: "",
    description: "",
    type: "demographic",
    ageRange: "",
    gender: [] as string[],
    location: [] as string[],
    interests: [] as string[],
    behaviors: [] as string[],
  })

  const audiences: Audience[] = [
    {
      id: "1",
      name: "Fashion Enthusiasts 18-35",
      description: "Young adults interested in fashion and lifestyle trends",
      size: 2500000,
      type: "demographic",
      status: "active",
      createdDate: "2024-06-15",
      lastUsed: "2024-07-20",
      campaigns: ["Summer Fashion Collection 2024", "Back to School Promotion"],
      targeting: {
        ageRange: "18-35",
        gender: ["Female", "Male"],
        location: ["United States", "Canada"],
        interests: ["Fashion", "Shopping", "Lifestyle"],
        behaviors: ["Online Shoppers", "Fashion Forward"],
      },
    },
    {
      id: "2",
      name: "College Students",
      description: "University students looking for affordable fashion",
      size: 850000,
      type: "interest",
      status: "active",
      createdDate: "2024-07-01",
      lastUsed: "2024-07-18",
      campaigns: ["Back to School Promotion"],
      targeting: {
        ageRange: "18-24",
        gender: ["Female", "Male"],
        location: ["United States"],
        interests: ["Education", "Student Life", "Budget Shopping"],
        behaviors: ["College Students", "Price Conscious"],
      },
    },
    {
      id: "3",
      name: "Previous Customers",
      description: "Customers who made purchases in the last 6 months",
      size: 45000,
      type: "custom",
      status: "active",
      createdDate: "2024-05-20",
      lastUsed: "2024-07-15",
      campaigns: ["Summer Fashion Collection 2024"],
      targeting: {
        ageRange: "All",
        gender: ["Female", "Male"],
        location: ["United States", "Canada", "United Kingdom"],
        interests: [],
        behaviors: ["Previous Customers"],
      },
    },
    {
      id: "4",
      name: "Lookalike - High Value Customers",
      description: "Similar to customers with highest lifetime value",
      size: 1200000,
      type: "lookalike",
      status: "inactive",
      createdDate: "2024-04-10",
      lastUsed: "2024-06-30",
      campaigns: [],
      targeting: {
        ageRange: "25-45",
        gender: ["Female", "Male"],
        location: ["United States"],
        interests: ["Premium Fashion", "Luxury Goods"],
        behaviors: ["High Value Shoppers"],
      },
    },
  ]

  const audienceInsights: AudienceInsight[] = [
    {
      metric: "Total Reach",
      value: "4.6M",
      change: 12.5,
      icon: <Users className="w-5 h-5" />,
    },
    {
      metric: "Active Audiences",
      value: "3",
      change: 0,
      icon: <Target className="w-5 h-5" />,
    },
    {
      metric: "Avg. Audience Size",
      value: "1.5M",
      change: 8.3,
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      metric: "Custom Audiences",
      value: "1",
      change: 0,
      icon: <Upload className="w-5 h-5" />,
    },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "demographic":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "interest":
        return "bg-green-100 text-green-800 border-green-200"
      case "custom":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "lookalike":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-gray-100 text-gray-800 border-gray-200"
  }

  const filteredAudiences = audiences.filter((audience) => {
    const matchesSearch = audience.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || audience.type === selectedType
    return matchesSearch && matchesType
  })

  const handleCreateAudience = () => {
    // Handle audience creation logic here
    setIsCreateOpen(false)
    setNewAudience({
      name: "",
      description: "",
      type: "demographic",
      ageRange: "",
      gender: [],
      location: [],
      interests: [],
      behaviors: [],
    })
  }

  const handleGenderChange = (gender: string, checked: boolean) => {
    if (checked) {
      setNewAudience((prev) => ({ ...prev, gender: [...prev.gender, gender] }))
    } else {
      setNewAudience((prev) => ({ ...prev, gender: prev.gender.filter((g) => g !== gender) }))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audience Management</h1>
          <p className="text-gray-600">Create and manage your target audiences</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary-600 hover:bg-primary-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Audience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Audience</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="audience-name">Audience Name *</Label>
                  <Input
                    id="audience-name"
                    value={newAudience.name}
                    onChange={(e) => setNewAudience((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter audience name"
                  />
                </div>
                <div>
                  <Label htmlFor="audience-description">Description</Label>
                  <Textarea
                    id="audience-description"
                    value={newAudience.description}
                    onChange={(e) => setNewAudience((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your target audience"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="audience-type">Audience Type *</Label>
                  <Select
                    value={newAudience.type}
                    onValueChange={(value) => setNewAudience((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="demographic">Demographic</SelectItem>
                      <SelectItem value="interest">Interest-based</SelectItem>
                      <SelectItem value="custom">Custom Audience</SelectItem>
                      <SelectItem value="lookalike">Lookalike Audience</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Demographics */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Demographics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age-range">Age Range</Label>
                    <Select
                      value={newAudience.ageRange}
                      onValueChange={(value) => setNewAudience((prev) => ({ ...prev, ageRange: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select age range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="18-24">18-24</SelectItem>
                        <SelectItem value="25-34">25-34</SelectItem>
                        <SelectItem value="35-44">35-44</SelectItem>
                        <SelectItem value="45-54">45-54</SelectItem>
                        <SelectItem value="55+">55+</SelectItem>
                        <SelectItem value="18-35">18-35</SelectItem>
                        <SelectItem value="25-45">25-45</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <div className="flex gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="male"
                          checked={newAudience.gender.includes("Male")}
                          onCheckedChange={(checked) => handleGenderChange("Male", checked as boolean)}
                        />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="female"
                          checked={newAudience.gender.includes("Female")}
                          onCheckedChange={(checked) => handleGenderChange("Female", checked as boolean)}
                        />
                        <Label htmlFor="female">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="all-genders"
                          checked={newAudience.gender.includes("All")}
                          onCheckedChange={(checked) => handleGenderChange("All", checked as boolean)}
                        />
                        <Label htmlFor="all-genders">All</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Location</h3>
                <div>
                  <Label htmlFor="location">Target Locations</Label>
                  <Input
                    id="location"
                    placeholder="Enter countries, states, or cities"
                    onChange={(e) =>
                      setNewAudience((prev) => ({ ...prev, location: e.target.value.split(",").map((l) => l.trim()) }))
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple locations with commas</p>
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Interests & Behaviors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="interests">Interests</Label>
                    <Input
                      id="interests"
                      placeholder="Fashion, Shopping, Lifestyle"
                      onChange={(e) =>
                        setNewAudience((prev) => ({
                          ...prev,
                          interests: e.target.value.split(",").map((i) => i.trim()),
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="behaviors">Behaviors</Label>
                    <Input
                      id="behaviors"
                      placeholder="Online Shoppers, Fashion Forward"
                      onChange={(e) =>
                        setNewAudience((prev) => ({
                          ...prev,
                          behaviors: e.target.value.split(",").map((b) => b.trim()),
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAudience} className="bg-primary-600 hover:bg-primary-700 text-white">
                  Create Audience
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {audienceInsights.map((insight, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary-100 rounded-lg text-primary-600">{insight.icon}</div>
                </div>
                {insight.change !== 0 && (
                  <div
                    className={`flex items-center gap-1 text-sm ${insight.change > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    {Math.abs(insight.change)}%
                  </div>
                )}
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">{insight.value}</h3>
                <p className="text-sm text-gray-600">{insight.metric}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search audiences..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="demographic">Demographic</SelectItem>
                  <SelectItem value="interest">Interest-based</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                  <SelectItem value="lookalike">Lookalike</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audiences List */}
      <div className="space-y-4">
        {filteredAudiences.map((audience) => (
          <Card key={audience.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{audience.name}</h3>
                    <Badge className={getTypeColor(audience.type)}>
                      {audience.type.charAt(0).toUpperCase() + audience.type.slice(1)}
                    </Badge>
                    <Badge className={getStatusColor(audience.status)}>
                      {audience.status.charAt(0).toUpperCase() + audience.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{audience.description}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {audience.size.toLocaleString()} people
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Created: {audience.createdDate}
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      Last used: {audience.lastUsed}
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Targeting Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Age Range</span>
                  </div>
                  <p className="text-sm text-gray-600">{audience.targeting.ageRange}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Gender</span>
                  </div>
                  <p className="text-sm text-gray-600">{audience.targeting.gender.join(", ")}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Location</span>
                  </div>
                  <p className="text-sm text-gray-600">{audience.targeting.location.slice(0, 2).join(", ")}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Interests</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {audience.targeting.interests.length > 0
                      ? audience.targeting.interests.slice(0, 2).join(", ")
                      : "Custom targeting"}
                  </p>
                </div>
              </div>

              {/* Used in Campaigns */}
              {audience.campaigns.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Used in campaigns:</span> {audience.campaigns.join(", ")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAudiences.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No audiences found</p>
            <p className="text-sm text-gray-400">Create your first audience to start targeting your ads</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
