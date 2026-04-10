"use client"

import { useState } from "react"
import { Plus, Search, MoreHorizontal, Play, Pause, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface Campaign {
  id: string
  name: string
  status: "active" | "paused" | "draft" | "completed"
  budget: number
  spent: number
  impressions: number
  clicks: number
  ctr: number
  startDate: string
  endDate: string
  objective: string
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Summer Fashion Collection 2024",
    status: "active",
    budget: 5000,
    spent: 2340,
    impressions: 125000,
    clicks: 3200,
    ctr: 2.56,
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    objective: "Brand Awareness",
  },
  {
    id: "2",
    name: "Back to School Promotion",
    status: "paused",
    budget: 3000,
    spent: 1200,
    impressions: 85000,
    clicks: 1800,
    ctr: 2.12,
    startDate: "2024-08-01",
    endDate: "2024-09-15",
    objective: "Conversions",
  },
  {
    id: "3",
    name: "Holiday Special Offers",
    status: "draft",
    budget: 8000,
    spent: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    startDate: "2024-12-01",
    endDate: "2024-12-31",
    objective: "Sales",
  },
]

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const handleToggleCampaign = (campaignId: string) => {
    setCampaigns((prev) =>
      prev.map((campaign) =>
        campaign.id === campaignId
          ? { ...campaign, status: campaign.status === "active" ? "paused" : "active" }
          : campaign,
      ),
    )
  }

  const handleDeleteCampaign = (campaignId: string) => {
    if (confirm("Are you sure you want to delete this campaign?")) {
      setCampaigns((prev) => prev.filter((campaign) => campaign.id !== campaignId))
    }
  }

  const handleEditCampaign = (campaignId: string) => {
    // Navigate to edit page or open modal
    console.log("Edit campaign:", campaignId)
    // In a real app: router.push(`/advertiser/campaigns/${campaignId}/edit`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "paused":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600">Manage your advertising campaigns</p>
        </div>
        <Link href="/advertiser/campaigns/create">
          <Button className="bg-primary-600 hover:bg-primary-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="draft">Draft</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Grid */}
      <div className="grid gap-6">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </Badge>
                    <span className="text-sm text-gray-600">{campaign.objective}</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditCampaign(campaign.id)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleCampaign(campaign.id)}>
                      {campaign.status === "active" ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Resume
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteCampaign(campaign.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="font-semibold">${campaign.budget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Spent</p>
                  <p className="font-semibold text-primary-600">${campaign.spent.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Impressions</p>
                  <p className="font-semibold">{campaign.impressions.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">CTR</p>
                  <p className="font-semibold">{campaign.ctr}%</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>
                    {campaign.startDate} - {campaign.endDate}
                  </span>
                  <span>{campaign.clicks.toLocaleString()} clicks</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No campaigns found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
