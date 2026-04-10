"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export default function AnalyzingScreen() {
  return (
    <div className="w-full h-full bg-neutral-50/95 backdrop-blur-sm flex items-center justify-center">
      <Card className="mx-4 w-full max-w-[min(calc(100%-2rem),20rem)] shadow-lg">
        <CardHeader className="text-center py-3 px-4">
          <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <CardTitle className="text-lg font-bold">
            Loading Your Body Model
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          <div className="text-center text-muted-foreground">
            <p className="mb-4 text-sm">Creating your personalized 3D model...</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs">Loading 3D assets</span>
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs">Applying shape keys</span>
                <div className="w-5 h-5 border-2 border-primary/80 border-t-transparent rounded-full animate-spin" 
                  style={{ animationDelay: "0.2s" }}></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs">Initializing renderer</span>
                <div className="w-5 h-5 border-2 border-primary/60 border-t-transparent rounded-full animate-spin"
                  style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}