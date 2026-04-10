"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"

interface FriendSuggestion {
  id: string
  name: string
  avatar: string
  mutualFriends: number
}

const initialSuggestions: FriendSuggestion[] = [
  { id: "user1", name: "Jane Doe", avatar: "/placeholder.svg?height=40&width=40&text=JD", mutualFriends: 12 },
  { id: "user2", name: "John Smith", avatar: "/placeholder.svg?height=40&width=40&text=JS", mutualFriends: 8 },
  { id: "user3", name: "Emily White", avatar: "/placeholder.svg?height=40&width=40&text=EW", mutualFriends: 5 },
  { id: "user4", name: "Michael Brown", avatar: "/placeholder.svg?height=40&width=40&text=MB", mutualFriends: 3 },
  { id: "user5", name: "Sarah Green", avatar: "/placeholder.svg?height=40&width=40&text=SG", mutualFriends: 10 },
]

interface FriendSuggestionsProps {
  onAddFriend: (userId: string) => void
}

export default function FriendSuggestions({ onAddFriend }: FriendSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<FriendSuggestion[]>(initialSuggestions)

  const handleAddFriendClick = (userId: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== userId))
    onAddFriend(userId)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Friend Suggestions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.length > 0 ? (
          suggestions.map((suggestion) => (
            <div key={suggestion.id} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarImage src={suggestion.avatar || "/placeholder.svg"} alt={suggestion.name} />
                  <AvatarFallback>{suggestion.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 overflow-hidden">
                  <p className="font-medium truncate">{suggestion.name}</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                    {suggestion.mutualFriends} mutual friends
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => handleAddFriendClick(suggestion.id)}
                className="shrink-0 bg-primary-600 hover:bg-primary-700 text-xs sm:text-sm  text-white px-2 sm:px-3"
              >
                Add
              </Button>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            No new suggestions at the moment.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
