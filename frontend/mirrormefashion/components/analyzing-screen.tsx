"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export default function AnalyzingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Analyzing Your Body Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-gray-600">
            <p className="mb-4">Our AI is creating your personalized body model...</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Processing measurements</span>
                <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Calculating proportions</span>
                <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Drawing model</span>
                <div className="w-6 h-6 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
