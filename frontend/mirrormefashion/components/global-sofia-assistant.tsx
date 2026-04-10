"use client";

import type React from "react";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Bot, Minimize2, Send } from "lucide-react";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";

export type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

const dummyDB = {
  conversations: new Map<string, Message[]>(),

  createMessage(conversationId: string, message: Message) {
    if (!this.conversations.has(conversationId)) {
      this.conversations.set(conversationId, []);
    }
    this.conversations.get(conversationId)?.push(message);
    return message;
  },

  getMessages(conversationId: string) {
    return this.conversations.get(conversationId) || [];
  },
};

// Initialize with welcome message
dummyDB.createMessage("default", {
  id: "1",
  content: "Hi there! I'm Sofia, your personal shopping assistant. How can I help you today?",
  role: "assistant",
  timestamp: new Date(),
});

export default function GlobalSofiaAssistant() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  
  // All hooks must be declared unconditionally at the top
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewSuggestion, setHasNewSuggestion] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>("default");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const initConversation = useCallback(async () => {
    try {
      const convMessages = dummyDB.getMessages(conversationId);
      setMessages(convMessages);
    } catch (error) {
      console.error("Failed to initialize conversation:", error);
    }
  }, [conversationId]);

  // Check if we're on an auth page (do this after all hooks)
  const isAuthPage = pathname?.includes("/auth/") || pathname?.includes("/login") || pathname?.includes("/register");
  
  // All hooks must be called before any conditional returns
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setHasNewSuggestion(true);
    const timer = setTimeout(() => setHasNewSuggestion(false), 5000);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      initConversation();
    }
  }, [isOpen, initConversation]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // If we're on an auth page, don't render the assistant (moved after all hooks)
  if (isAuthPage) return null;

  const handleOpen = () => {
    setIsOpen(true);
    setHasNewSuggestion(false);
  };

  const getAIResponse = (input: string): string => {
    const responses = [
      `I understand you're asking about "${input}". Can you tell me more?`,
      `Regarding "${input}", I recommend checking our featured collection.`,
      `I'd be happy to help with "${input}". What specific information do you need?`,
      `"${input}" is a great question! Our team can assist with that.`,
      `For "${input}", you might find our help center articles useful.`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    dummyDB.createMessage(conversationId, userMessage);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(input),
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      dummyDB.createMessage(conversationId, assistantMessage);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      {/* Side Access Bubble */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleOpen}
                variant="outline"
                size="icon"
                className="h-12 w-8 rounded-l-full rounded-r-none border-r-0 bg-white/90 backdrop-blur-sm hover:bg-primary-50 border-primary-200 text-primary-600 shadow-lg transition-all duration-300 hover:w-10"
              >
                <Bot className="h-5 w-5" />
                {hasNewSuggestion && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-primary-600 rounded-full animate-pulse" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Sofia AI Assistant</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Mobile Drawer */}
      {isMobile ? (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent className="h-full flex flex-col">
            <DrawerHeader className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <DrawerTitle className="text-white text-xl">Sofia AI Assistant</DrawerTitle>
                    <p className="text-primary-100 text-sm">Your personal shopping assistant</p>
                  </div>
                </div>
                <Button
                  onClick={() => setIsOpen(false)}
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
              </div>
            </DrawerHeader>
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === "user" ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-100 text-gray-800">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </DrawerContent>
        </Drawer>
      ) : (
        // Desktop Dialog
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-md max-h-[80vh] p-0 flex flex-col">
            <DialogHeader className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <DialogTitle className="text-white">Sofia AI Assistant</DialogTitle>
                    <p className="text-primary-100 text-sm">Your personal shopping assistant</p>
                  </div>
                </div>
              </div>
            </DialogHeader>
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === "user" ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-100 text-gray-800">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="p-6 border-t">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
