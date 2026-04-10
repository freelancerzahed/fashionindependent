"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Calendar from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { User, Bell, Shield, Lock, Camera, Trash2, Save, CalendarIcon } from "lucide-react"
import { format } from "date-fns"

export default function SettingsPage() {
  const [profileData, setProfileData] = useState({
    name: "Jane Doe",
    email: "jane.doe@email.com",
    dateOfBirth: "1990-05-15",
    username: "janedoe",
    bio: "Fashion enthusiast | Style blogger | Coffee lover",
    location: "New York, NY",
    website: "www.janedoestyle.com",
  })

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: true,
    social: true,
  })

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showLocation: true,
    allowMessages: true,
    allowTagging: true,
    hideBirthday: false,
    hideBodyShape: false,
    hideFavorites: false,
  })

  const [notificationFrequency, setNotificationFrequency] = useState("daily")

  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : null,
  )

  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=80&width=80&text=User")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleProfileUpdate = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNotificationToggle = (field: string) => {
    setNotifications((prev) => ({ ...prev, [field]: !prev[field as keyof typeof prev] }))
  }

  const handlePrivacyToggle = (field: string) => {
    setPrivacy((prev) => ({ ...prev, [field]: !prev[field as keyof typeof prev] }))
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setProfileData((prev) => ({ ...prev, dateOfBirth: format(date, "yyyy-MM-dd") }))
    setIsCalendarOpen(false)
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setProfileImage("/placeholder.svg?height=80&width=80&text=User")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-600 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="data-[state=active]:bg-primary-600 data-[state=active]:text-white">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-primary-600 data-[state=active]:text-white"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="data-[state=active]:bg-primary-600 data-[state=active]:text-white">
            <Shield className="h-4 w-4 mr-2" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="account" className="data-[state=active]:bg-primary-600 data-[state=active]:text-white">
            <Lock className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary-600">Profile Information</CardTitle>
                <CardDescription>Update your personal information and profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20 border-2 border-primary-600">
                    <AvatarImage src={profileImage || "/placeholder.svg"} />
                    <AvatarFallback className="text-lg bg-primary-600 text-white">JD</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-primary-600 hover:bg-primary-700 text-white"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                    <Button
                      onClick={handleRemoveImage}
                      variant="outline"
                      className="border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white bg-transparent"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => handleProfileUpdate("name", e.target.value)}
                      className="focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={profileData.username}
                      onChange={(e) => handleProfileUpdate("username", e.target.value)}
                      className="focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleProfileUpdate("email", e.target.value)}
                      className="focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal focus:ring-primary-500 focus:border-primary-500 bg-transparent"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : "Select date of birth"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar selected={selectedDate} onSelect={handleDateSelect} />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => handleProfileUpdate("bio", e.target.value)}
                    className="focus:ring-primary-500 focus:border-primary-500"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => handleProfileUpdate("location", e.target.value)}
                      className="focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={profileData.website}
                      onChange={(e) => handleProfileUpdate("website", e.target.value)}
                      className="focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <Button className="bg-primary-600 hover:bg-primary-700 text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <div className="space-y-6">
            <Card className="border-primary-200">
              <CardHeader className="bg-primary-50">
                <CardTitle className="text-primary-700">Notification Settings</CardTitle>
                <CardDescription className="text-primary-600">
                  Control how often you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium text-primary-700">
                    How often would you like to receive notifications?
                  </Label>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200">
                      <div className="relative">
                        <input
                          type="radio"
                          id="daily"
                          name="notificationFrequency"
                          value="daily"
                          checked={notificationFrequency === "daily"}
                          onChange={(e) => setNotificationFrequency(e.target.value)}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            notificationFrequency === "daily"
                              ? "border-primary-600 bg-primary-600"
                              : "border-gray-300 bg-white hover:border-primary-400"
                          }`}
                        >
                          {notificationFrequency === "daily" && <div className="w-2 h-2 rounded-full bg-white"></div>}
                        </div>
                      </div>
                      <Label htmlFor="daily" className="text-sm font-medium cursor-pointer flex-1">
                        Daily
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200">
                      <div className="relative">
                        <input
                          type="radio"
                          id="weekly"
                          name="notificationFrequency"
                          value="weekly"
                          checked={notificationFrequency === "weekly"}
                          onChange={(e) => setNotificationFrequency(e.target.value)}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            notificationFrequency === "weekly"
                              ? "border-primary-600 bg-primary-600"
                              : "border-gray-300 bg-white hover:border-primary-400"
                          }`}
                        >
                          {notificationFrequency === "weekly" && <div className="w-2 h-2 rounded-full bg-white"></div>}
                        </div>
                      </div>
                      <Label htmlFor="weekly" className="text-sm font-medium cursor-pointer flex-1">
                        Once a week
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200">
                      <div className="relative">
                        <input
                          type="radio"
                          id="bimonthly"
                          name="notificationFrequency"
                          value="bimonthly"
                          checked={notificationFrequency === "bimonthly"}
                          onChange={(e) => setNotificationFrequency(e.target.value)}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            notificationFrequency === "bimonthly"
                              ? "border-primary-600 bg-primary-600"
                              : "border-gray-300 bg-white hover:border-primary-400"
                          }`}
                        >
                          {notificationFrequency === "bimonthly" && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                      </div>
                      <Label htmlFor="bimonthly" className="text-sm font-medium cursor-pointer flex-1">
                        Twice a month
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200">
                      <div className="relative">
                        <input
                          type="radio"
                          id="never"
                          name="notificationFrequency"
                          value="never"
                          checked={notificationFrequency === "never"}
                          onChange={(e) => setNotificationFrequency(e.target.value)}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            notificationFrequency === "never"
                              ? "border-primary-600 bg-primary-600"
                              : "border-gray-300 bg-white hover:border-primary-400"
                          }`}
                        >
                          {notificationFrequency === "never" && <div className="w-2 h-2 rounded-full bg-white"></div>}
                        </div>
                      </div>
                      <Label htmlFor="never" className="text-sm font-medium cursor-pointer flex-1">
                        Never
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary-600">Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified about activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={() => handleNotificationToggle("email")}
                    className="data-[state=checked]:bg-primary-600"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-gray-600">Receive push notifications on your device</p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={() => handleNotificationToggle("push")}
                    className="data-[state=checked]:bg-primary-600"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">SMS Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications via text message</p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={() => handleNotificationToggle("sms")}
                    className="data-[state=checked]:bg-primary-600"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Marketing Emails</Label>
                    <p className="text-sm text-gray-600">Receive promotional and marketing emails</p>
                  </div>
                  <Switch
                    checked={notifications.marketing}
                    onCheckedChange={() => handleNotificationToggle("marketing")}
                    className="data-[state=checked]:bg-primary-600"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Social Notifications</Label>
                    <p className="text-sm text-gray-600">Get notified about likes, comments, and follows</p>
                  </div>
                  <Switch
                    checked={notifications.social}
                    onCheckedChange={() => handleNotificationToggle("social")}
                    className="data-[state=checked]:bg-primary-600"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="privacy" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary-600">Privacy Settings</CardTitle>
                <CardDescription>Control who can see your information and interact with you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Profile Visibility</Label>
                  <Select
                    value={privacy.profileVisibility}
                    onValueChange={(value) => setPrivacy((prev) => ({ ...prev, profileVisibility: value }))}
                  >
                    <SelectTrigger className="focus:ring-primary-500 focus:border-primary-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Show Email Address</Label>
                    <p className="text-sm text-gray-600">Allow others to see your email address</p>
                  </div>
                  <Switch
                    checked={privacy.showEmail}
                    onCheckedChange={() => handlePrivacyToggle("showEmail")}
                    className="data-[state=checked]:bg-primary-600"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Show Location</Label>
                    <p className="text-sm text-gray-600">Display your location on your profile</p>
                  </div>
                  <Switch
                    checked={privacy.showLocation}
                    onCheckedChange={() => handlePrivacyToggle("showLocation")}
                    className="data-[state=checked]:bg-primary-600"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Allow Direct Messages</Label>
                    <p className="text-sm text-gray-600">Let others send you direct messages</p>
                  </div>
                  <Switch
                    checked={privacy.allowMessages}
                    onCheckedChange={() => handlePrivacyToggle("allowMessages")}
                    className="data-[state=checked]:bg-primary-600"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Allow Tagging</Label>
                    <p className="text-sm text-gray-600">Allow others to tag you in posts</p>
                  </div>
                  <Switch
                    checked={privacy.allowTagging}
                    onCheckedChange={() => handlePrivacyToggle("allowTagging")}
                    className="data-[state=checked]:bg-primary-600"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Hide Birthday</Label>
                    <p className="text-sm text-gray-600">Hide your birthday from other users</p>
                  </div>
                  <Switch
                    checked={privacy.hideBirthday}
                    onCheckedChange={() => handlePrivacyToggle("hideBirthday")}
                    className="data-[state=checked]:bg-primary-600"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Hide Body Shape</Label>
                    <p className="text-sm text-gray-600">Hide your body measurements from other users</p>
                  </div>
                  <Switch
                    checked={privacy.hideBodyShape}
                    onCheckedChange={() => handlePrivacyToggle("hideBodyShape")}
                    className="data-[state=checked]:bg-primary-600"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Hide Favorites</Label>
                    <p className="text-sm text-gray-600">Hide your favorites and wishlist from other users</p>
                  </div>
                  <Switch
                    checked={privacy.hideFavorites}
                    onCheckedChange={() => handlePrivacyToggle("hideFavorites")}
                    className="data-[state=checked]:bg-primary-600"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="account" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary-600">Account Security</CardTitle>
                <CardDescription>Manage your account security and login settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Enter current password"
                    className="focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    className="focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    className="focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <Button className="bg-primary-600 hover:bg-primary-700 text-white">Update Password</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                <CardDescription>Irreversible and destructive actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <h3 className="font-semibold text-red-800 mb-2">Delete Account</h3>
                  <p className="text-sm text-red-700 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
