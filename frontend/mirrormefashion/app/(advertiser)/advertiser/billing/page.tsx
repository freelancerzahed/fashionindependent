"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  CreditCard,
  Plus,
  DollarSign,
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle,
  Download,
  Edit,
  Trash2,
} from "lucide-react"

export default function BillingPage() {
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false)
  const [isAddBudgetDialogOpen, setIsAddBudgetDialogOpen] = useState(false)

  const billingOverview = [
    {
      title: "Current Balance",
      value: "$2,847.50",
      change: "-$456.20",
      trend: "down",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Monthly Spend",
      value: "$4,235.80",
      change: "+12.5%",
      trend: "up",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Next Payment",
      value: "Aug 15",
      change: "5 days",
      trend: "neutral",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Payment Methods",
      value: "3",
      change: "+1",
      trend: "up",
      icon: CreditCard,
      color: "text-primary-600",
      bgColor: "bg-primary-50",
    },
  ]

  const paymentMethods = [
    {
      id: 1,
      type: "Visa",
      last4: "4242",
      expiryMonth: "12",
      expiryYear: "2025",
      isDefault: true,
      status: "active",
    },
    {
      id: 2,
      type: "Mastercard",
      last4: "8888",
      expiryMonth: "08",
      expiryYear: "2026",
      isDefault: false,
      status: "active",
    },
    {
      id: 3,
      type: "American Express",
      last4: "1005",
      expiryMonth: "03",
      expiryYear: "2024",
      isDefault: false,
      status: "expired",
    },
  ]

  const budgetAlerts = [
    {
      campaign: "Summer Fashion Collection",
      budget: "$1,200",
      spent: "$1,080",
      percentage: 90,
      status: "warning",
      daysLeft: 5,
    },
    {
      campaign: "Back to School Essentials",
      budget: "$800",
      spent: "$760",
      percentage: 95,
      status: "critical",
      daysLeft: 3,
    },
    {
      campaign: "Weekend Sale Promotion",
      budget: "$600",
      spent: "$420",
      percentage: 70,
      status: "good",
      daysLeft: 8,
    },
  ]

  const recentTransactions = [
    {
      id: 1,
      date: "Aug 10, 2024",
      description: "Campaign Spend - Summer Fashion",
      amount: "-$156.80",
      status: "completed",
      method: "Visa •••• 4242",
    },
    {
      id: 2,
      date: "Aug 9, 2024",
      description: "Account Top-up",
      amount: "+$500.00",
      status: "completed",
      method: "Visa •••• 4242",
    },
    {
      id: 3,
      date: "Aug 8, 2024",
      description: "Campaign Spend - Back to School",
      amount: "-$89.45",
      status: "completed",
      method: "Mastercard •••• 8888",
    },
    {
      id: 4,
      date: "Aug 7, 2024",
      description: "Campaign Spend - Weekend Sale",
      amount: "-$234.60",
      status: "pending",
      method: "Visa •••• 4242",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600 bg-green-50"
      case "warning":
        return "text-yellow-600 bg-yellow-50"
      case "critical":
        return "text-red-600 bg-red-50"
      case "completed":
        return "text-green-600 bg-green-50"
      case "pending":
        return "text-yellow-600 bg-yellow-50"
      case "active":
        return "text-green-600 bg-green-50"
      case "expired":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getCardIcon = (type: string) => {
    // In a real app, you'd use actual card brand icons
    return CreditCard
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
          <p className="text-gray-600">Manage your payment methods and billing information</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={isAddBudgetDialogOpen} onOpenChange={setIsAddBudgetDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Campaign Budget</DialogTitle>
                <DialogDescription>Set up budget limits for your campaigns</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="campaign-select">Select Campaign</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summer-fashion">Summer Fashion Collection</SelectItem>
                      <SelectItem value="back-to-school">Back to School Essentials</SelectItem>
                      <SelectItem value="weekend-sale">Weekend Sale Promotion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="budget-amount">Budget Amount</Label>
                  <Input id="budget-amount" placeholder="$0.00" type="number" />
                </div>
                <div>
                  <Label htmlFor="budget-period">Budget Period</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="campaign">Campaign Lifetime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="alert-enabled" />
                  <Label htmlFor="alert-enabled">Send alerts at 80% spend</Label>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddBudgetDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-primary-600 hover:bg-primary-700">Add Budget</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddCardDialogOpen} onOpenChange={setIsAddCardDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary-600 hover:bg-primary-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Payment Method
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
                <DialogDescription>Add a new credit or debit card for payments</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input id="card-number" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cardholder-name">Cardholder Name</Label>
                  <Input id="cardholder-name" placeholder="John Doe" />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="set-default" />
                  <Label htmlFor="set-default">Set as default payment method</Label>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddCardDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-primary-600 hover:bg-primary-700">Add Card</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Billing Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {billingOverview.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <Badge
                  variant="outline"
                  className={
                    metric.trend === "up"
                      ? "text-green-600 border-green-200"
                      : metric.trend === "down"
                        ? "text-red-600 border-red-200"
                        : "text-gray-600 border-gray-200"
                  }
                >
                  {metric.change}
                </Badge>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
                <p className="text-sm text-gray-600 mt-1">{metric.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="budgets">Budget Alerts</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Spending Overview</CardTitle>
                <CardDescription>Your advertising spend this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Budget</span>
                    <span className="font-medium">$5,000.00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Spent</span>
                    <span className="font-medium">$4,235.80</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Remaining</span>
                    <span className="font-medium text-green-600">$764.20</span>
                  </div>
                  <Progress value={84.7} className="h-2" />
                  <p className="text-xs text-gray-600">84.7% of monthly budget used</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Schedule</CardTitle>
                <CardDescription>Upcoming payments and billing dates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Monthly Billing</p>
                      <p className="text-sm text-gray-600">Next payment due</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Aug 15, 2024</p>
                      <p className="text-sm text-gray-600">$1,247.50</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Campaign Charges</p>
                      <p className="text-sm text-gray-600">Daily processing</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Daily</p>
                      <p className="text-sm text-gray-600">~$140/day</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="methods" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your credit cards and payment options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method) => {
                  const CardIcon = getCardIcon(method.type)
                  return (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-gray-50">
                          <CardIcon className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">
                              {method.type} •••• {method.last4}
                            </p>
                            {method.isDefault && (
                              <Badge variant="outline" className="text-xs">
                                Default
                              </Badge>
                            )}
                            <Badge className={`text-xs ${getStatusColor(method.status)}`}>{method.status}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Expires {method.expiryMonth}/{method.expiryYear}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budgets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Budget Alerts</CardTitle>
              <CardDescription>Monitor your campaign spending limits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetAlerts.map((alert, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{alert.campaign}</h3>
                      <div className="flex items-center gap-2">
                        {alert.status === "critical" ? (
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        ) : alert.status === "warning" ? (
                          <AlertCircle className="w-4 h-4 text-yellow-600" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                        <Badge className={`text-xs ${getStatusColor(alert.status)}`}>{alert.percentage}% spent</Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Spent: {alert.spent}</span>
                        <span>Budget: {alert.budget}</span>
                      </div>
                      <Progress value={alert.percentage} className="h-2" />
                      <p className="text-xs text-gray-600">{alert.daysLeft} days remaining</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your recent billing activity</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-medium">{transaction.description}</p>
                        <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>{transaction.status}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{transaction.date}</span>
                        <span>{transaction.method}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-medium ${
                          transaction.amount.startsWith("+") ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {transaction.amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
