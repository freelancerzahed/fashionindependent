import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, ShoppingBag, TrendingUp, Users, Zap, Shield, Rocket } from "lucide-react"

interface RetailerSectionProps {
  isMobile: boolean
}

export default function RetailerSection({ isMobile }: RetailerSectionProps) {
  if (isMobile) {
    return (
      <section id="retailerSection" className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Fashion retail business"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/85 via-primary-800/75 to-primary-900/85"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-6 safe-area-inset-top">
          <div className="max-w-sm mx-auto w-full">
            <div className="text-white text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-primary-800/50 backdrop-blur-xl rounded-full border border-primary-400/30 mb-6 shadow-lg">
                <ShoppingBag className="w-4 h-4 mr-2 text-primary-400" />
                <span className="text-sm font-medium">Retail Partnership</span>
              </div>

              <h1 className="text-3xl font-bold mb-4 tracking-tight">Fashion Retailer Portal</h1>
              <p className="text-lg text-primary-100 mb-6 leading-relaxed">
                Transform your retail business with AI-powered recommendations
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group shadow-lg">
                  <TrendingUp className="w-8 h-8 text-primary-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-sm">Sales Boost</h3>
                  <p className="text-xs text-primary-100">Up to 40%</p>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group shadow-lg">
                  <Users className="w-8 h-8 text-primary-300 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-sm">Insights</h3>
                  <p className="text-xs text-primary-100">Deep analytics</p>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group shadow-lg">
                  <Zap className="w-8 h-8 text-green-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-sm">Integration</h3>
                  <p className="text-xs text-primary-100">Seamless API</p>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group shadow-lg">
                  <Shield className="w-8 h-8 text-yellow-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-sm">Support</h3>
                  <p className="text-xs text-primary-100">24/7 dedicated</p>
                </div>
              </div>
            </div>

            <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-500 text-white p-6">
                <CardTitle className="text-xl font-bold text-center tracking-tight">Join Our Network</CardTitle>
                <p className="text-center text-sm opacity-90">Start your partnership today</p>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-3xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 shadow-sm"
                    placeholder="Your business name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Person</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-3xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 shadow-sm"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Business Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-3xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 shadow-sm"
                    placeholder="business@example.com"
                  />
                </div>

                <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-3xl">
                  <Checkbox id="mobile-retailer-terms" />
                  <label htmlFor="mobile-retailer-terms" className="text-gray-700 font-medium text-sm">
                    I agree that I am above 18 years old
                  </label>
                </div>

                <Button className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white py-3 text-base font-semibold rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 border-0">
                  Submit Application
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
    <section id="retailerSection" className="min-w-full h-full snap-center relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Fashion retail business"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 via-primary-800/70 to-primary-900/80"></div>

        {/* Floating elements */}
        <div className="absolute top-20 right-20 w-40 h-40 bg-primary-200 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-primary-100 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 h-full flex items-center justify-center px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          <div className="text-white">
            <div className="mb-6">
              <div className="inline-flex items-center px-3 py-2 bg-primary-800/50 backdrop-blur-sm rounded-full border border-primary-400/30 mb-4">
                <Rocket className="w-4 h-4 mr-2 text-primary-400" />
                <span className="text-sm font-medium">Retail Partnership</span>
              </div>

              <h1 className="text-2xl lg:text-3xl font-bold mb-4">Fashion Retailer Portal</h1>
              <p className="text-lg text-primary-100 mb-6 leading-relaxed">
                Transform your retail business with AI-powered fashion recommendations and unlock unprecedented growth
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                <TrendingUp className="w-8 h-8 text-primary-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-base mb-1">Increase Sales</h3>
                <p className="text-sm text-primary-100">Up to 40% boost in revenue</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                <Users className="w-8 h-8 text-primary-300 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-base mb-1">Customer Insights</h3>
                <p className="text-sm text-primary-100">Deep analytics & behavior</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                <Zap className="w-8 h-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-base mb-1">Easy Integration</h3>
                <p className="text-sm text-primary-100">Seamless API connection</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                <Shield className="w-8 h-8 text-yellow-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-base mb-1">Premium Support</h3>
                <p className="text-sm text-primary-100">24/7 dedicated assistance</p>
              </div>
            </div>
          </div>

          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-500 text-white p-6">
              <CardTitle className="text-xl font-bold text-center">Join Our Network</CardTitle>
              <p className="text-center text-base opacity-90">Start your partnership journey today</p>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  placeholder="Your business name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Person</label>
                <input
                  type="text"
                  className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Business Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  placeholder="business@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Business Type</label>
                <select className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200">
                  <option>Select business type</option>
                  <option>Online Fashion Store</option>
                  <option>Physical Retail Store</option>
                  <option>Fashion Brand</option>
                  <option>Department Store</option>
                  <option>Boutique</option>
                </select>
              </div>

              <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl">
                <Checkbox id="desktop-retailer-terms" />
                <label htmlFor="desktop-retailer-terms" className="text-sm text-gray-700 font-medium">
                  I agree that I am above 18 years old
                </label>
              </div>

              <Button className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white py-3 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Submit Application
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
