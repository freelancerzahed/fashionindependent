import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Camera, Sparkles, Bell } from "lucide-react"

export default function LookBookPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-600 mb-2">Look Book</h1>
        <p className="text-gray-600">Create, organize, and share your favorite outfit combinations</p>
      </div>

      <Card className="border-2 border-dashed border-gray-200">
        <CardContent className="flex flex-col items-center justify-center py-16 px-8 text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-10 w-10 text-primary-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-yellow-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">Coming Soon!</h2>
          <p className="text-gray-600 mb-6 max-w-md">
            We're working hard to bring you an amazing Look Book experience where you can create, organize, and share
            your favorite outfit combinations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 w-full max-w-2xl">
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <Camera className="h-8 w-8 text-primary-600 mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Photo Outfits</h3>
              <p className="text-sm text-gray-600 text-center">Capture and save your favorite looks</p>
            </div>

            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <BookOpen className="h-8 w-8 text-primary-600 mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Organize Collections</h3>
              <p className="text-sm text-gray-600 text-center">Group outfits by occasion or style</p>
            </div>

            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <Sparkles className="h-8 w-8 text-primary-600 mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Get Inspired</h3>
              <p className="text-sm text-gray-600 text-center">Discover new styling ideas</p>
            </div>
          </div>

          <Button className="bg-primary-600 hover:bg-primary-700 text-white">
            <Bell className="h-4 w-4 mr-2" />
            Notify Me When Ready
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
