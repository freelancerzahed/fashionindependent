"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import FriendSuggestions from "@/components/friend-suggestions"
import { ChevronRight } from "lucide-react"
import AiAssistant from "@/components/ai-assistant"

interface GarmentItem {
  id: string
  title: string
  description: string
  image: string
}

const garmentItems: GarmentItem[] = [
  {
    id: "1",
    title: "Classic White Shirt",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eget ut mauris tempus, magna rutrum. In vitam sit mauris tempus, magna rutrum. In vitam sit mauris tempus, magna rutrum. Suspendisse eu consequat nisi. Donec eget nisi nec nisi consequat nisi. Suspendisse eu consequat nisi. Donec eget nisi nec nisi consequat nisi.",
    image: "/placeholder.svg?height=300&width=200&text=Garment+Image",
  },
  {
    id: "2",
    title: "Essential Black Pants",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eget ut mauris tempus, magna rutrum. In vitam sit mauris tempus, magna rutrum. In vitam sit mauris tempus, magna rutrum. Suspendisse eu consequat nisi. Donec eget nisi nec nisi consequat nisi. Suspendisse eu consequat nisi. Donec eget nisi nec nisi consequat nisi.",
    image: "/placeholder.svg?height=300&width=200&text=Garment+Image",
  },
  {
    id: "3",
    title: "Versatile Blazer",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eget ut mauris tempus, magna rutrum. In vitam sit mauris tempus, magna rutrum. In vitam sit mauris tempus, magna rutrum. Suspendisse eu consequat nisi. Donec eget nisi nec nisi consequat nisi. Suspendisse eu consequat nisi. Donec eget nisi nec nisi consequat nisi.",
    image: "/placeholder.svg?height=300&width=200&text=Garment+Image",
  },
]

export default function ClosetEssentialsPage() {
  const handleAddFriend = (userId: string) => {
    console.log(`Adding friend: ${userId}`)
  }

  return (
    <div className="container mx-auto px-4 py-6">
    
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Garment Items */}
        <div className="lg:col-span-2 space-y-6">
            {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary-600 mb-3">Closet Essentials</h1>
        <p className="text-gray-700 leading-relaxed max-w-4xl">
          [Body Shape Name] Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eget ut mauris tempus, magna
          rutrum. In vitam sit mauris tempus, magna rutrum. In vitam sit mauris tempus, magna rutrum. Suspendisse eu
          consequat nisi. Donec eget nisi nec nisi consequat nisi. Suspendisse eu consequat nisi. Donec eget nisi nec
          nisi consequat nisi. Suspendisse eu consequat nisi. Donec eget nisi nec nisi consequat nisi. Suspendisse eu
          consequat nisi. Donec eget nisi nec nisi consequat nisi.
        </p>
      </div>

          {garmentItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row gap-4 p-6">
                  {/* Garment Image */}
                  <div className="flex-shrink-0">
                    <div className="w-full md:w-48 h-64 bg-white border-4 border-black flex items-center justify-center">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Garment Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-6">{item.description}</p>
                    </div>

                    <Button className="bg-primary-600 hover:bg-primary-700 text-white mt-4 w-fit">
                      Shop this item
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right Column - Ad Space & Friend Suggestions */}
        <div className="">
          

          {/* Friend Suggestions */}
         <div className="py-2"> <AiAssistant  /></div>
        <div className="py-2"> <FriendSuggestions onAddFriend={handleAddFriend} /></div>
          {/* Ad Space */}
          <Card className="bg-gray-50 border-2 border-dashed border-gray-300">
            <CardContent className="p-8">
              <div className="flex items-center justify-center h-64">
                <p className="text-2xl font-semibold text-gray-400">Ad Space</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
