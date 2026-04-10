import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, Sparkles, Users, TrendingUp, Award } from "lucide-react"

interface AdvertiserSectionProps {
  isMobile: boolean
}

export default function AdvertiserSection({ isMobile }: AdvertiserSectionProps) {
  if (isMobile) {
    return (
      <section id="advertiserSection" className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Fashion advertising"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/85 via-primary-800/75 to-primary-900/85"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-6 safe-area-inset-top">
          <div className="max-w-sm mx-auto w-full">
            <div className="text-white text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-primary-800/50 backdrop-blur-xl rounded-full border border-primary-400/30 mb-6 shadow-lg">
                <Sparkles className="w-4 h-4 mr-2 text-primary-400" />
                <span className="text-sm font-medium">Advertising Solutions</span>
              </div>

              <h1 className="text-3xl font-bold mb-4 tracking-tight">Fashion Advertiser Hub</h1>
              <p className="text-lg text-primary-100 mb-6 leading-relaxed">
                Reach your target audience with precision advertising
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group shadow-lg">
                  <Users className="w-8 h-8 text-primary-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-sm">Targeting</h3>
                  <p className="text-xs text-primary-100">Precision reach</p>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group shadow-lg">
                  <TrendingUp className="w-8 h-8 text-primary-300 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-sm">ROI</h3>
                  <p className="text-xs text-primary-100">60% better</p>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group shadow-lg">
                  <Sparkles className="w-8 h-8 text-primary-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-sm">Creative</h3>
                  <p className="text-xs text-primary-100">Advanced tools</p>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group shadow-lg">
                  <Award className="w-8 h-8 text-green-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-sm">Analytics</h3>
                  <p className="text-xs text-primary-100">Real-time</p>
                </div>
              </div>

              <div className="bg-primary-800/50 rounded-3xl p-4 border border-white/20 backdrop-blur-xl mb-8 shadow-lg">
                <h3 className="font-bold text-lg mb-3 text-center">Performance</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary-300 mb-1">2.5x</div>
                    <div className="text-xs text-primary-100">Higher CTR</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary-300 mb-1">60%</div>
                    <div className="text-xs text-primary-100">Better ROI</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary-300 mb-1">40%</div>
                    <div className="text-xs text-primary-100">Lower CPA</div>
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-500 text-white p-6">
                <CardTitle className="text-xl font-bold text-center">Start Advertising</CardTitle>
                <p className="text-center text-sm opacity-90">Launch your first campaign</p>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-3xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 shadow-sm"
                    placeholder="Your company name"
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
                    placeholder="marketing@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Industry</label>
                  <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-3xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 shadow-sm">
                    <option>Select your industry</option>
                    <option>Fashion Brand</option>
                    <option>Beauty & Cosmetics</option>
                    <option>Lifestyle Brand</option>
                    <option>Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Budget</label>
                  <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-3xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 shadow-sm">
                    <option>Select budget range</option>
                    <option>$1K - $5K</option>
                    <option>$5K - $10K</option>
                    <option>$10K - $25K</option>
                    <option>$25K+</option>
                  </select>
                </div>

                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-3xl">
                  <Checkbox id="advertiser-terms" />
                  <label htmlFor="advertiser-terms" className="text-sm text-gray-700 font-medium">
                    I agree to the Advertising Terms and Privacy Policy
                  </label>
                </div>

                <Button className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white py-3 text-base font-semibold rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 border-0">
                  Launch Campaign
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
    <section id="advertiserSection" className="min-w-full h-full snap-center relative overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/placeholder.svg?height=1080&width=1920" alt="Fashion advertising" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 via-primary-800/70 to-primary-900/80"></div>
      </div>

      <div className="relative z-10 h-full flex items-center justify-center px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          <div className="text-white">
            <div className="mb-6">
              <div className="inline-flex items-center px-3 py-2 bg-primary-800/50 backdrop-blur-sm rounded-full border border-primary-400/30 mb-4">
                <Sparkles className="w-4 h-4 mr-2 text-primary-400" />
                <span className="text-sm font-medium">Advertising Solutions</span>
              </div>

              <h1 className="text-2xl lg:text-3xl font-bold mb-4">Fashion Advertiser Hub</h1>
              <p className="text-lg text-primary-100 mb-6 leading-relaxed">
                Reach your target audience with precision-targeted fashion advertising and maximize your campaign ROI
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                <Users className="w-8 h-8 text-primary-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-base mb-1">Targeted Reach</h3>
                <p className="text-sm text-primary-100">Precision audience targeting</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                <TrendingUp className="w-8 h-8 text-primary-300 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-base mb-1">Higher ROI</h3>
                <p className="text-sm text-primary-100">60% better performance</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                <Sparkles className="w-8 h-8 text-primary-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-base mb-1">Creative Tools</h3>
                <p className="text-sm text-primary-100">Advanced campaign builder</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                <Award className="w-8 h-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-base mb-1">Real-time Analytics</h3>
                <p className="text-sm text-primary-100">Live performance tracking</p>
              </div>
            </div>

            <div className="bg-primary-800/50 rounded-2xl p-4 border border-white/20 backdrop-blur-sm">
              <h3 className="font-bold text-lg mb-3 text-center">Campaign Performance</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary-300 mb-1">2.5x</div>
                  <div className="text-sm text-primary-100">Higher CTR</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-300 mb-1">60%</div>
                  <div className="text-sm text-primary-100">Better ROI</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-300 mb-1">40%</div>
                  <div className="text-sm text-primary-100">Lower CPA</div>
                </div>
              </div>
            </div>
          </div>

          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-500 text-white p-6">
              <CardTitle className="text-xl font-bold text-center">Start Advertising</CardTitle>
              <p className="text-center text-base opacity-90">Launch your first campaign</p>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  placeholder="Your company name"
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
                  placeholder="marketing@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Industry</label>
                <select className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200">
                  <option>Select your industry</option>
                  <option>Fashion Brand</option>
                  <option>Beauty & Cosmetics</option>
                  <option>Lifestyle Brand</option>
                  <option>Accessories</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Budget</label>
                <select className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200">
                  <option>Select budget range</option>
                  <option>$1K - $5K</option>
                  <option>$5K - $10K</option>
                  <option>$10K - $25K</option>
                  <option>$25K+</option>
                </select>
              </div>

              <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl">
                <Checkbox id="advertiser-terms" />
                <label htmlFor="advertiser-terms" className="text-sm text-gray-700 font-medium">
                  I agree to the Advertising Terms and Privacy Policy
                </label>
              </div>

              <Button className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white py-3 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Launch Campaign
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
