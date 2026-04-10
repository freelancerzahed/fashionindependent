"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, UserPlus, UserMinus, Check, X, Users, UserX, Loader2 } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import { shortenText } from "@/lib/utils"

interface FriendUser {
  id: number
  referred_by: number | null
  provider: string | null
  provider_id: string | null
  refresh_token: string | null
  access_token: string | null
  user_type: string
  name: string
  user_name: string
  nick_name: string | null
  email: string
  email_verified_at: string | null
  verification_code: string | null
  new_email_verificiation_code: string | null
  device_token: string | null
  avatar: string | null
  avatar_original: string | null
  address: string | null
  country: string | null
  state: string | null
  city: string | null
  postal_code: string | null
  phone: string | null
  balance: number
  banned: number
  referral_code: string | null
  customer_package_id: number | null
  remaining_uploads: number
  top_10_friends: string
  chat_connection_id: string | null
  is_notify: string
  is_online: number
  is_hide_birthday: number
  is_hide_body_shape: number
  is_hide_favorites: number
  status: number
  created_at: string
  updated_at: string
}

interface FriendItem {
  friendship_id: number
  friend: FriendUser
  status: number
}

interface FriendsResponse {
  pending: FriendItem[]
  accepted: FriendItem[]
  denied: FriendItem[]
  blocked: FriendItem[]
}

interface Suggestion {
  id: number
  name: string
  user_name: string
  avatar: string
}

interface Friend {
  id: string
  name: string
  username: string
  avatar: string | null
  status: "friend" | "pending" | "sent" | "not_friend"
  isOnline?: boolean
}

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([])
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "friends" | "pending" | "sent" | "suggestions">("all")
  const [loading, setLoading] = useState(true)
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFriends()
  }, [])

  useEffect(() => {
    if (activeTab === "suggestions" && suggestions.length === 0) {
      fetchSuggestions()
    }
  }, [activeTab])

  const fetchFriends = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch from our Next.js API route
      const response = await fetch('/api/friends')
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch friends: ${response.status} ${response.statusText}. ${errorText}`)
      }
      
      const result = await response.json()
      
      // Check if the response indicates authentication error
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch friends')
      }
      
      const data: FriendsResponse = result.data
      
      const friendList: Friend[] = []
      
      // Process accepted friends - with safety check
      if (data.accepted && Array.isArray(data.accepted)) {
        data.accepted.forEach((item: FriendItem) => {
          friendList.push({
            id: item.friend.id.toString(),
            name: item.friend.name,
            username: item.friend.user_name || `user${item.friend.id}`,
            avatar: item.friend.avatar,
            status: "friend",
            isOnline: item.friend.is_online === 1
          })
        })
      }
      
      // Process pending friends (friend requests received) - with safety check
      if (data.pending && Array.isArray(data.pending)) {
        data.pending.forEach((item: FriendItem) => {
          friendList.push({
            id: item.friend.id.toString(),
            name: item.friend.name,
            username: item.friend.user_name || `user${item.friend.id}`,
            avatar: item.friend.avatar,
            status: "pending",
            isOnline: item.friend.is_online === 1
          })
        })
      }
      
      // For the "sent" tab, we would need a separate API endpoint
      // For now, we'll leave it empty as we don't have that data
      
      setFriends(friendList)
    } catch (err: any) {
      console.error("Failed to fetch friends:", err)
      setError(`Failed to load friends: ${err.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const fetchSuggestions = async () => {
    try {
      setSuggestionsLoading(true);
      const response = await fetch('/api/friend-suggestions');
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch suggestions: ${response.status} ${response.statusText}. ${errorText}`);
      }
      
      const result = await response.json();
      
      // Check if the response indicates authentication error
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch suggestions');
      }
      
      // Access the suggestions data properly
      const suggestionsData = result.data?.suggestions || result.data;
      
      if (Array.isArray(suggestionsData)) {
        setSuggestions(suggestionsData);
      } else {
        setSuggestions([]);
      }
    } catch (err: any) {
      console.error("Failed to fetch suggestions:", err);
      setError(`Failed to load suggestions: ${err.message || 'Unknown error'}`);
    } finally {
      setSuggestionsLoading(false);
    }
  }

  const filteredFriends = friends.filter((friend) => {
    const matchesSearch =
      friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "friends") return matchesSearch && friend.status === "friend"
    if (activeTab === "pending") return matchesSearch && friend.status === "pending"
    if (activeTab === "sent") return matchesSearch && friend.status === "sent"
    if (activeTab === "suggestions") return matchesSearch && friend.status === "not_friend" // For suggestions, show non-friends
    return false
  })

  // Add a debug log to see what's happening
  console.log('Friends state:', friends);
  console.log('Filtered friends:', filteredFriends);
  console.log('Active tab:', activeTab);

  // Ensure the component re-renders when friends or activeTab changes
  const filteredAndSortedFriends = React.useMemo(() => {
    return [...filteredFriends].sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredFriends, activeTab, friends]);

  const handleAddFriend = async (id: string) => {
    try {
      // Call our API route to add friend
      const response = await fetch('/api/send-friend-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: parseInt(id) }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to send friend request');
      }
      
      const result = await response.json();
      
      // Remove from suggestions if it's there
      setSuggestions((prev) => prev.filter((s) => s.id.toString() !== id));
      
      // Update friends list if needed
      setFriends((prev) => 
        prev.map((f) => 
          f.id === id ? { ...f, status: "sent" } : f
        )
      );
    } catch (error) {
      console.error('Error adding friend:', error);
      setError(`Failed to add friend: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleAcceptRequest = async (id: string) => {
    try {
      const response = await fetch('/api/friend-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'accept', userId: id }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to accept friend request');
      }
      
      const result = await response.json();
      
      // Update UI
      setFriends((prev) => prev.map((f) => (f.id === id && f.status === "pending" ? { ...f, status: "friend" } : f)));
    } catch (error) {
      console.error('Error accepting friend request:', error);
      setError(`Failed to accept friend request: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  const handleDeclineRequest = async (id: string) => {
    try {
      const response = await fetch('/api/friend-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'decline', userId: id }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to decline friend request');
      }
      
      const result = await response.json();
      
      // Update UI
      setFriends((prev) => prev.filter((f) => f.id !== id));
    } catch (error) {
      console.error('Error declining friend request:', error);
      setError(`Failed to decline friend request: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  const handleCancelRequest = async (id: string) => {
    try {
      const response = await fetch('/api/friend-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'cancel', userId: id }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel friend request');
      }
      
      const result = await response.json();
      
      // Update UI
      setFriends((prev) => prev.map((f) => (f.id === id && f.status === "sent" ? { ...f, status: "not_friend" } : f)));
    } catch (error) {
      console.error('Error canceling friend request:', error);
      setError(`Failed to cancel friend request: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  const handleUnfriend = async (id: string) => {
    if (window.confirm("Are you sure you want to unfriend this person?")) {
      // Remove from UI instantly
      setFriends((prev) => prev.filter((f) => f.id !== id));
      
      try {
        const response = await fetch('/api/unfriend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: parseInt(id, 10) }),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to unfriend user');
        }
        
        const result = await response.json();
        // UI already updated, no need to do anything else
      } catch (error) {
        console.error('Error unfriending user:', error);
        setError(`Failed to unfriend user: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  const getTabCount = (status: Friend["status"] | "all" | "suggestions") => {
    if (status === "all") return friends.length
    if (status === "suggestions") return suggestions.length || 0
    return friends.filter((f) => f.status === status).length || 0
  }

  // Move tabs inside the component so it updates when friends/suggestions change
  const tabs = [
    { value: "all", label: "All", count: getTabCount("all") },
    { value: "friends", label: "Friends", count: getTabCount("friends") },
    { value: "pending", label: "Pending", count: getTabCount("pending") },
    { value: "sent", label: "Sent", count: getTabCount("sent") },
    { value: "suggestions", label: "Suggestions", count: getTabCount("suggestions") },
  ]

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <div className="max-w-5xl mx-auto space-y-6 p-4 md:p-6 pb-24 md:pb-6">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 md:p-8 text-white shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Friends & Connections</h1>
                <p className="text-primary-100 text-sm md:text-base">Manage your social network</p>
              </div>
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-300 h-5 w-5" />
                <Input
                  placeholder="Search friends or people..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-primary-200 focus:bg-white/20 focus:border-white/40"
                />
              </div>
            </div>
          </div>
          
          <Card className="border-primary-200 bg-gradient-to-br from-primary-50 to-white">
            <CardContent className="p-8 text-center text-primary-600">
              <Users className="mx-auto h-16 w-16 mb-4 text-primary-400" />
              <p className="text-xl font-semibold mb-2">Error Loading Friends</p>
              <p className="text-sm text-primary-500 mb-4">{error}</p>
              <Button onClick={fetchFriends} className="bg-primary-600 hover:bg-primary-700">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="max-w-5xl mx-auto space-y-6 p-4 md:p-6 pb-24 md:pb-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 md:p-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Friends & Connections</h1>
              <p className="text-primary-100 text-sm md:text-base">Manage your social network</p>
            </div>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-300 h-5 w-5" />
              <Input
                placeholder="Search friends or people..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-primary-200 focus:bg-white/20 focus:border-white/40"
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="hidden md:grid w-full grid-cols-5 bg-white shadow-sm border border-primary-100">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-primary-600 data-[state=active]:text-white text-primary-600 hover:bg-primary-50"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="friends"
              className="data-[state=active]:bg-primary-600 data-[state=active]:text-white text-primary-600 hover:bg-primary-50"
            >
              Friends
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-primary-600 data-[state=active]:text-white text-primary-600 hover:bg-primary-50"
            >
              Pending
            </TabsTrigger>
            <TabsTrigger
              value="sent"
              className="data-[state=active]:bg-primary-600 data-[state=active]:text-white text-primary-600 hover:bg-primary-50"
            >
              Sent
            </TabsTrigger>
            <TabsTrigger
              value="suggestions"
              className="data-[state=active]:bg-primary-600 data-[state=active]:text-white text-primary-600 hover:bg-primary-50"
            >
              Suggestions
            </TabsTrigger>
          </TabsList>

          <div className="md:hidden bg-white shadow-sm border border-primary-100 rounded-lg p-2">
            <Swiper spaceBetween={8} slidesPerView="auto" freeMode={true} className="w-full">
              {tabs.map((tab) => (
                <SwiperSlide key={tab.value} className="!w-auto">
                  <button
                    onClick={() => setActiveTab(tab.value as any)}
                    className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                      activeTab === tab.value
                        ? "bg-primary-600 text-white shadow-sm"
                        : "text-primary-600 hover:bg-primary-50"
                    }`}
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <span
                        className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                          activeTab === tab.value ? "bg-white/20 text-white" : "bg-primary-100 text-primary-600"
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <TabsContent value="all" className="space-y-4 mt-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600 mb-4" />
                <p className="text-primary-600">Loading friends...</p>
              </div>
            ) : filteredFriends.length === 0 ? (
              <Card className="border-primary-200 bg-gradient-to-br from-primary-50 to-white">
                <CardContent className="p-8 text-center text-primary-600">
                  <Users className="mx-auto h-16 w-16 mb-4 text-primary-400" />
                  <p className="text-xl font-semibold mb-2">No results found</p>
                  <p className="text-sm text-primary-500">Try adjusting your search or filters.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFriends
                  .filter(friend => activeTab === "all" || 
                           (activeTab === "friends" && friend.status === "friend") ||
                           (activeTab === "pending" && friend.status === "pending") ||
                           (activeTab === "sent" && friend.status === "sent") ||
                           (activeTab === "suggestions" && friend.status === "not_friend"))
                  .map((friend, index) => (
                    <Card
                      key={friend.id}
                      className="border-primary-100 hover:shadow-lg transition-all duration-200 hover:border-primary-200 bg-white"
                      style={{
                        animation: `fadeInUp 0.5s ease-out ${index * 100}ms forwards`,
                      }}
                    >
                      <CardContent className="p-4 flex items-center space-x-4">
                        <Link href={`/profile/${friend.username}`} passHref>
                          <div className="relative">
                            <Avatar className="h-12 w-12 cursor-pointer ring-2 ring-primary-100 hover:ring-primary-200 transition-all">
                              <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-primary-100 text-primary-700">
                                {friend.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {friend.isOnline && (
                              <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                        </Link>
                        <div className="flex-1">
                          <Link href={`/profile/${friend.username}`} passHref>
                            <p className="font-semibold text-sm hover:underline cursor-pointer text-gray-800 hover:text-primary-600 transition-colors">
                              {shortenText(friend.name, 10)}
                            </p>
                          </Link>
                          <p className="text-xs text-primary-500">@{shortenText(friend.username, 10)}
                          </p>
                        </div>
                        <div>
                          {friend.status === "friend" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUnfriend(friend.id)}
                              className="border-primary-200 text-primary-600 hover:bg-primary-50 hover:border-primary-300"
                            >
                              <UserMinus className="h-4 w-4 mr-2" /> Unfriend
                            </Button>
                          )}
                          {friend.status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleAcceptRequest(friend.id)}
                                className="bg-primary-600 hover:bg-primary-700 text-white"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeclineRequest(friend.id)}
                                className="border-primary-200 text-primary-600 hover:bg-primary-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                          {friend.status === "sent" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelRequest(friend.id)}
                              className="border-primary-200 text-primary-600 hover:bg-primary-50 hover:border-primary-300"
                            >
                              <UserX className="h-4 w-4 mr-2" /> Cancel Request
                            </Button>
                          )}
                          {friend.status === "not_friend" && (
                            <Button
                              size="sm"
                              onClick={() => handleAddFriend(friend.id)}
                              className="bg-primary-600 hover:bg-primary-700 text-white"
                            >
                              <UserPlus className="h-4 w-4 mr-2" /> Add Friend
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="friends" className="space-y-4 mt-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600 mb-4" />
                <p className="text-primary-600">Loading friends...</p>
              </div>
            ) : filteredFriends.filter(f => f.status === "friend").length === 0 ? (
              <Card className="border-primary-200 bg-gradient-to-br from-primary-50 to-white">
                <CardContent className="p-8 text-center text-primary-600">
                  <Users className="mx-auto h-16 w-16 mb-4 text-primary-400" />
                  <p className="text-xl font-semibold mb-2">No friends found</p>
                  <p className="text-sm text-primary-500">Try adjusting your search or filters.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFriends
                  .filter(friend => friend.status === "friend")
                  .map((friend, index) => (
                    <Card
                      key={friend.id}
                      className="border-primary-100 hover:shadow-lg transition-all duration-200 hover:border-primary-200 bg-white"
                      style={{
                        animation: `fadeInUp 0.5s ease-out ${index * 100}ms forwards`,
                      }}
                    >
                      <CardContent className="p-4 flex items-center space-x-4">
                        <Link href={`/profile/${friend.username}`} passHref>
                          <div className="relative">
                            <Avatar className="h-12 w-12 cursor-pointer ring-2 ring-primary-100 hover:ring-primary-200 transition-all">
                              <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-primary-100 text-primary-700">
                                {friend.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {friend.isOnline && (
                              <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                        </Link>
                        <div className="flex-1">
                          <Link href={`/profile/${friend.username}`} passHref>
                            <p className="font-semibold text-sm hover:underline cursor-pointer text-gray-800 hover:text-primary-600 transition-colors">
                              {shortenText(friend.name, 10)}
                            </p>
                          </Link>
                          <p className="text-xs text-primary-500">@{shortenText(friend.username, 10)}
                          </p>
                        </div>
                        <div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnfriend(friend.id)}
                            className="border-primary-200 text-primary-600 hover:bg-primary-50 hover:border-primary-300"
                          >
                            <UserMinus className="h-4 w-4 mr-2" /> Unfriend
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4 mt-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600 mb-4" />
                <p className="text-primary-600">Loading friends...</p>
              </div>
            ) : filteredFriends.filter(f => f.status === "pending").length === 0 ? (
              <Card className="border-primary-200 bg-gradient-to-br from-primary-50 to-white">
                <CardContent className="p-8 text-center text-primary-600">
                  <Users className="mx-auto h-16 w-16 mb-4 text-primary-400" />
                  <p className="text-xl font-semibold mb-2">No pending requests</p>
                  <p className="text-sm text-primary-500">Try adjusting your search or filters.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFriends
                  .filter(friend => friend.status === "pending")
                  .map((friend, index) => (
                    <Card
                      key={friend.id}
                      className="border-primary-100 hover:shadow-lg transition-all duration-200 hover:border-primary-200 bg-white"
                      style={{
                        animation: `fadeInUp 0.5s ease-out ${index * 100}ms forwards`,
                      }}
                    >
                      <CardContent className="p-4 flex items-center space-x-4">
                        <Link href={`/profile/${friend.username}`} passHref>
                          <div className="relative">
                            <Avatar className="h-12 w-12 cursor-pointer ring-2 ring-primary-100 hover:ring-primary-200 transition-all">
                              <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-primary-100 text-primary-700">
                                {friend.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {friend.isOnline && (
                              <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                        </Link>
                        <div className="flex-1">
                          <Link href={`/profile/${friend.username}`} passHref>
                            <p className="font-semibold text-sm hover:underline cursor-pointer text-gray-800 hover:text-primary-600 transition-colors">
                              {shortenText(friend.name, 10)}
                            </p>
                          </Link>
                          <p className="text-xs text-primary-500">@{shortenText(friend.username, 10)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAcceptRequest(friend.id)}
                            className="bg-primary-600 hover:bg-primary-700 text-white"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeclineRequest(friend.id)}
                            className="border-primary-200 text-primary-600 hover:bg-primary-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sent" className="space-y-4 mt-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600 mb-4" />
                <p className="text-primary-600">Loading friends...</p>
              </div>
            ) : filteredFriends.filter(f => f.status === "sent").length === 0 ? (
              <Card className="border-primary-200 bg-gradient-to-br from-primary-50 to-white">
                <CardContent className="p-8 text-center text-primary-600">
                  <Users className="mx-auto h-16 w-16 mb-4 text-primary-400" />
                  <p className="text-xl font-semibold mb-2">No sent requests</p>
                  <p className="text-sm text-primary-500">Try adjusting your search or filters.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFriends
                  .filter(friend => friend.status === "sent")
                  .map((friend, index) => (
                    <Card
                      key={friend.id}
                      className="border-primary-100 hover:shadow-lg transition-all duration-200 hover:border-primary-200 bg-white"
                      style={{
                        animation: `fadeInUp 0.5s ease-out ${index * 100}ms forwards`,
                      }}
                    >
                      <CardContent className="p-4 flex items-center space-x-4">
                        <Link href={`/profile/${friend.username}`} passHref>
                          <div className="relative">
                            <Avatar className="h-12 w-12 cursor-pointer ring-2 ring-primary-100 hover:ring-primary-200 transition-all">
                              <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-primary-100 text-primary-700">
                                {friend.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {friend.isOnline && (
                              <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                        </Link>
                        <div className="flex-1">
                          <Link href={`/profile/${friend.username}`} passHref>
                            <p className="font-semibold text-sm hover:underline cursor-pointer text-gray-800 hover:text-primary-600 transition-colors">
                              {shortenText(friend.name, 10)}
                            </p>
                          </Link>
                          <p className="text-xs text-primary-500">@{shortenText(friend.username, 10)}
                          </p>
                        </div>
                        <div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelRequest(friend.id)}
                            className="border-primary-200 text-primary-600 hover:bg-primary-50 hover:border-primary-300"
                          >
                            <UserX className="h-4 w-4 mr-2" /> Cancel Request
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-4 mt-6">
            {suggestionsLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600 mb-4" />
                <p className="text-primary-600">Loading suggestions...</p>
              </div>
            ) : suggestions.length === 0 ? (
              <Card className="border-primary-200 bg-gradient-to-br from-primary-50 to-white">
                <CardContent className="p-8 text-center text-primary-600">
                  <Users className="mx-auto h-16 w-16 mb-4 text-primary-400" />
                  <p className="text-xl font-semibold mb-2">No suggestions found</p>
                  <p className="text-sm text-primary-500">Check back later for new suggestions.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestions.map((suggestion, index) => (
                  <Card
                    key={suggestion.id}
                    className="border-primary-100 hover:shadow-lg transition-all duration-200 hover:border-primary-200 bg-white"
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${index * 100}ms forwards`,
                    }}
                  >
                    <CardContent className="p-4 flex items-center space-x-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12 cursor-pointer ring-2 ring-primary-100 hover:ring-primary-200 transition-all">
                          <AvatarImage src={suggestion.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-primary-100 text-primary-700">
                            {suggestion.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-800 truncate">
                          {shortenText(suggestion.name, 15)}
                        </p>
                        {suggestion.user_name && (
                          <p className="text-xs text-primary-500 truncate">@{shortenText(suggestion.user_name, 15)}</p>
                        )}
                      </div>
                      <div>
                        <Button
                          size="sm"
                          onClick={() => handleAddFriend(suggestion.id.toString())}
                          className="bg-primary-600 hover:bg-primary-700 text-white"
                        >
                          <UserPlus className="h-4 w-4 mr-2" /> Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Friend Suggestions section */}
      </div>
    </div>
  )
}