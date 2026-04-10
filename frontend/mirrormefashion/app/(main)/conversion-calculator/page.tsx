"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"

export default function ConversionCalculator() {
  const [feet, setFeet] = useState("")
  const [inches, setInches] = useState("")
  const [cm, setCm] = useState("")

  const handleFeetChange = (value: string) => {
    setFeet(value)
    if (!value) {
      resetValues()
      return
    }
    const f = parseFloat(value)
    setInches((f * 12).toFixed(2))
    setCm((f * 30.48).toFixed(2))
  }

  const handleInchesChange = (value: string) => {
    setInches(value)
    if (!value) {
      resetValues()
      return
    }
    const i = parseFloat(value)
    setFeet((i / 12).toFixed(2))
    setCm((i * 2.54).toFixed(2))
  }

  const handleCmChange = (value: string) => {
    setCm(value)
    if (!value) {
      resetValues()
      return
    }
    const c = parseFloat(value)
    setFeet((c / 30.48).toFixed(2))
    setInches((c / 2.54).toFixed(2))
  }

  const resetValues = () => {
    setFeet("")
    setInches("")
    setCm("")
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border rounded-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-purple-600">
          Height Conversion Calculator
        </CardTitle>
        <p className="text-gray-500 text-sm mt-1">
          Enter your height in feet, inches, or centimeters – the others will update automatically
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Feet</label>
          <Input
            type="number"
            value={feet}
            onChange={(e) => handleFeetChange(e.target.value)}
            placeholder="e.g., 5.8"
            className="mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Inches</label>
          <Input
            type="number"
            value={inches}
            onChange={(e) => handleInchesChange(e.target.value)}
            placeholder="e.g., 70"
            className="mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Centimeters</label>
          <Input
            type="number"
            value={cm}
            onChange={(e) => handleCmChange(e.target.value)}
            placeholder="e.g., 178"
            className="mt-1"
          />
        </div>

        <div className="flex justify-end">
          <Button
            onClick={resetValues}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCcw size={16} /> Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
