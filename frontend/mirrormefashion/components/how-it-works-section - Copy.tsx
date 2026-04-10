"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Brain, Users, Sparkles, Zap, ArrowRight } from "lucide-react"

import Image from "next/image"
interface HowItWorksSectionProps {
  onSectionChange: (section: string) => void
  scrollToSection: (sectionId: string) => void
}

export default function HowItWorksSection({ onSectionChange, scrollToSection }: HowItWorksSectionProps) {
  return (
    <section
      id="howItWorksSection"
      className="min-w-full snap-center relative overflow-hidden pt-5"
    >
      {/* Background Image with Blur */}
       <Image
               src="/img/bg-fashion.jpeg"
               alt="Fashion model"
               fill
               className="object-cover scale-105 transition-transform duration-[20s] ease-linear hover:scale-110"
               priority
             />
             <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-primary-900/60 to-primary-800/80"></div>
     

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16 pb-12 sm:pb-16 lg:pb-20">
       <div className="text-center mb-8">
          <div className="inline-flex items-center bg-gradient-to-r from-primary-100 to-primary-50 px-3 py-1.5 rounded-full mb-4 shadow-sm border border-primary-200/50">
            <Brain className="w-4 h-4 mr-2 text-primary-600" />
            <span className="text-xs font-bold text-primary-700 uppercase tracking-wider">
              Revolutionary Technology
            </span>
          </div>

          <h2 className="text-2xl lg:text-4xl font-black text-gray-900 mb-3 leading-tight tracking-tight">
             How the Mirror Me Fashion AI Fashion 
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400">
              Advisor Works
            </span>
          </h2>

          <p className="text-base lg:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
          Revolutionary AI technology that learns your body type and style preferences to deliver free personalized fashion advice with unprecedented accuracy.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {/* Step 1 */}
          <Card className="group text-center hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-md hover:bg-white/90 transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden rounded-2xl shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/50 to-yellow-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-4 right-4 w-10 h-10 bg-red-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-sm">1</span>
            </div>
            <CardHeader className="pb-3 relative z-10">
              <div className="w-12 h-12 bg-red-200 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="w-6 h-6 text-red-700" />
              </div>
              <CardTitle className=" text-lg text-red-700 font-black tracking-tight">Body Analysis</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 px-4 pb-6">
              <p className="text-gray-800 text-sm leading-relaxed font-medium">
                Our advanced AI analyzes your measurements and style goals through conversation with the Virtual Fashion Stylist (Sophia) to understand your fashion needs with scientific precision.
              </p>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="group text-center hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-md hover:bg-white/90 transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden rounded-2xl shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-purple-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-4 right-4 w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-sm">2</span>
            </div>
            <CardHeader className="pb-3 relative z-10">
              <div className="w-12 h-12 bg-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-purple-600 text-lg font-black tracking-tight">Style Preferences</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 px-4 pb-6">
              <p className="text-gray-800 text-sm leading-relaxed font-medium">
                Share your style preferences and budget with Sophia within the chat to access free and accurate fashion advice using natural conversation.
              </p>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="group text-center hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-md hover:bg-white/90 transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden rounded-2xl shadow-lg sm:col-span-2 lg:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-red-800/50 to-red-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-4 right-4 w-10 h-10 bg-red-800 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-sm">3</span>
            </div>
            <CardHeader className="pb-3 relative z-10">
              <div className="w-12 h-12 bg-red-200 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Zap className="w-6 h-6 text-red-700" />
              </div>
              <CardTitle className="text-red-700 text-lg font-black tracking-tight">Smart Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 px-4 pb-6">
              <p className="text-gray-800 text-sm leading-relaxed font-medium">
                Receive curated fashion recommendations that fit and enhance your body type. Access product suggestions from fashion sellers across the globe.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Buttons */}
        <div className="text-center flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 px-4 pb-16 sm:pb-12 lg:pb-8">
          <Button
            size="lg"
            className="w-full sm:w-80 px-6 py-3 text-base sm:text-lg font-bold rounded-full shadow-2xl transition-all duration-300 group bg-red-500 hover:bg-red-600 text-white relative overflow-hidden"
            onClick={() => {
              onSectionChange("chat")
              setTimeout(() => scrollToSection("sopiaChatSection"), 500)
            }}
          >
            I’m a Shopper
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
       <Button
         size="lg"
         className="w-full sm:w-80 px-6 py-3 text-base sm:text-lg font-bold rounded-full shadow-2xl transition-all duration-300  group
                    bg-purple-500 hover:bg-purple-600
                    text-white relative overflow-hidden"
         onClick={() => {
           onSectionChange("professional")
           setTimeout(() => scrollToSection("professionalSection"), 500)
         }}
       >
         I'm a Fashion Professional
           <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
       </Button>

        </div>
      </div>
    </section>
  )
}
