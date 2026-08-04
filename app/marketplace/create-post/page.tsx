"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, X, Edit3, Save, Send } from "lucide-react"

interface Listing {
  id?: string
  title: string
  description: string
  images: string[]
  location: string
  contactName: string
  condition: string
  createdAt?: string
  status: 'draft' | 'published'
}

interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  isOutgoing: boolean
}

interface Conversation {
  id: string
  user: string
  lastMessage: string
  timestamp: string
  avatar: string
}

export default function MarketplaceListingPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  // Form state
  const [listing, setListing] = useState<Listing>({
    title: "Title of Listing",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    images: [],
    location: "New York, NY",
    contactName: "John Doe",
    condition: "Excellent",
    status: 'draft'
  })

  // Messages state
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: "1", user: "alice_designer", lastMessage: "Is this still available?", timestamp: "2 hours ago", avatar: "" },
    { id: "2", user: "bob_collector", lastMessage: "Great piece!", timestamp: "1 day ago", avatar: "" },
    { id: "3", user: "charlie_fashion", lastMessage: "Can you ship?", timestamp: "3 days ago", avatar: "" },
    { id: "4", user: "diana_style", lastMessage: "Price negotiable?", timestamp: "1 week ago", avatar: "" }
  ])

  const [selectedConversation, setSelectedConversation] = useState<string>("1")
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "alice_designer", content: "Hi! I saw your listing for the vintage jacket. Is it still available?", timestamp: "2 hours ago", isOutgoing: false },
    { id: "2", sender: "you", content: "Yes, it's still available! Are you interested?", timestamp: "2 hours ago", isOutgoing: true },
    { id: "3", sender: "alice_designer", content: "Absolutely! Can you tell me more about the condition?", timestamp: "1 hour ago", isOutgoing: false }
  ])

  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // CRUD Operations
  const createListing = async (listingData: Listing) => {
    try {
      const response = await fetch('/api/marketplace/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listingData)
      })
      if (!response.ok) throw new Error('Failed to create listing')
      return await response.json()
    } catch (error) {
      console.error('Error creating listing:', error)
      throw error
    }
  }

  const updateListing = async (id: string, listingData: Listing) => {
    try {
      const response = await fetch(`/api/marketplace/listings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listingData)
      })
      if (!response.ok) throw new Error('Failed to update listing')
      return await response.json()
    } catch (error) {
      console.error('Error updating listing:', error)
      throw error
    }
  }

  const publishListing = async () => {
    setLoading(true)
    try {
      const updatedListing = { ...listing, status: 'published' as const }
      if (listing.id) {
        await updateListing(listing.id, updatedListing)
      } else {
        const result = await createListing(updatedListing)
        setListing({ ...result, status: 'published' })
      }
      setIsEditing(false)
    } catch (error) {
      alert('Failed to publish listing')
    } finally {
      setLoading(false)
    }
  }

  const saveDraft = async () => {
    setLoading(true)
    try {
      const updatedListing = { ...listing, status: 'draft' as const }
      if (listing.id) {
        await updateListing(listing.id, updatedListing)
      } else {
        const result = await createListing(updatedListing)
        setListing(result)
      }
      setIsEditing(false)
    } catch (error) {
      alert('Failed to save draft')
    } finally {
      setLoading(false)
    }
  }

  // Image upload handlers
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setListing(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }))
    }
  }

  const removeImage = (index: number) => {
    setListing(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  // Message handlers
  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      sender: "you",
      content: newMessage,
      timestamp: "now",
      isOutgoing: true
    }

    setMessages(prev => [...prev, message])
    setNewMessage("")
  }

  const filteredConversations = conversations.filter(conv =>
    conv.user.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-100 text-black rounded-lg overflow-hidden">
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 border-b-2 border-black">
        {/* Left Main Content */}
        <div className="lg:col-span-3 p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <Link href="/marketplace" className="text-lg font-medium hover:text-blue-600">
              <ArrowLeft className="inline mr-2" />
              Back
            </Link>
            <Link href="/marketplace" className="text-lg underline hover:text-blue-600">
              cancel
            </Link>
          </div>

          {/* Title */}
          <div className="mb-6">
            {isEditing ? (
              <input
                type="text"
                value={listing.title}
                onChange={(e) => setListing(prev => ({ ...prev, title: e.target.value }))}
                className="text-4xl font-bold w-full border-2 border-gray-300 px-3 py-2 focus:border-black outline-none"
                placeholder="Enter listing title"
              />
            ) : (
              <h1 className="text-4xl font-bold">{listing.title}</h1>
            )}
          </div>

          {/* Main Image */}
          <div className="w-full h-[420px] flex items-center justify-center bg-white mb-6 relative">
            {listing.images.length > 0 ? (
              <img
                src={listing.images[0]}
                alt="Main listing image"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                <Upload className="h-20 w-20 mb-4" />
                <p className="text-lg mb-4">Upload Image</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                >
                  Choose Files
                </button>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 mb-8">
            {listing.images.slice(1, 5).map((image, index) => (
              <div key={index} className="w-28 h-28 bg-white relative">
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <button
                    onClick={() => removeImage(index + 1)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
            {listing.images.length < 5 && isEditing && (
              <div className="w-28 h-28 bg-white border-2 border-dashed border-gray-300 flex items-center justify-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-gray-500 hover:text-black"
                >
                  <Upload className="w-8 h-8" />
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-6 mb-10 text-sm">
            {['messages', 'favorites', 'flag', 'share'].map((item) => (
              <div key={item} className="flex flex-col items-center">
                <div className="w-24 h-24 border-4 border-black bg-white" />
                <span className="mt-2 capitalize">{item}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="mb-12">
            {isEditing ? (
              <textarea
                value={listing.description}
                onChange={(e) => setListing(prev => ({ ...prev, description: e.target.value }))}
                className="text-lg leading-relaxed max-w-4xl w-full border-2 border-gray-300 px-3 py-2 focus:border-black outline-none resize-none"
                rows={6}
                placeholder="Enter listing description"
              />
            ) : (
              <p className="text-lg leading-relaxed max-w-4xl">{listing.description}</p>
            )}
          </div>

          {/* Bottom Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-gray-600 text-white px-8 py-3 text-lg font-semibold rounded hover:bg-gray-700 flex items-center gap-2"
            >
              <Edit3 className="w-6 h-6" />
              {isEditing ? 'Stop Editing' : 'Edit'}
            </button>
            <button
              onClick={saveDraft}
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 text-lg font-semibold rounded hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-6 h-6 mr-2 inline" />
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={publishListing}
              disabled={loading}
              className="bg-green-600 text-white px-8 py-3 text-lg font-semibold rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="p-4 space-y-8">
          {/* OpenStreetMap */}
          <div className="h-[250px] overflow-hidden">
            <iframe
              title="OpenStreetMap"
              width="100%"
              height="100%"
              src="https://www.openstreetmap.org/export/embed.html"
              className="w-full h-full"
            />
          </div>

          {/* Listing Info */}
          <div className="space-y-6 text-2xl">
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              {isEditing ? (
                <input
                  type="text"
                  value={listing.location}
                  onChange={(e) => setListing(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full border-2 border-gray-300 px-2 py-1 text-md focus:border-black outline-none"
                />
              ) : (
                <p>{listing.location}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Contact Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={listing.contactName}
                  onChange={(e) => setListing(prev => ({ ...prev, contactName: e.target.value }))}
                  className="w-full border-2 border-gray-300 px-2 py-1 text-md focus:border-black outline-none"
                />
              ) : (
                <p>{listing.contactName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Created</label>
              <p className="text-md">{listing.createdAt || new Date().toLocaleString()}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Condition</label>
              {isEditing ? (
                <select
                  value={listing.condition}
                  onChange={(e) => setListing(prev => ({ ...prev, condition: e.target.value }))}
                  className="w-full border-2 border-gray-300 px-2 py-1 text-md focus:border-black outline-none"
                >
                  <option value="New with tags">New</option>
                  <option value="New without tags">Excellent</option>
                  <option value="Like new">Like new</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              ) : (
                <p>{listing.condition}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Post ID</label>
              <p className="text-md font-mono">{listing.id || 'Auto-generated'}</p>
            </div>
          </div>

          {/* Scam Warning */}
          <div className="text-red-600 text-sm leading-relaxed font-medium pt-10">
            Protect yourself from scams by being cautious with suspicious messages, fake offers, or requests for personal or financial information. If something seems too good to be true or feels suspicious, trust your judgment and report it immediately.
          </div>
        </div>
      </div>

      {/* Messages Section */}
      <div>
        <div className="border-b-2 border-black p-4 text-4xl font-medium">Messages</div>

        {/* Search */}
        <div className="p-4 border-b-2 border-black flex justify-center">
          <input
            type="text"
            placeholder="search conversations"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-2xl border-2 border-gray-500 bg-gray-300 px-4 py-3 text-2xl placeholder-black focus:border-black outline-none"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[500px]">
          {/* Conversation List */}
          <div className="border-r-2 border-black">
            {filteredConversations.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedConversation(chat.id)}
                className={`flex items-center gap-4 p-4 border-b-2 border-black cursor-pointer hover:bg-gray-100 ${
                  selectedConversation === chat.id ? 'bg-gray-200' : ''
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-gray-400" />
                <div>
                  <p className="text-xl">{chat.user}</p>
                  <p className="text-sm text-right">{chat.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-3 p-8 bg-white relative">
            {/* Messages */}
            <div className="space-y-6 mb-20">
              {messages.map((message) => (
                <div key={message.id} className={`flex items-start gap-4 ${message.isOutgoing ? 'justify-end' : ''}`}>
                  {!message.isOutgoing && <div className="w-16 h-16 rounded-full bg-gray-400 flex-shrink-0" />}
                  <div className={`rounded-[3rem] p-4 max-w-[70%] ${
                    message.isOutgoing
                      ? 'bg-blue-100 rounded-tr-none ml-auto'
                      : 'bg-gray-300 rounded-tl-none'
                  }`}>
                    <p className="text-lg">{message.content}</p>
                    <p className="text-xs text-gray-600 mt-2">{message.timestamp}</p>
                  </div>
                  {message.isOutgoing && <div className="w-16 h-16 rounded-full bg-gray-400 flex-shrink-0" />}
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="absolute bottom-8 left-8 right-8 flex gap-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 border-2 border-gray-300 px-4 py-3 text-lg focus:border-black outline-none"
              />
              <button
                onClick={sendMessage}
                className="bg-black text-white px-6 py-3 hover:bg-gray-800 flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
