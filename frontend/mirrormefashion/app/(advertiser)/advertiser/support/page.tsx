"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  MessageSquare,
  Plus,
  Search,
  HelpCircle,
  BookOpen,
  Video,
  FileText,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react"

export default function SupportPage() {
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const supportTickets = [
    {
      id: "TICK-2024-001",
      subject: "Campaign not delivering impressions",
      status: "open",
      priority: "high",
      created: "Aug 10, 2024",
      lastUpdate: "2 hours ago",
      category: "Campaign Issues",
    },
    {
      id: "TICK-2024-002",
      subject: "Billing discrepancy in July invoice",
      status: "in-progress",
      priority: "medium",
      created: "Aug 8, 2024",
      lastUpdate: "1 day ago",
      category: "Billing",
    },
    {
      id: "TICK-2024-003",
      subject: "Request for campaign optimization tips",
      status: "resolved",
      priority: "low",
      created: "Aug 5, 2024",
      lastUpdate: "3 days ago",
      category: "General Inquiry",
    },
  ]

  const faqItems = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I create my first advertising campaign?",
          answer:
            "To create your first campaign, navigate to the Campaigns section and click 'Create Campaign'. Follow the step-by-step wizard to set up your targeting, budget, and creative assets.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for enterprise accounts.",
        },
        {
          question: "How long does it take for campaigns to be approved?",
          answer:
            "Most campaigns are reviewed and approved within 24 hours. Complex campaigns or those requiring additional review may take up to 48 hours.",
        },
      ],
    },
    {
      category: "Campaign Management",
      questions: [
        {
          question: "Why is my campaign not getting impressions?",
          answer:
            "Low impressions can be caused by narrow targeting, low bids, or budget constraints. Try expanding your audience, increasing your bid, or raising your daily budget.",
        },
        {
          question: "How can I improve my campaign performance?",
          answer:
            "Focus on relevant targeting, compelling ad creatives, competitive bidding, and regular optimization based on performance data.",
        },
        {
          question: "Can I pause or stop a campaign anytime?",
          answer:
            "Yes, you can pause or stop campaigns at any time from the campaign management dashboard. Changes take effect within a few minutes.",
        },
      ],
    },
    {
      category: "Billing & Payments",
      questions: [
        {
          question: "How does billing work?",
          answer:
            "We use a prepaid model where you add funds to your account balance. Campaign costs are deducted from your balance in real-time.",
        },
        {
          question: "When will I be charged?",
          answer:
            "You're charged when you add funds to your account or when your account balance runs low and auto-recharge is enabled.",
        },
        {
          question: "Can I get a refund for unused budget?",
          answer:
            "Unused campaign budgets remain in your account balance and can be used for future campaigns. Refunds are processed on a case-by-case basis.",
        },
      ],
    },
  ]

  const resources = [
    {
      title: "Getting Started Guide",
      description: "Complete guide to setting up your first campaign",
      type: "guide",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video walkthroughs",
      type: "video",
      icon: Video,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Best Practices",
      description: "Tips and strategies for campaign optimization",
      type: "article",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "API Documentation",
      description: "Technical documentation for developers",
      type: "docs",
      icon: FileText,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredFAQ = faqItems
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (item) =>
          item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
          <p className="text-gray-600">Get help with your advertising campaigns and account</p>
        </div>
        <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary-600 hover:bg-primary-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
              <DialogDescription>Describe your issue and we'll help you resolve it</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ticket-category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="campaign-issues">Campaign Issues</SelectItem>
                      <SelectItem value="billing">Billing & Payments</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="account">Account Management</SelectItem>
                      <SelectItem value="general">General Inquiry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="ticket-priority">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="ticket-subject">Subject</Label>
                <Input id="ticket-subject" placeholder="Brief description of your issue" />
              </div>
              <div>
                <Label htmlFor="ticket-description">Description</Label>
                <Textarea
                  id="ticket-description"
                  placeholder="Please provide detailed information about your issue..."
                  rows={6}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsTicketDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-primary-600 hover:bg-primary-700">Create Ticket</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="p-3 rounded-lg bg-blue-50 w-fit mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-medium mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600 mb-4">Get instant help from our support team</p>
            <Button variant="outline" size="sm" className="bg-transparent">
              Start Chat
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="p-3 rounded-lg bg-green-50 w-fit mx-auto mb-4">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-medium mb-2">Email Support</h3>
            <p className="text-sm text-gray-600 mb-4">Send us an email and we'll respond within 24 hours</p>
            <Button variant="outline" size="sm" className="bg-transparent">
              Send Email
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="p-3 rounded-lg bg-purple-50 w-fit mx-auto mb-4">
              <Phone className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-medium mb-2">Phone Support</h3>
            <p className="text-sm text-gray-600 mb-4">Call us for urgent issues (Business hours)</p>
            <Button variant="outline" size="sm" className="bg-transparent">
              Call Now
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="tickets" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>Track your support requests and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supportTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-gray-50">
                          <MessageSquare className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{ticket.subject}</h3>
                          <p className="text-sm text-gray-600">#{ticket.id}</p>
                        </div>
                        <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                        <Badge className={getPriorityColor(ticket.priority)} variant="outline">
                          {ticket.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 ml-12">
                        <span>Category: {ticket.category}</span>
                        <span>Created: {ticket.created}</span>
                        <span>Last update: {ticket.lastUpdate}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find quick answers to common questions</CardDescription>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search FAQ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredFAQ.map((category, index) => (
                  <div key={index}>
                    <h3 className="font-medium text-gray-900 mb-4">{category.category}</h3>
                    <div className="space-y-4 pl-4 border-l-2 border-gray-100">
                      {category.questions.map((item, itemIndex) => (
                        <div key={itemIndex} className="space-y-2">
                          <h4 className="font-medium text-gray-800 flex items-start gap-2">
                            <HelpCircle className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                            {item.question}
                          </h4>
                          <p className="text-sm text-gray-600 ml-6">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((resource, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${resource.bgColor}`}>
                      <resource.icon className={`w-6 h-6 ${resource.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-2">{resource.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        View Resource
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Get in touch with our support team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Business Hours</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Monday - Friday:</span>
                      <span>9:00 AM - 6:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday:</span>
                      <span>10:00 AM - 4:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday:</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Contact Details</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>Email: support@mirrorads.com</div>
                    <div>Phone: +1 (555) 123-4567</div>
                    <div>Emergency: +1 (555) 987-6543</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
