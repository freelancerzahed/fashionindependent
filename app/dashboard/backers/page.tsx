"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Users, TrendingUp, Award, Search, Filter, Loader, RefreshCw, AlertCircle } from "lucide-react"

export default function BackersPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [backers, setBackers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Fetch backers data from API
  const fetchBackers = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      setError(null)

      const token = localStorage.getItem("auth_token")
      if (!token) {
        setError("Authentication required")
        setLoading(false)
        return
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      if (!apiUrl) {
        setError("API URL not configured")
        setLoading(false)
        return
      }

      console.log("Fetching backers data...")

      // First, fetch all campaigns for the creator
      const campaignsResponse = await fetch(`${apiUrl}/campaign`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const campaignsData = await campaignsResponse.json()

      if (!campaignsResponse.ok) {
        throw new Error(campaignsData.message || "Failed to load campaigns")
      }

      // Collect campaigns data
      const campaigns = campaignsData.data || []
      let allBackers: any[] = []

      // Fetch pledges for each campaign
      for (const campaign of campaigns) {
        try {
          const pledgesResponse = await fetch(
            `${apiUrl}/pledge/campaign/${campaign.id}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          )

          const pledgesData = await pledgesResponse.json()

          if (pledgesResponse.ok && pledgesData.pledges) {
            // Add pledges from this campaign
            pledgesData.pledges.forEach((pledge: any) => {
              // Check if backer already exists (avoid duplicates)
              const existingBacker = allBackers.find(
                (b) => b.id === pledge.backer_id
              )

              if (existingBacker) {
                // Update existing backer with new pledge
                existingBacker.totalPledged += parseFloat(pledge.amount || 0)
                existingBacker.campaigns += 1
              } else {
                // Add new backer
                allBackers.push({
                  id: pledge.backer_id,
                  name: pledge.backer?.name || "Unknown",
                  totalPledged: parseFloat(pledge.amount || 0),
                  campaigns: 1,
                  joinDate:
                    pledge.backer?.created_at || pledge.created_at || new Date().toISOString(),
                  status: pledge.status === "completed" ? "completed" : "active",
                  email: pledge.backer?.email || "",
                })
              }
            })
          }
        } catch (err) {
          console.error(`Error fetching pledges for campaign ${campaign.id}:`, err)
          // Continue with other campaigns on error
        }
      }

      setBackers(allBackers)
      setLastUpdated(new Date())
      console.log("Backers data loaded successfully:", allBackers.length)
    } catch (err) {
      console.error("Error fetching backers:", err)
      setError(err instanceof Error ? err.message : "Failed to load backers")
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch on mount
  useEffect(() => {
    fetchBackers()
  }, [])

  // Auto-refresh every 30 seconds (when not editing)
  useEffect(() => {
    let isMounted = true
    let refreshTimer: NodeJS.Timeout

    const autoRefresh = () => {
      if (isMounted) {
        fetchBackers(false)
      }
    }

    refreshTimer = setInterval(autoRefresh, 30000) // 30 seconds

    return () => {
      isMounted = false
      clearInterval(refreshTimer)
    }
  }, [fetchBackers])

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
      {/* Error Alert */}
      {error && (
        <Card className="p-4 border border-red-200 bg-red-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-red-900">Error Loading Backers</p>
              <p className="text-sm text-red-800 mt-1">{error}</p>
            </div>
            <button
              onClick={() => fetchBackers(true)}
              className="text-sm font-medium text-red-600 hover:text-red-700 whitespace-nowrap"
            >
              Retry
            </button>
          </div>
        </Card>
      )}

      {/* Loading Spinner */}
      {loading && backers.length === 0 ? (
        <Card className="p-12 text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-neutral-600">Loading backers data...</p>
        </Card>
      ) : (
        <>
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
                  <p className="text-3xl font-bold">${totalBackers > 0 ? Math.round(totalRaised / totalBackers) : 0}</p>
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
              <Button variant="outline" className="gap-2" onClick={() => fetchBackers(true)} disabled={loading}>
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
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
          </>
        )}
      </div>
    )
  }
