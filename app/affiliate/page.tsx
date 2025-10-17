import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2 } from "lucide-react"

export default function AffiliatePage() {
  const benefits = [
    "Earn 10% commission on all referred pledges",
    "Access to exclusive promotional materials",
    "Real-time tracking dashboard",
    "Monthly payouts via direct deposit",
    "Dedicated affiliate support team",
    "Early access to new campaigns",
  ]

  const howItWorks = [
    {
      step: "1",
      title: "Sign Up",
      description: "Create your free affiliate account in minutes",
    },
    {
      step: "2",
      title: "Share",
      description: "Promote campaigns using your unique referral links",
    },
    {
      step: "3",
      title: "Earn",
      description: "Receive 10% commission on all successful pledges",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Affiliate Program</h1>
            <p className="text-lg text-muted-foreground">
              Partner with The Fashion Independent and earn commissions while supporting emerging designers
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <section className="mb-16">
            <h2 className="text-3xl font-semibold mb-8 text-center">Why Join Our Affiliate Program?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <p>{benefit}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-semibold mb-8 text-center">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((item) => (
                <Card key={item.step} className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <Card className="p-8">
              <h2 className="text-2xl font-semibold mb-6 text-center">Join the Program</h2>
              <form className="space-y-4 max-w-md mx-auto">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter your name" />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="your@email.com" />
                </div>
                <div>
                  <Label htmlFor="website">Website or Social Media</Label>
                  <Input id="website" placeholder="https://yourwebsite.com" />
                </div>
                <div>
                  <Label htmlFor="audience">Audience Size (Optional)</Label>
                  <Input id="audience" placeholder="e.g., 10,000 followers" />
                </div>
                <Button type="submit" className="w-full">
                  Apply Now
                </Button>
              </form>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}
