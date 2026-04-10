"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import  Calendar  from "@/components/ui/calendar"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { CalendarIcon, Clock, Plus, Edit, Trash2, Play, Pause, Eye } from "lucide-react"
import { format } from "date-fns"

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState("calendar")

  const scheduledCampaigns = [
    {
      id: 1,
      name: "Summer Fashion Launch",
      status: "scheduled",
      startDate: "2024-08-15",
      endDate: "2024-08-30",
      startTime: "09:00",
      endTime: "23:59",
      budget: "$2,500",
      type: "Product Launch",
      platforms: ["Facebook", "Instagram"],
    },
    {
      id: 2,
      name: "Weekend Flash Sale",
      status: "active",
      startDate: "2024-08-12",
      endDate: "2024-08-14",
      startTime: "00:00",
      endTime: "23:59",
      budget: "$1,200",
      type: "Promotional",
      platforms: ["Instagram", "TikTok"],
    },
    {
      id: 3,
      name: "Back to School Campaign",
      status: "scheduled",
      startDate: "2024-08-20",
      endDate: "2024-09-05",
      startTime: "06:00",
      endTime: "22:00",
      budget: "$3,800",
      type: "Seasonal",
      platforms: ["Facebook", "Instagram", "Google"],
    },
  ]

  const upcomingSchedules = [
    {
      time: "09:00 AM",
      campaign: "Summer Fashion Launch",
      action: "Campaign Start",
      date: "Aug 15, 2024",
    },
    {
      time: "12:00 PM",
      campaign: "Lunch Hour Boost",
      action: "Budget Increase",
      date: "Aug 12, 2024",
    },
    {
      time: "06:00 PM",
      campaign: "Evening Rush",
      action: "Audience Expansion",
      date: "Aug 12, 2024",
    },
    {
      time: "11:59 PM",
      campaign: "Weekend Flash Sale",
      action: "Campaign End",
      date: "Aug 14, 2024",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "ended":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaign Schedule</h1>
          <p className="text-gray-600">Plan and manage your campaign timing</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="calendar">Calendar</SelectItem>
              <SelectItem value="list">List View</SelectItem>
              <SelectItem value="timeline">Timeline</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary-600 hover:bg-primary-700">
                <Plus className="w-4 h-4 mr-2" />
                Schedule Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Campaign</DialogTitle>
                <DialogDescription>Set up timing and scheduling for your campaign</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="campaign-name">Campaign Name</Label>
                    <Input id="campaign-name" placeholder="Enter campaign name" />
                  </div>
                  <div>
                    <Label htmlFor="campaign-type">Campaign Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product-launch">Product Launch</SelectItem>
                        <SelectItem value="promotional">Promotional</SelectItem>
                        <SelectItem value="seasonal">Seasonal</SelectItem>
                        <SelectItem value="brand-awareness">Brand Awareness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="budget">Budget</Label>
                    <Input id="budget" placeholder="$0.00" type="number" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Start Date & Time</Label>
                    <div className="flex gap-2">
                      <Input type="date" className="flex-1" />
                      <Input type="time" className="w-24" />
                    </div>
                  </div>
                  <div>
                    <Label>End Date & Time</Label>
                    <div className="flex gap-2">
                      <Input type="date" className="flex-1" />
                      <Input type="time" className="w-24" />
                    </div>
                  </div>
                  <div>
                    <Label>Platforms</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["Facebook", "Instagram", "TikTok", "Google"].map((platform) => (
                        <Badge key={platform} variant="outline" className="cursor-pointer hover:bg-primary-50">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Campaign description..." />
                </div>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <Switch id="auto-optimize" />
                  <Label htmlFor="auto-optimize">Enable automatic optimization</Label>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-primary-600 hover:bg-primary-700">Schedule Campaign</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={viewMode} onValueChange={setViewMode} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Campaign Calendar</CardTitle>
                <CardDescription>View and manage scheduled campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border w-full"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>{format(new Date(), "MMMM d, yyyy")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingSchedules.slice(0, 4).map((schedule, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{schedule.campaign}</p>
                        <p className="text-xs text-gray-600">{schedule.action}</p>
                      </div>
                      <div className="text-xs text-gray-500">{schedule.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Campaigns</CardTitle>
              <CardDescription>All your scheduled and active campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                        <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                        <Badge variant="outline">{campaign.type}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          {campaign.startDate} - {campaign.endDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {campaign.startTime} - {campaign.endTime}
                        </span>
                        <span>{campaign.budget}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {campaign.platforms.map((platform) => (
                          <Badge key={platform} variant="secondary" className="text-xs">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        {campaign.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Timeline</CardTitle>
              <CardDescription>Upcoming scheduled actions and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {upcomingSchedules.map((schedule, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                      {index < upcomingSchedules.length - 1 && <div className="w-px h-12 bg-gray-200 mt-2"></div>}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{schedule.campaign}</h3>
                        <span className="text-sm text-gray-500">{schedule.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{schedule.action}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {schedule.time}
                        </Badge>
                      </div>
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
