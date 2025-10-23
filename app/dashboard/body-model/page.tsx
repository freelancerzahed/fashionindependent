"use client"

import { useState } from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BodyModelSliders } from "@/components/body-model-sliders"

export default function BodyModelPage() {
  const [isEditMode, setIsEditMode] = useState(false)
  const [bodyMeasurements, setBodyMeasurements] = useState<Record<string, number>>({
    height: 65,
    weight: 140,
    bustSize: 34,
    waistSize: 26,
    hipSize: 36,
  })

  const handleUpdateClick = () => {
    setIsEditMode(true)
  }

  const handleSubmit = (values: Record<string, number>) => {
    setBodyMeasurements(values)
    setIsEditMode(false)
    console.log("Updated body measurements:", values)
  }

  const handleCancel = () => {
    setIsEditMode(false)
  }

  return (
    <main className="flex-1 bg-neutral-50">
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <DashboardNav />

            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h1 className="text-2xl font-bold mb-6">ShapeMe Body Model</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="order-first lg:order-last">
                    <div className="aspect-square bg-neutral-100 rounded-lg flex items-center justify-center">
                      <p className="text-neutral-500">3D Body Model Preview</p>
                    </div>
                    <p className="text-sm text-neutral-600 mt-4 text-center">
                      Your personalized body model helps designers create better-fitting garments
                    </p>
                  </div>

                  <div className="order-last lg:order-first space-y-6">
                    <h2 className="text-lg font-semibold">Body Data</h2>

                    {!isEditMode ? (
                      <>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="height">Height (inches)</Label>
                            <Input id="height" type="number" value={bodyMeasurements.height} readOnly />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="weight">Weight (pounds)</Label>
                            <Input id="weight" type="number" value={bodyMeasurements.weight} readOnly />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="bust">Bust Size (inches)</Label>
                            <Input id="bust" type="number" value={bodyMeasurements.bustSize} readOnly />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="waist">Waist Size (inches)</Label>
                            <Input id="waist" type="number" value={bodyMeasurements.waistSize} readOnly />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="hip">Hip Size (inches)</Label>
                            <Input id="hip" type="number" value={bodyMeasurements.hipSize} readOnly />
                          </div>
                        </div>

                        <Button className="w-full" onClick={handleUpdateClick}>
                          Update
                        </Button>
                      </>
                    ) : (
                      <BodyModelSliders
                        gender="female"
                        initialValues={bodyMeasurements}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
