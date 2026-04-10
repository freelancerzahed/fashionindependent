"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, Trash2 } from "lucide-react"

const initialAssistantMessages = [
  {
    id: 1,
    type: "assistant",
    message: "👋 Hi there! Need help with anything?",
    timestamp: "now",
  },
  {
    id: 2,
    type: "user",
    message: "Yes! Can you help me track my order?",
    timestamp: "2 min ago",
  },
  {
    id: 3,
    type: "assistant",
    message: "Just go to your profile → Orders section",
    timestamp: "2 min ago",
  },
]

export default function AIAssistant() {
  const [messages, setMessages] = useState(initialAssistantMessages)
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const chatBodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const simulateTyping = (responseText: string, callback: () => void) => {
    setIsTyping(true)
    let i = 0
    const typingSpeed = 30 // milliseconds per character
    const tempMessage = {
      id: Date.now() + 1,
      type: "assistant" as const,
      message: "",
      timestamp: "now",
    }

    // Add empty message first
    setMessages((prev) => [...prev, tempMessage])

    const typingInterval = setInterval(() => {
      if (i < responseText.length) {
        setMessages((prev) => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1] = {
            ...newMessages[newMessages.length - 1],
            message: responseText.substring(0, i + 1),
          }
          return newMessages
        })
        i++
      } else {
        clearInterval(typingInterval)
        setIsTyping(false)
        callback()
      }
    }, typingSpeed)
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const newMessage = {
      id: Date.now(),
      type: "user" as const,
      message: inputMessage,
      timestamp: "now",
    }

    setMessages((prev) => [...prev, newMessage])
    setInputMessage("")

    // Simulate AI response with typing animation
    setTimeout(() => {
      const responses = [
        "I'm here to help! Let me know if you need anything else.",
        "That's a great question! Let me check that for you.",
        "I can definitely help with that. One moment please...",
        "Thanks for your patience while I look that up.",
        "Here's what I found regarding your question:",
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      simulateTyping(randomResponse, () => {
        // Callback after typing completes
      })
    }, 500)
  }

  const handleClearChat = () => {
    setMessages([])
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          Sofia AI Assistant
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClearChat}
          aria-label="Clear chat"
          className="text-gray-500 hover:text-primary-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Messages */}
        <div ref={chatBodyRef} className="space-y-3 max-h-64 overflow-y-auto">
          {messages.length === 0 && <div className="text-center text-gray-500 py-4">Start a new conversation!</div>}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  msg.type === "user" ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-800"
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-800">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-primary-600 hover:bg-primary-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
