"use client"

import { useState } from "react"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Plus,
  Edit,
  Calendar,
  CreditCard,
  PieChart,
  BarChart3,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface BudgetOverview {
  totalBudget: number
  totalSpent: number
  remainingBudget: number
  monthlyBudget: number
  monthlySpent: number
  dailyAverage: number
}

interface CampaignBudget {
  id: string
  name: string
  allocatedBudget: number
  spentBudget: number
  remainingBudget: number
  status: "active" | "paused" | "completed"
  endDate: string
  dailySpend: number
}

interface BudgetAlert {
  id: string
  type: "warning" | "critical"
  message: string
  campaign: string
  timestamp: string
}

export default function BudgetPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false)
  const [newBudgetAmount, setNewBudgetAmount] = useState("")

  const budgetOverview: BudgetOverview = {
    totalBudget: 25000,
    totalSpent: 18750,
    remainingBudget: 6250,
    monthlyBudget: 8000,
    monthlySpent: 5640,
    dailyAverage: 187.5,
  }

  const campaignBudgets: CampaignBudget[] = [
    {
      id: "1",
      name: "Summer Fashion Collection 2024",
      allocatedBudget: 5000,
      spentBudget: 2340,
      remainingBudget: 2660,
      status: "active",
      endDate: "2024-08-31",
      dailySpend: 78,
    },
    {
      id: "2",
      name: "Back to School Promotion",
      allocatedBudget: 3000,
      spentBudget: 2850,
      remainingBudget: 150,
      status: "active",
      endDate: "2024-09-15",
      dailySpend: 95,
    },
    {
      id: "3",
      name: "Weekend Flash Sale",
      allocatedBudget: 2000,
      spentBudget: 1980,
      remainingBudget: 20,
      status: "completed",
      endDate: "2024-07-28",
      dailySpend: 0,
    },
  ]

  const budgetAlerts: BudgetAlert[] = [
    {
      id: "1",
      type: "critical",
      message: "Budget almost exhausted (95% spent)",
      campaign: "Back to School Promotion",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      type: "warning",
      message: "Daily spend limit exceeded",
      campaign: "Summer Fashion Collection 2024",
      timestamp: "1 day ago",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "paused":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getBudgetUsageColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500"
    if (percentage >= 75) return "bg-yellow-500"
    return "bg-primary-500"
  }

  const handleAddBudget = () => {
    // Handle budget addition logic here
    setIsAddBudgetOpen(false)
    setNewBudgetAmount("")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budget Management</h1>
          <p className="text-gray-600">Monitor and manage your advertising budgets</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isAddBudgetOpen} onOpenChange={setIsAddBudgetOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary-600 hover:bg-primary-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Budget</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="budget-amount">Budget Amount ($)</Label>
                  <Input
                    id="budget-amount"
                    type="number"
                    value={newBudgetAmount}
                    onChange={(e) => setNewBudgetAmount(e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddBudgetOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddBudget} className="bg-primary-600 hover:bg-primary-700 text-white">
                    Add Budget
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                12.5%
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">${budgetOverview.totalBudget.toLocaleString()}</h3>
              <p className="text-sm text-gray-600">Total Budget</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-100 rounded-lg text-red-600">
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-red-600">
                <TrendingUp className="w-4 h-4" />
                8.3%
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">${budgetOverview.totalSpent.toLocaleString()}</h3>
              <p className="text-sm text-gray-600">Total Spent</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingDown className="w-4 h-4" />
                3.2%
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">${budgetOverview.remainingBudget.toLocaleString()}</h3>
              <p className="text-sm text-gray-600">Remaining Budget</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-blue-600">
                <TrendingUp className="w-4 h-4" />
                5.7%
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">${budgetOverview.dailyAverage.toFixed(0)}</h3>
              <p className="text-sm text-gray-600">Daily Average</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Alerts */}
      {budgetAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              Budget Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {budgetAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border ${
                    alert.type === "critical"
                      ? "bg-red-50 border-red-200 text-red-800"
                      : "bg-yellow-50 border-yellow-200 text-yellow-800"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm opacity-75">Campaign: {alert.campaign}</p>
                    </div>
                    <span className="text-xs opacity-75">{alert.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Campaign Budget Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Budget Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {campaignBudgets.map((campaign) => {
              const usagePercentage = (campaign.spentBudget / campaign.allocatedBudget) * 100
              return (
                <div key={campaign.id} className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </Badge>
                        <span className="text-sm text-gray-600">Ends: {campaign.endDate}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Allocated</p>
                      <p className="font-semibold">${campaign.allocatedBudget.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Spent</p>
                      <p className="font-semibold text-red-600">${campaign.spentBudget.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Remaining</p>
                      <p className="font-semibold text-green-600">${campaign.remainingBudget.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Daily Spend</p>
                      <p className="font-semibold">${campaign.dailySpend}/day</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Budget Usage</span>
                      <span>{usagePercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={usagePercentage} className="h-2" />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Budget Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Spending Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Spending trend chart</p>
                <p className="text-sm text-gray-500">Chart visualization would be implemented here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Budget allocation breakdown</p>
                <p className="text-sm text-gray-500">Pie chart would be implemented here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
