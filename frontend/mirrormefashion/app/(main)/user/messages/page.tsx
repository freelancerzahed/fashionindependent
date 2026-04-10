"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Paperclip, Smile, ArrowLeft, Search, MoreVertical, MessageCircle } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export default function MessagesPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const processedIncomingUser = useRef(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const incomingUser = searchParams.get("user")
  const incomingName = searchParams.get("name")
  const incomingAvatar = searchParams.get("avatar")
  
  // Handle new parameters from profile page
  const incomingUsername = searchParams.get("username")

  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const [conversationsList, setConversationsList] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [hasMoreMessages, setHasMoreMessages] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [temporaryConversations, setTemporaryConversations] = useState<any[]>([])

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior })
    }
  }, [])

  // Fetch conversations from API
  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/conversations")
      const data = await res.json()
      console.log("Conversations:", data);
      if (data.success && Array.isArray(data.data)) {
        // Merge temporary conversations with fetched ones
        const mergedConversations = [...temporaryConversations]
        data.data.forEach((conv: any) => {
          const exists = mergedConversations.find(c => c.name.toLowerCase() === conv.name.toLowerCase())
          if (!exists) {
            mergedConversations.push(conv)
          }
        })
        setConversationsList(mergedConversations)
      } else {
        setConversationsList(temporaryConversations)
      }
    } catch (err) {
      console.error("Error fetching conversations:", err)
      setConversationsList(temporaryConversations)
    }
  }, [temporaryConversations])

  // Fetch messages for a user
  const fetchMessages = useCallback(async (user_name: string, page = 0, append = false) => {
    if (!user_name) return
    setIsLoadingMessages(true)
    try {
      const res = await fetch(`/api/chat-messages?user=${user_name}&page=${page}`)
      const data = await res.json()
      if (data.success && Array.isArray(data.data)) {
        if (append) {
          setMessages(prev => [...data.data, ...prev])
        } else {
          setMessages(data.data)
          setIsInitialLoad(true)
        }
        setHasMoreMessages(data.data.length > 0)
      } else {
        if (!append) setMessages([])
        setHasMoreMessages(false)
      }
    } catch (err) {
      console.error("Error fetching messages:", err)
      if (!append) setMessages([])
      setHasMoreMessages(false)
    } finally {
      setIsLoadingMessages(false)
    }
  }, [])

  const handleScroll = useCallback(
    (event: any) => {
      const element = event.currentTarget
      const scrollTop = element.scrollTop
      const threshold = 100
      if (scrollTop < threshold && hasMoreMessages && !isLoadingMessages && selectedConversation) {
        const nextPage = currentPage + 1
        setCurrentPage(nextPage)
        fetchMessages(selectedConversation.name, nextPage, true)
      }
    },
    [currentPage, hasMoreMessages, isLoadingMessages, selectedConversation, fetchMessages]
  )

  useEffect(() => {
    if (!isLoadingMessages && !isInitialLoad) {
      scrollToBottom()
    }
    if (isInitialLoad) {
      setTimeout(() => {
        scrollToBottom("auto")
        setIsInitialLoad(false)
      }, 100)
    }
  }, [messages, isLoadingMessages, isInitialLoad, scrollToBottom])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  // Handle incoming user from URL params (both old and new formats)
  useEffect(() => {
    const userParam = incomingUser || incomingUsername;
    const nameParam = incomingName;
    
    if (userParam && !processedIncomingUser.current) {
      processedIncomingUser.current = true
      const existingConversation = conversationsList.find(conv => conv.name.toLowerCase() === userParam.toLowerCase())
      
      if (existingConversation) {
        setSelectedConversation(existingConversation)
        setCurrentPage(0)
        fetchMessages(existingConversation.name, 0)
      } else {
        // Create a new conversation with the user
        const newConversation = {
          id: Date.now(),
          name: nameParam ? decodeURIComponent(nameParam) : userParam,
          avatar: incomingAvatar ? decodeURIComponent(incomingAvatar) : "/placeholder.svg?height=40&width=40",
          lastMessage: "Start a conversation...",
          timestamp: "now",
          unread: 0,
          online: true,
        }
        
        // If we don't have name/avatar, fetch them from API
        if (!nameParam || !incomingAvatar) {
          fetch(`/api/user?username=${userParam}`)
            .then(res => res.json())
            .then(data => {
              if (data.success && data.data) {
                const userData = data.data;
                newConversation.name = userData.name;
                newConversation.avatar = userData.avatar || newConversation.avatar;
                setSelectedConversation({...newConversation});
                
                // Add to temporary conversations
                setTemporaryConversations(prev => {
                  const exists = prev.find(c => c.name.toLowerCase() === newConversation.name.toLowerCase())
                  if (!exists) {
                    return [...prev, newConversation]
                  }
                  return prev
                })
              }
            })
            .catch(err => {
              console.error("Error fetching user data:", err);
              // Still add the conversation even if we can't fetch full details
              setSelectedConversation(newConversation)
              setTemporaryConversations(prev => {
                const exists = prev.find(c => c.name.toLowerCase() === newConversation.name.toLowerCase())
                if (!exists) {
                  return [...prev, newConversation]
                }
                return prev
              })
            });
        } else {
          // If we have all the info, set the conversation directly
          setSelectedConversation(newConversation)
          setTemporaryConversations(prev => {
            const exists = prev.find(c => c.name.toLowerCase() === newConversation.name.toLowerCase())
            if (!exists) {
              return [...prev, newConversation]
            }
            return prev
          })
        }
        
        setMessages([])
        setCurrentPage(0)
        setHasMoreMessages(false)
      }
      router.replace("/user/messages", { scroll: false })
    }
  }, [incomingUser, incomingUsername, incomingName, incomingAvatar, router, fetchMessages, conversationsList])

  useEffect(() => {
    const userParam = incomingUser || incomingUsername;
    if (!userParam) processedIncomingUser.current = false
  }, [incomingUser, incomingUsername])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return
    try {
      const res = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation_id: selectedConversation.name, message: newMessage }),
      })
      const data = await res.json()
      if (data.success) {
        const message = {
          id: data.data.id,
          senderId: "current",
          senderName: "You",
          content: newMessage,
          timestamp: new Date(data.data.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isOwn: true,
        }
        setMessages(prev => [...prev, message])
        setNewMessage("")
        setIsInitialLoad(false)
        
        // Update the conversation in both temporary and main lists
        const updatedConversation = { 
          ...selectedConversation, 
          lastMessage: newMessage, 
          timestamp: "now" 
        }
        
        setSelectedConversation(updatedConversation)
        
        // Update temporary conversations
        setTemporaryConversations(prev => 
          prev.map(conv => 
            conv.name.toLowerCase() === selectedConversation.name.toLowerCase() 
              ? updatedConversation 
              : conv
          )
        )
        
        // Also update in main list if it exists there
        setConversationsList(prev => 
          prev.map(conv => 
            conv.name.toLowerCase() === selectedConversation.name.toLowerCase() 
              ? updatedConversation 
              : conv
          )
        )
      }
    } catch (err) {
      console.error("Error sending message:", err)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleConversationSelect = (conversation: any) => {
    setSelectedConversation(conversation)
    setCurrentPage(0)
    setHasMoreMessages(true)
    setIsInitialLoad(true)
    fetchMessages(conversation.name, 0)
  }

  return (
    <div className="pb-4 md:p-6 md:pb-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[calc(100vh-8rem)] md:h-[600px]">
        <div className="flex h-full">
          {/* Conversations List */}
          <div
            className={`w-full md:w-80 border-r border-gray-200 flex flex-col ${
              selectedConversation ? "hidden md:flex" : "flex"
            }`}
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Messages</h2>
                <Button variant="ghost" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search conversations..." className="pl-10" />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2">
                {Array.isArray(conversationsList) &&
                  conversationsList.map(conv => (
                    <div
                      key={conv.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedConversation?.id === conv.id
                          ? "bg-primary-50 border border-primary-200"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleConversationSelect(conv)}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={conv.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{conv.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {conv.online && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm truncate">{conv.name}</h3>
                          <span className="text-xs text-gray-500">{conv.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                      </div>
                      {conv.unread > 0 && (
                        <Badge className="bg-primary-600 text-white text-xs">{conv.unread}</Badge>
                      )}
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col ${selectedConversation ? "flex" : "hidden md:flex"}`}>
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setSelectedConversation(null)}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={selectedConversation.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{selectedConversation.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {selectedConversation.online && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{selectedConversation.name}</h3>
                        <p className="text-sm text-gray-500">
                          {selectedConversation.online ? "Online" : "Last seen 2h ago"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 pb-4 p-2 md:pb-4" onScroll={handleScroll} ref={scrollAreaRef}>
                  <div className="space-y-4">
                    {messages.length === 0 && !isLoadingMessages && (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <MessageCircle className="h-8 w-8 text-primary-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
                        <p className="text-gray-500">Send a message to {selectedConversation.name}</p>
                      </div>
                    )}

                    {messages.map(message => (
                      <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${
                            message.isOwn ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${message.isOwn ? "text-primary-100" : "text-gray-500"}`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}

                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 relative">
                      <Input
                        placeholder={`Message ${selectedConversation.name}...`}
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pr-10"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2"
                      >
                        <Smile className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-primary-600 hover:bg-primary-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
                  <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}