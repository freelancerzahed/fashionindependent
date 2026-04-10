"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronDown, Star, Users, Zap } from "lucide-react"

interface MobileHeroSectionProps {
  onSectionChange: (section: string) => void
}

export default function MobileHeroSection({ onSectionChange }: MobileHeroSectionProps) {
  return (
    <section
      id="heroSection"
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute top-20 right-8 w-32 h-32 bg-gradient-to-br from-primary-400/30 to-primary-300/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-40 left-6 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 right-12 w-40 h-40 bg-gradient-to-br from-primary-500/20 to-primary-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Geometric Shapes */}
        <div className="absolute top-1/3 left-4 w-16 h-16 border-2 border-primary-300/30 rounded-3xl rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-1/4 left-8 w-12 h-12 bg-gradient-to-br from-primary-400/20 to-primary-500/10 rounded-2xl rotate-12 animate-bounce-slow"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-8 gap-4 h-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="border border-white/10 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-6 safe-area-inset-top">
        <div className="text-center text-white max-w-xs w-full">
          {/* Status Badge */}
          <div className="inline-flex items-center px-3 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 mb-6 shadow-lg animate-fade-in">
            <ArrowRight className="w-3 h-3 mr-2 text-yellow-400" />
            <span className="text-xs font-semibold tracking-wide">
              Meet the First and Only Virtual Fashion Stylist
            </span>
          </div>

          {/* Main Heading */}
          <div className="mb-8 animate-slide-up">
            <h1 className="text-5xl font-black mb-4 leading-tight tracking-tight">
              Meet the First and Only
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 animate-gradient-x">
                Virtual Fashion Stylist
              </span>
            </h1>
            <p className="text-lg mb-3 font-light text-gray-100 leading-relaxed">
              Discover fashion that fits and flatters your unique and personal style.
            </p>
          </div>

          {/* Interactive Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 border border-white/20 shadow-lg group">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                <span className="font-black text-lg">4.9</span>
              </div>
              <p className="text-xs text-gray-300 font-semibold uppercase tracking-wider">Rating</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 border border-white/20 shadow-lg group">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-5 h-5 text-primary-300 mr-1" />
                <span className="font-black text-lg">50K+</span>
              </div>
              <p className="text-xs text-gray-300 font-semibold uppercase tracking-wider">Users</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 border border-white/20 shadow-lg group">
              <div className="flex items-center justify-center mb-2">
                <Zap className="w-5 h-5 text-green-400 mr-1" />
                <span className="font-black text-lg">AI</span>
              </div>
              <p className="text-xs text-gray-300 font-semibold uppercase tracking-wider">Powered</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4 mb-8">
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-3 text-lg font-bold rounded-2xl shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 group border-0"
              onClick={() => onSectionChange("features")}
            >
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full border-2 border-white/30 text-white hover:bg-white hover:text-primary-600 py-3 text-lg font-bold rounded-2xl bg-white/10 backdrop-blur-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg group relative"
              onClick={() => onSectionChange("features")}
            >
              Explore Features
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="animate-bounce opacity-70">
            <div className="flex flex-col items-center">
              <p className="text-sm text-white/80 mb-2 font-medium">Swipe up to explore</p>
              <ChevronDown className="w-5 h-5 text-white/60" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
