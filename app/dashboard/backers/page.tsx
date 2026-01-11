"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Users, TrendingUp, Award, Search, Filter } from "lucide-react"

export default function BackersPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock backer data
  const backers = [
    {
      id: 1,
      name: "Emma Studios",
      totalPledged: 450,
      campaigns: 2,
      joinDate: "2024-12-01",
      status: "active",
    },
    {
      id: 2,
      name: "Marcus Design",
      totalPledged: 1200,
      campaigns: 3,
      joinDate: "2024-11-15",
      status: "active",
    },
    {
      id: 3,
      name: "Joy Creations",
      totalPledged: 800,
      campaigns: 1,
      joinDate: "2024-10-20",
      status: "completed",
    },
    {
      id: 4,
      name: "Alex Threads",
      totalPledged: 350,
      campaigns: 1,
      joinDate: "2024-09-10",
      status: "active",
    },
  ]

  const tabs = [
    { id: "all", label: "All Backers", count: backers.length },
    { id: "active", label: "Active", count: backers.filter((b) => b.status === "active").length },
    { id: "completed", label: "Completed", count: backers.filter((b) => b.status === "completed").length },
  ]

  const filteredBackers = backers.filter((backer) => {
    const matchesTab = activeTab === "all" || backer.status === activeTab
    const matchesSearch = backer.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const totalRaised = backers.reduce((sum, b) => sum + b.totalPledged, 0)
  const totalBackers = backers.length

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Total Backers</p>
              <p className="text-3xl font-bold">{totalBackers}</p>
            </div>
            <Users className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Total Raised</p>
              <p className="text-3xl font-bold">${totalRaised}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Avg. Pledge</p>
              <p className="text-3xl font-bold">${Math.round(totalRaised / totalBackers)}</p>
            </div>
            <Award className="w-12 h-12 text-purple-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              placeholder="Search backers by name..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            More Filters
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-neutral-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {tab.label}
              <span className="ml-2 text-xs bg-neutral-100 px-2 py-1 rounded-full">{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Backers List */}
      <div className="space-y-4">
        {filteredBackers.length > 0 ? (
          filteredBackers.map((backer) => (
            <Card key={backer.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {backer.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{backer.name}</h3>
                      <p className="text-xs text-neutral-500">Joined {new Date(backer.joinDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    backer.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {backer.status === "active" ? "Active" : "Order Completed"}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 pb-4 border-b border-neutral-200">
                <div>
                  <p className="text-xs text-neutral-600 mb-1">Total Pledged</p>
                  <p className="font-bold text-lg">${backer.totalPledged}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 mb-1">Campaigns Backed</p>
                  <p className="font-bold text-lg">{backer.campaigns}</p>
                </div>
                <div className="md:col-span-1">
                  <p className="text-xs text-neutral-600 mb-1">Status</p>
                  <p className="font-bold text-lg capitalize">{backer.status}</p>
                </div>
              </div>

              {/* Message removed as requested */}

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  ⋮
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center border-2 border-dashed border-neutral-300 bg-neutral-50">
            <Users className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
            <p className="text-neutral-600 mb-2 text-lg font-semibold">No backers found</p>
            <p className="text-neutral-500">Try adjusting your search or filters</p>
          </Card>
        )}
      </div>
    </div>
  )
}
