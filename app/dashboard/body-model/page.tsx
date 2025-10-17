import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DashboardNav } from "@/components/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function BodyModelPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-neutral-50">
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <DashboardNav />

              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg shadow-sm p-8">
                  <h1 className="text-2xl font-bold mb-6">ShapeMe Body Model</h1>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h2 className="text-lg font-semibold">Body Data</h2>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="height">Height (inches)</Label>
                          <Input id="height" type="number" defaultValue="65" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="weight">Weight (pounds)</Label>
                          <Input id="weight" type="number" defaultValue="140" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bra">Bra Size (US)</Label>
                          <Input id="bra" defaultValue="34B" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="shoe">Shoe Size</Label>
                          <Input id="shoe" type="number" defaultValue="8" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <select id="gender" className="w-full h-10 px-3 rounded-md border border-input bg-background">
                            <option>Female</option>
                            <option>Male</option>
                            <option>Non-binary</option>
                          </select>
                        </div>
                      </div>

                      <Button className="w-full">Update</Button>
                    </div>

                    <div>
                      <div className="aspect-square bg-neutral-100 rounded-lg flex items-center justify-center">
                        <p className="text-neutral-500">3D Body Model Preview</p>
                      </div>
                      <p className="text-sm text-neutral-600 mt-4 text-center">
                        Your personalized body model helps designers create better-fitting garments
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
