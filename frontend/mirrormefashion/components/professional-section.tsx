"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Rocket, Zap, TrendingUp, Award, Users } from "lucide-react"

interface ProfessionalSectionProps {
  isMobile: boolean
  currentSection: string
  userType: string
  setUserType: (value: string) => void
  handleUserTypeSelection: () => void
}

export default function ProfessionalSection({
  isMobile,
  currentSection,
  userType,
  setUserType,
  handleUserTypeSelection,
}: ProfessionalSectionProps) {
  if (isMobile) {
    return (
      <section id="professionalSection" className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/placeholder.svg?height=1080&width=1920" alt="Fashion business" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/85 via-primary-800/75 to-primary-900/85"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-6 safe-area-inset-top">
          <div className="max-w-sm mx-auto">
            <div className="text-white text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-primary-800/50 backdrop-blur-xl rounded-full border border-primary-400/30 mb-6 shadow-lg">
                <Rocket className="w-4 h-4 mr-2 text-primary-400" />
                <span className="text-sm font-medium">Professional Portal</span>
              </div>

              <h1 className="text-3xl font-bold mb-4 tracking-tight">Mirror Me Fashion</h1>
              <h3 className="text-xl mb-6 text-yellow-300 font-light">Discover Your Niche</h3>

              {/* Native Feature Grid */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group shadow-lg">
                  <Zap className="text-yellow-400 mb-2 w-6 h-6 mx-auto group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-sm mb-1">AI Power</h4>
                  <p className="text-xs text-gray-200">Advanced tech</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group shadow-lg">
                  <TrendingUp className="text-yellow-400 mb-2 w-6 h-6 mx-auto group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-sm mb-1">Growth</h4>
                  <p className="text-xs text-gray-200">Boost sales</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group shadow-lg">
                  <Award className="text-yellow-400 mb-2 w-6 h-6 mx-auto group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-sm mb-1">Premium</h4>
                  <p className="text-xs text-gray-200">Quality service</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group shadow-lg">
                  <Users className="text-yellow-400 mb-2 w-6 h-6 mx-auto group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-sm mb-1">Network</h4>
                  <p className="text-xs text-gray-200">Global reach</p>
                </div>
              </div>
            </div>

            <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-500 text-white p-6">
                <CardTitle className="text-xl font-bold text-center tracking-tight">Welcome!</CardTitle>
                <p className="text-center text-sm opacity-90">What type of Fashion Professional are you?</p>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Select value={userType} onValueChange={setUserType}>
                  <SelectTrigger className="h-12 text-base rounded-3xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm">
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retailer">I'm a Fashion Retailer</SelectItem>
                    <SelectItem value="influencer">I'm a Fashion Influencer</SelectItem>
                    <SelectItem value="advertiser">I'm a Fashion Advertiser</SelectItem>
                    <SelectItem value="stylist">I'm a Fashion Stylist</SelectItem>
                    <SelectItem value="blogger">I'm a Fashion Blogger</SelectItem>
                    <SelectItem value="photographer">I'm a Fashion Photographer</SelectItem>
                    <SelectItem value="other">Other Fashion Professional</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={handleUserTypeSelection}
                  className="w-full h-12 text-base font-semibold rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white border-0"
                >
                  Complete Registration
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    )
  }

  // Desktop version
  return (
    <section id="professionalSection" className="min-w-full h-full snap-center relative overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/placeholder.svg?height=1080&width=1920" alt="Fashion business" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 via-primary-800/70 to-primary-900/80"></div>
      </div>

      <div className="relative z-10 h-full flex items-center justify-center px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          <div className="text-white">
            <div className="mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold mb-4">Mirror Me Fashion</h1>
              <h3 className="text-lg mb-6 text-yellow-300 font-light">Discover Your Niche</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <Zap className="text-yellow-400 mb-2 w-6 h-6" />
                <h4 className="font-bold text-base mb-1">Powerful AI</h4>
                <p className="text-sm text-gray-200">Advanced technology</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <TrendingUp className="text-yellow-400 mb-2 w-6 h-6" />
                <h4 className="font-bold text-base mb-1">Streamlined</h4>
                <p className="text-sm text-gray-200">Efficient services</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <Award className="text-yellow-400 mb-2 w-6 h-6" />
                <h4 className="font-bold text-base mb-1">Increase Sales</h4>
                <p className="text-sm text-gray-200">Boost revenue</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <Users className="text-yellow-400 mb-2 w-6 h-6" />
                <h4 className="font-bold text-base mb-1">Monetize</h4>
                <p className="text-sm text-gray-200">Your following</p>
              </div>
            </div>
          </div>

          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-500 text-white p-6">
              <CardTitle className="text-xl font-bold text-center">Welcome!</CardTitle>
              <p className="text-center text-base opacity-90">What type of Fashion Professional are you?</p>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Select value={userType} onValueChange={setUserType}>
                <SelectTrigger className="h-12 text-base rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retailer">I'm a Fashion Retailer</SelectItem>
                  <SelectItem value="influencer">I'm a Fashion Influencer</SelectItem>
                  <SelectItem value="advertiser">I'm a Fashion Advertiser</SelectItem>
                  <SelectItem value="stylist">I'm a Fashion Stylist</SelectItem>
                  <SelectItem value="blogger">I'm a Fashion Blogger</SelectItem>
                  <SelectItem value="photographer">I'm a Fashion Photographer</SelectItem>
                  <SelectItem value="other">Other Fashion Professional</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleUserTypeSelection}
                className="w-full h-12 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white"
              >
                Complete Registration
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
