"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, Star, Users, Award } from "lucide-react"

interface HeroSectionProps {
  scrollToSection: (sectionId: string) => void
}

export default function HeroSection({ scrollToSection }: HeroSectionProps) {
  return (
    <section id="heroSection" className="min-w-full h-full snap-center relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/img/hero-bg.jpg"
          alt="Fashion model"
          fill
          className="object-cover scale-105 transition-transform duration-[20s] ease-linear hover:scale-110"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-primary-900/60 to-primary-800/80"></div>

        {/* Enhanced Background Elements */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-primary-100/30 to-primary-200/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-56 h-56 bg-gradient-to-br from-primary-200/20 to-primary-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-orange-500/5 rounded-full blur-xl animate-pulse delay-500"></div>

        {/* Geometric Elements */}
        <div className="absolute top-1/3 right-1/4 w-24 h-24 border-2 border-primary-300/20 rounded-3xl rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-1/3 left-1/3 w-16 h-16 bg-gradient-to-br from-primary-400/15 to-primary-500/10 rounded-2xl rotate-12 animate-bounce-slow"></div>
      </div>

      <div className="relative z-10 h-full flex items-center justify-center px-8">
        <div className="text-center text-white max-w-5xl w-full">
          <div className="mb-6 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 mb-4 shadow-lg">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
              <span className="text-sm font-semibold tracking-wide">Meet the First and Only Virtual Fashion Stylist</span>
            </div>

            <h1 className="text-5xl lg:text-5xl font-black mb-4 leading-tight tracking-tight">
              Meet the First and Only
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-yellow-400 to-pink-400 animate-gradient-x">
                Virtual Fashion Stylist
              </span>
            </h1>

            <p className="text-xl lg:text-2xl mb-8 font-light text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Discover fashion that fits and flatters your unique and personal style.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 justify-center items-center mb-8">
            <Button
              size="lg"
              className="px-8 py-4 text-lg font-bold rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 group bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white relative"
              onClick={() => scrollToSection("howItWorksSection")}
            >
              Start Your Style Journey
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Link href="/shop">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg font-bold rounded-full bg-white/10 backdrop-blur-xl transition-all duration-300 transform hover:scale-105 group relative"
              >
                Explore Collections
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          <div className="flex justify-center items-center space-x-6 text-sm">
            <div className="flex items-center bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 shadow-lg">
              <Star className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="font-semibold">4.9/5 Rating</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 shadow-lg">
              <Users className="w-4 h-4 text-primary-400 mr-2" />
              <span className="font-semibold">50K+ Users</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 shadow-lg">
              <Award className="w-4 h-4 text-green-400 mr-2" />
              <span className="font-semibold">AI Powered</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
