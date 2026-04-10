"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle, Heart, Award, Star, TrendingUp, Rocket, Globe } from "lucide-react"

interface BetaSectionProps {
  isMobile: boolean
  onSectionChange: (section: string) => void
  scrollToSection: (sectionId: string) => void
}

export default function BetaSection({ isMobile, onSectionChange, scrollToSection }: BetaSectionProps) {
  if (isMobile) {
    return (
      <section id="betaSection" className="min-h-screen relative overflow-hidden pb-24">
        <div className="absolute inset-0">
          <Image
            src="/img/section_1.jpeg"
            alt="Fashion professionals"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/85 via-primary-800/75 to-primary-900/85"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12 pb-24 safe-area-inset-top">
          <div className="max-w-sm mx-auto text-white text-center w-full">
            {/* Native Beta Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-xl rounded-full border border-yellow-400/30 mb-6 shadow-lg">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-semibold">Beta Launch Special</span>
            </div>

            <h1 className="text-2xl font-bold mb-4 leading-tight tracking-tight">
              <span className="text-yellow-300 underline decoration-wavy decoration-2">Free</span> styling for{" "}
              <span className="text-yellow-300 underline decoration-wavy decoration-2">everyone</span>
            </h1>
            <p className="text-lg mb-6 font-light text-gray-200">Welcome to Mirror Me Fashion Beta!</p>

            {/* Native Feature List */}
            <div className="space-y-3 mb-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-lg">
                <div className="flex items-start">
                  <CheckCircle className="text-green-400 mr-3 w-4 h-4 flex-shrink-0 mt-1" />
                  <p className="text-sm text-left">
                    Get <span className="font-bold text-yellow-300">Free & Instant</span> fashion advice from the
                    World's <span className="font-bold text-yellow-300">First AI Stylist</span>
                  </p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-lg">
                <div className="flex items-start">
                  <CheckCircle className="text-green-400 mr-3 w-4 h-4 flex-shrink-0 mt-1" />
                  <p className="text-sm text-left">Shop from global retailers with personalized recommendations</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-lg">
                <div className="flex items-start">
                  <CheckCircle className="text-green-400 mr-3 w-4 h-4 flex-shrink-0 mt-1" />
                  <p className="text-sm text-left">Join as a Fashion Professional to expand your business</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-lg">
                <div className="flex items-start">
                  <CheckCircle className="text-green-400 mr-3 w-4 h-4 flex-shrink-0 mt-1" />
                  <p className="text-sm text-left">Grow followers & monetize your brand with AI insights</p>
                </div>
              </div>
            </div>

            {/* Native Action Buttons */}
            <div className="space-y-3 mb-6">
              <Button
                size="lg"
                className="w-full bg-white text-primary-600 hover:bg-gray-100 py-3 text-base font-semibold rounded-2xl shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 group border-0"
                onClick={() => onSectionChange("chat")}
              >
                <Heart className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                I'm a Shopper
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full border-2 border-white/30 text-white hover:bg-white hover:text-primary-600 py-3 text-base font-semibold rounded-2xl bg-white/10 backdrop-blur-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                onClick={() => {
                  onSectionChange("professional")
                  setTimeout(() => scrollToSection("professionalSection"), 500)
                }}
              >
                <Award className="mr-2 w-4 h-4 group-hover:rotate-12 transition-transform" />
                I'm a Professional
              </Button>
            </div>

            {/* Mobile Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all duration-300 group shadow-lg">
                <div className="text-lg font-black text-yellow-400 mb-1 group-hover:scale-110 transition-transform">
                  50K+
                </div>
                <div className="text-xs font-semibold text-gray-200 uppercase tracking-wider">Users</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all duration-300 group shadow-lg">
                <div className="text-lg font-black text-primary-300 mb-1 group-hover:scale-110 transition-transform">
                  4.9★
                </div>
                <div className="text-xs font-semibold text-gray-200 uppercase tracking-wider">Rating</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all duration-300 group shadow-lg">
                <div className="text-lg font-black text-green-400 mb-1 group-hover:scale-110 transition-transform">
                  AI
                </div>
                <div className="text-xs font-semibold text-gray-200 uppercase tracking-wider">Powered</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Desktop version
  return (
    <section id="betaSection" className="min-w-full h-full snap-center relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/img/section_1.jpeg"
          alt="Fashion professionals"
          fill
          className="object-cover scale-105 transition-transform duration-[20s] ease-linear"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/85 via-primary-800/75 to-primary-900/85"></div>

        {/* Enhanced Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-yellow-500/15 to-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-primary-200/20 to-primary-300/15 rounded-full blur-2xl animate-pulse delay-1000"></div>

        {/* Geometric Elements */}
        <div className="absolute top-1/3 right-1/3 w-32 h-32 border-2 border-yellow-400/20 rounded-3xl rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-gradient-to-br from-primary-400/15 to-primary-500/10 rounded-2xl rotate-12 animate-bounce-slow"></div>
      </div>

      <div className="relative z-10 h-full flex items-center justify-center px-4 py-8">
        <div className="max-w-6xl mx-auto text-white text-center h-full flex flex-col justify-center">
          <div className="mb-6">
            <div className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-xl rounded-full border border-yellow-400/30 mb-4 shadow-lg">
              <Star className="w-4 h-4 mr-2 text-yellow-400" />
              <span className="text-sm font-bold tracking-wide">Beta Launch Special</span>
            </div>

            <h1 className="text-3xl lg:text-5xl font-black mb-4 leading-tight tracking-tight">
              <span className="text-yellow-300 underline decoration-wavy decoration-4">Free</span> styling help for{" "}
              <span className="text-yellow-300 underline decoration-wavy decoration-4">all</span> unique body types
            </h1>

            <p className="text-lg lg:text-xl mb-6 font-light text-gray-200 leading-relaxed">
              Welcome to Mirror Me Fashion Beta!
            </p>
          </div>

          {/* Enhanced Feature Grid */}
          <div className="grid lg:grid-cols-2 gap-4 mb-8 text-left max-w-5xl mx-auto">
            <div className="space-y-3">
              <div className="flex items-start bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 group shadow-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300 shadow-lg flex-shrink-0">
                  <CheckCircle className="text-white w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold mb-1 text-yellow-300">World's First AI Stylist</h3>
                  <p className="text-sm font-medium">
                    Get <span className="font-bold text-yellow-300">Free & Instant fashion</span> advice from the
                    World's <span className="font-bold text-yellow-300">First and Only</span> Virtual Fashion Stylist
                  </p>
                </div>
              </div>

              <div className="flex items-start bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 group shadow-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-primary-500 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300 shadow-lg flex-shrink-0">
                  <Globe className="text-white w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold mb-1 text-primary-300">Global Shopping</h3>
                  <p className="text-sm">
                    Shop fashion retailers across the globe with personalized recommendations tailored to your style
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 group shadow-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300 shadow-lg flex-shrink-0">
                  <TrendingUp className="text-white w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold mb-1 text-purple-300">Business Growth</h3>
                  <p className="text-sm">
                    Join as a Fashion Professional to expand your fashion business reach and connect with new customers
                  </p>
                </div>
              </div>

              <div className="flex items-start bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 group shadow-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300 shadow-lg flex-shrink-0">
                  <Rocket className="text-white w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold mb-1 text-orange-300">AI-Powered Insights</h3>
                  <p className="text-sm">
                    Grow followers & monetize your brand with AI-powered insights and advanced analytics
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col lg:flex-row gap-4 justify-center items-center max-w-2xl mx-auto mb-6">
            <Button
              size="lg"
              className="w-full lg:w-auto bg-gradient-to-r from-white to-gray-100 text-primary-600 hover:from-gray-100 hover:to-white px-6 py-3 text-lg font-bold rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 group relative overflow-hidden"
              onClick={() => {
                onSectionChange("chat")
                setTimeout(() => scrollToSection("sopiaChatSection"), 500)
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-50/0 via-primary-50/50 to-primary-50/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <Heart className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform text-red-500" />
              I'm a Shopper
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full lg:w-auto border-2 border-white/40 text-white hover:bg-white hover:text-primary-600 px-6 py-3 text-lg font-bold rounded-full bg-white/10 backdrop-blur-xl transition-all duration-300 transform hover:scale-105 group relative overflow-hidden shadow-lg"
              onClick={() => {
                onSectionChange("professional")
                setTimeout(() => scrollToSection("professionalSection"), 500)
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <Award className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform text-yellow-400" />
              I'm a Fashion Professional
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group shadow-lg">
              <div className="text-2xl font-black text-yellow-400 mb-1 group-hover:scale-110 transition-transform">
                50K+
              </div>
              <div className="text-xs font-semibold text-gray-200 uppercase tracking-wider">Active Users</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group shadow-lg">
              <div className="text-2xl font-black text-primary-300 mb-1 group-hover:scale-110 transition-transform">
                4.9★
              </div>
              <div className="text-xs font-semibold text-gray-200 uppercase tracking-wider">User Rating</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group shadow-lg">
              <div className="text-2xl font-black text-green-400 mb-1 group-hover:scale-110 transition-transform">
                AI
              </div>
              <div className="text-xs font-semibold text-gray-200 uppercase tracking-wider">Powered</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
