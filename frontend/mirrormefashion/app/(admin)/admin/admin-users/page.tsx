"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Users,
  Shield,
  UserCheck,
  Clock,
  Search,
  Filter,
  Plus,
  Edit,
  Mail,
  Phone,
  Calendar,
  Building,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"

const adminUsers = [
  {
    id: "ADM-001",
    name: "John Smith",
    email: "john.smith@fashion.com",
    phone: "+1 (555) 123-4567",
    role: "super_admin",
    department: "IT",
    status: "active",
    lastLogin: "2024-01-15 14:30",
    createdAt: "2023-06-15",
    avatar: "/placeholder.svg?height=40&width=40",
    permissions: ["all"],
  },
  {
    id: "ADM-002",
    name: "Sarah Johnson",
    email: "sarah.j@fashion.com",
    phone: "+1 (555) 234-5678",
    role: "admin",
    department: "Operations",
    status: "active",
    lastLogin: "2024-01-15 09:15",
    createdAt: "2023-08-22",
    avatar: "/placeholder.svg?height=40&width=40",
    permissions: ["products", "orders", "customers"],
  },
  {
    id: "ADM-003",
    name: "Mike Chen",
    email: "mike.chen@fashion.com",
    phone: "+1 (555) 345-6789",
    role: "manager",
    department: "Sales",
    status: "active",
    lastLogin: "2024-01-14 16:45",
    createdAt: "2023-09-10",
    avatar: "/placeholder.svg?height=40&width=40",
    permissions: ["orders", "customers", "reports"],
  },
  {
    id: "ADM-004",
    name: "Emma Wilson",
    email: "emma.w@fashion.com",
    phone: "+1 (555) 456-7890",
    role: "support",
    department: "Customer Service",
    status: "inactive",
    lastLogin: "2024-01-10 11:20",
    createdAt: "2023-11-05",
    avatar: "/placeholder.svg?height=40&width=40",
    permissions: ["customers", "support"],
  },
  {
    id: "ADM-005",
    name: "David Brown",
    email: "david.b@fashion.com",
    phone: "+1 (555) 567-8901",
    role: "marketing",
    department: "Marketing",
    status: "active",
    lastLogin: "2024-01-15 13:10",
    createdAt: "2023-12-01",
    avatar: "/placeholder.svg?height=40&width=40",
    permissions: ["promotions", "campaigns", "notifications"],
  },
]

const stats = [
  { label: "Total Admins", value: "24", change: "+3", icon: Users, color: "text-blue-600" },
  { label: "Active Users", value: "21", change: "+2", icon: UserCheck, color: "text-green-600" },
  { label: "Super Admins", value: "3", change: "0", icon: Shield, color: "text-primary-600" },
  { label: "Last 24h Logins", value: "18", change: "+5", icon: Clock, color: "text-orange-600" },
]

const tabs = [
  { id: "all", label: "All Users", icon: Users, count: 24 },
  { id: "active", label: "Active", icon: UserCheck, count: 21 },
  { id: "inactive", label: "Inactive", icon: Clock, count: 3 },
  { id: "super_admin", label: "Super Admins", icon: Shield, count: 3 },
]

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentStatsIndex, setCurrentStatsIndex] = useState(0)

  const nextStats = () => {
    setCurrentStatsIndex((prev) => (prev + 1) % stats.length)
  }

  const prevStats = () => {
    setCurrentStatsIndex((prev) => (prev - 1 + stats.length) % stats.length)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-red-100 text-red-800"
      case "admin":
        return "bg-primary-100 text-primary-800"
      case "manager":
        return "bg-blue-100 text-blue-800"
      case "support":
        return "bg-green-100 text-green-800"
      case "marketing":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "super_admin":
        return "Super Admin"
      case "admin":
        return "Admin"
      case "manager":
        return "Manager"
      case "support":
        return "Support"
      case "marketing":
        return "Marketing"
      default:
        return role
    }
  }

  const filteredUsers = adminUsers.filter((user) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && user.status === "active") ||
      (activeTab === "inactive" && user.status === "inactive") ||
      (activeTab === "super_admin" && user.role === "super_admin")
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <div className="space-y-4 md:space-y-6 max-w-full overflow-hidden">
      {/* Mobile Header */}
      <div className="flex items-center justify-between md:hidden px-1">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold truncate">Admin Users</h1>
          <p className="text-sm text-gray-600 truncate">Manage administrator accounts and permissions</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-full flex-shrink-0 ml-2 bg-transparent">
              <Plus className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Admin User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <Input placeholder="e.g., John Smith" />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input placeholder="john.smith@fashion.com" type="email" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="active" defaultChecked />
                <label htmlFor="active" className="text-sm font-medium">
                  Active user
                </label>
              </div>
              <Button className="w-full">Add User</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Admin Users</h1>
          <p className="text-gray-600">Manage administrator accounts and permissions</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="support">Support</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Admin User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <Input placeholder="e.g., John Smith" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input placeholder="john.smith@fashion.com" type="email" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input placeholder="+1 (555) 123-4567" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Department</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IT">IT</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Customer Service">Customer Service</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Role</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Permissions</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {[
                      "Products",
                      "Orders",
                      "Customers",
                      "Reports",
                      "Promotions",
                      "Campaigns",
                      "Notifications",
                      "Support",
                      "Settings",
                      "Users",
                    ].map((permission) => (
                      <label key={permission} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{permission}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="active" defaultChecked />
                  <label htmlFor="active" className="text-sm font-medium">
                    Active user
                  </label>
                </div>

                <Button className="w-full">Add User</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="w-full max-w-[85vw] overflow-hidden md:hidden mx-auto">
        <Swiper modules={[FreeMode]} spaceBetween={6} slidesPerView="auto" freeMode={true} className="px-4">
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <SwiperSlide key={tab.id} className="!w-auto">
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-primary-600 text-white shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-50 border"
                  }`}
                >
                  <IconComponent className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium leading-tight">{tab.label}</span>
                  <Badge
                    variant="secondary"
                    className={`absolute -top-1 -right-1 text-xs min-w-5 h-5 px-1 ${
                      activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100"
                    }`}
                  >
                    {tab.count > 999 ? "999+" : tab.count}
                  </Badge>
                </button>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>

      {/* Desktop Tab Navigation */}
      <div className="hidden md:block">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-primary-600 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-50 border"
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
                <Badge
                  variant="secondary"
                  className={`text-xs ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100"}`}
                >
                  {tab.count}
                </Badge>
              </button>
            )
          })}
        </div>
      </div>

      {/* Mobile Stats Slider */}
      <div className="md:hidden px-1">
        <div className="relative bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {(() => {
                  const IconComponent = stats[currentStatsIndex].icon
                  return <IconComponent className="w-6 h-6 flex-shrink-0" />
                })()}
                <span className="text-sm font-medium opacity-90 truncate">{stats[currentStatsIndex].label}</span>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevStats}
                  className="text-white hover:bg-white/20 p-1 h-8 w-8"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextStats}
                  className="text-white hover:bg-white/20 p-1 h-8 w-8"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="text-3xl font-bold mb-2">{stats[currentStatsIndex].value}</div>

            <div className="flex items-center text-sm">
              <span>
                {stats[currentStatsIndex].change !== "0"
                  ? `${stats[currentStatsIndex].change} this month`
                  : "No change"}
              </span>
            </div>
          </div>

          <div className="flex justify-center mt-4 gap-2">
            {stats.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStatsIndex ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Stats Cards */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              {(() => {
                const IconComponent = stat.icon
                return <IconComponent className="h-4 w-4 text-muted-foreground" />
              })()}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-gray-500">
                <span>{stat.change !== "0" ? `${stat.change} this month` : "No change"}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="mx-1 md:mx-0">
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col gap-3 md:flex-row md:gap-4">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
            </div>

            <div className="flex gap-2 md:gap-4">
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-48 rounded-xl">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Customer Service">Customer Service</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="mx-1 md:mx-0 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* User Header */}
                <div className="flex items-start gap-3">
                  <Avatar className="w-12 h-12 flex-shrink-0">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-base truncate">{user.name}</h3>
                          <Badge className={getRoleColor(user.role)} variant="secondary">
                            {getRoleLabel(user.role)}
                          </Badge>
                          <Badge className={getStatusColor(user.status)} variant="secondary">
                            {user.status}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 flex-shrink-0" />
                            <span>{user.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building className="w-3 h-3 flex-shrink-0" />
                            <span>{user.department}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity and Permissions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Last Login</div>
                    <div className="text-sm font-medium">{user.lastLogin}</div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Joined {user.createdAt}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Permissions</div>
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.slice(0, 3).map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission === "all" ? "All Access" : permission}
                        </Badge>
                      ))}
                      {user.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{user.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Edit className="w-4 h-4" />
                      <span className="hidden sm:inline ml-1">Edit</span>
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <Card className="mx-1 md:mx-0">
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600 mb-4 text-center">
              {searchQuery ? "Try adjusting your search terms" : "Add your first admin user to get started"}
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
