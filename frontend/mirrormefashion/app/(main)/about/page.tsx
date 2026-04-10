import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Users, Target, Heart, Brain, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Mirror Me Fashion</h1>
          <p className="text-xl leading-relaxed mb-8">
            Revolutionizing fashion with AI-powered personalization, body shape analysis, and intelligent styling
            recommendations that help you discover your perfect look.
          </p>
          <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-100">
            Discover Sofia AI
          </Button>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded with a vision to democratize fashion through technology, Mirror Me Fashion combines cutting-edge
                AI with deep fashion expertise to create personalized shopping experiences that truly understand you.
              </p>
              <p className="text-gray-600 mb-4">
                Our breakthrough Sofia AI technology analyzes your body shape, style preferences, and lifestyle to
                recommend clothing that not only looks amazing but makes you feel confident and authentic.
              </p>
              <p className="text-gray-600">
                Today, we're proud to serve fashion enthusiasts worldwide, helping them discover their unique style
                through intelligent recommendations and personalized fashion insights.
              </p>
            </div>
            <div>
              <Image
                src="/ai-fashion-team.png"
                alt="Mirror Me Fashion AI technology"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sofia AI Section */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Brain className="h-4 w-4" />
              Powered by Sofia AI
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Meet Sofia, Your AI Style Assistant</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our revolutionary AI technology understands your unique body shape, analyzes your style preferences, and
              provides personalized recommendations that fit perfectly.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900">Body Shape Analysis</h3>
                <p className="text-gray-600 text-sm">
                  Advanced AI analyzes your body measurements to recommend perfectly fitting clothes.
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900">Style Personalization</h3>
                <p className="text-gray-600 text-sm">
                  Learn your preferences and suggest styles that match your unique taste.
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900">Smart Recommendations</h3>
                <p className="text-gray-600 text-sm">
                  Get instant, intelligent suggestions for outfits that work for any occasion.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core principles drive our mission to revolutionize fashion through intelligent technology.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900">AI Innovation</h3>
                <p className="text-gray-600 text-sm">
                  Pioneering the future of fashion with cutting-edge artificial intelligence.
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900">Personal Touch</h3>
                <p className="text-gray-600 text-sm">
                  Every recommendation is tailored to your unique style and preferences.
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900">Perfect Fit</h3>
                <p className="text-gray-600 text-sm">
                  Ensuring every piece fits beautifully through advanced body analysis.
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900">Confidence Building</h3>
                <p className="text-gray-600 text-sm">
                  Helping you feel confident and authentic in every outfit choice.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The passionate innovators behind Mirror Me Fashion who combine fashion expertise with AI technology.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sofia Chen", role: "CEO & AI Architect", image: "/professional-woman-ceo.png" },
              { name: "Marcus Rodriguez", role: "Head of Fashion Intelligence", image: "/professional-man-fashion-expert.png" },
              {
                name: "Aria Patel",
                role: "Customer Experience Director",
                image: "/professional-woman-customer-success.png",
              },
            ].map((member) => (
              <Card key={member.name} className="border-primary/20 hover:border-primary/40 transition-colors">
                <CardContent className="p-6 text-center">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={200}
                    height={200}
                    className="rounded-full mx-auto mb-4"
                  />
                  <h3 className="font-semibold text-lg text-gray-900">{member.name}</h3>
                  <p className="text-primary font-medium">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Style?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of fashion enthusiasts who've discovered their perfect style with Sofia AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-100">
              Try Sofia AI Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-primary bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
