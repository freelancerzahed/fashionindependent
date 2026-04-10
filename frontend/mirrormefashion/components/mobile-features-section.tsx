"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Camera, Palette, Target, Lightbulb, ArrowRight } from "lucide-react"

interface MobileFeaturesSectionProps {
  onSectionChange: (section: string) => void
}

export default function MobileFeaturesSection({ onSectionChange }: MobileFeaturesSectionProps) {
  return (
    <section
      id="featuresSection"
      className="min-h-screen py-8 px-4 relative overflow-hidden bg-[url('/images/bg-fashion.jpg')] bg-cover bg-center"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-br from-primary-100/60 to-primary-200/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-br from-rose-200/40 to-rose-300/30 rounded-full blur-2xl"></div>

        {/* Geometric Patterns */}
        <div className="absolute top-1/4 right-8 w-24 h-24 border-2 border-primary-200/30 rounded-3xl rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-1/3 left-8 w-16 h-16 bg-gradient-to-br from-rose-300/20 to-rose-400/10 rounded-2xl rotate-12 animate-bounce-slow"></div>
      </div>

      <div className="relative z-10 max-w-sm mx-auto safe-area-inset-top pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-100 to-primary-50 rounded-full mb-4 shadow-sm border border-primary-200/50">
            <Brain className="w-4 h-4 mr-2 text-primary-600" />
            <span className="text-xs font-bold text-primary-700 uppercase tracking-wider">AI Technology</span>
          </div>

          <h2 className="text-3xl font-black text-purple-700 mb-4 tracking-tight leading-tight">
            How the Mirror Me Fashion <br />
            <span className="block">AI Fashion Advisor Works</span>
          </h2>
          <p className="text-base text-gray-700 leading-relaxed font-medium">
            Experience Sophia’s intelligent guidance that adapts to your body, style, and budget.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="space-y-4">
          {/* Step 1 */}
          <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-xl transform hover:-translate-y-2 hover:scale-105 active:scale-95 relative overflow-hidden rounded-3xl shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50/80 to-primary-100/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-sm">1</span>
            </div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-black text-gray-900 mb-2 tracking-tight">Body Analysis</h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-medium">
                    Sophia carefully analyzes your body type using AI-driven insights, blending science with style to
                    understand your best fit.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-xl transform hover:-translate-y-2 hover:scale-105 active:scale-95 relative overflow-hidden rounded-3xl shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 to-pink-100/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-sm">2</span>
            </div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-black text-gray-900 mb-2 tracking-tight">Style Matching</h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-medium">
                    Sophia learns your preferences, matches your style, and keeps your budget in mind while exploring
                    fashion trends worldwide.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-xl transform hover:-translate-y-2 hover:scale-105 active:scale-95 relative overflow-hidden rounded-3xl shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-50/80 to-rose-100/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-rose-600 to-rose-700 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-sm">3</span>
            </div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-600 to-rose-700 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-black text-gray-900 mb-2 tracking-tight">Smart Recommendations</h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-medium">
                    Get tailored outfit recommendations that fit and enhance your body type, sourced from trusted sellers
                    worldwide.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Buttons */}
        <div className="grid grid-cols-2 gap-4 text-center mt-8">
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white px-6 py-4 text-base font-bold rounded-3xl shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center group"
            onClick={() => onSectionChange("chat")}
          >
            <span>Try AI Stylist</span>
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-full border-2 border-primary-500 text-primary-600 hover:bg-primary-50 px-6 py-4 text-base font-bold rounded-3xl shadow-md transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center group"
            onClick={() => onSectionChange("explore")}
          >
            <span>Explore Outfits</span>
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  )
}
