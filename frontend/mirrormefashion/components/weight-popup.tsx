"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"

interface WeightPopupProps {
  show: boolean
  setShow: (val: boolean) => void
  onSelectWeight: (value: string) => void
}

export default function WeightPopup({ show, setShow, onSelectWeight }: WeightPopupProps) {
  const [kg, setKg] = useState(70) // Default to 70 kg (approx 154 lbs)

  const convertToLbs = (kgValue: number) => {
    const lbs = Math.round(kgValue * 2.205)
    return lbs
  }

  const lbs = convertToLbs(kg)

  const handleSelect = () => {
    const selected = `${lbs} lbs (${kg} kg)`
    onSelectWeight(selected)
    setShow(false)
  }

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent className="max-w-sm rounded-2xl p-6 space-y-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">
            Select Your Weight
          </DialogTitle>
        </DialogHeader>

        {/* Preview Section */}
        <div className="text-center">
          <p className="text-2xl font-bold">{lbs} lbs</p>
          <p className="text-gray-500 text-sm">{kg} kg</p>
          <p className="text-xs text-gray-400 mt-1">
            Adjust with slider, quick presets, or type manually.
          </p>
        </div>

        {/* Slider Control */}
        <div>
          <Slider
            value={[kg]}
            min={40}
            max={180}
            step={1}
            onValueChange={(v) => setKg(v[0])}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>40 kg</span>
            <span>180 kg</span>
          </div>
        </div>

        {/* Manual Input */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500">Kilograms</label>
            <Input
              type="number"
              value={kg}
              onChange={(e) => setKg(Number(e.target.value))}
              className="text-center"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Pounds</label>
            <Input
              type="number"
              value={lbs}
              onChange={(e) => {
                const newLbs = Number(e.target.value)
                setKg(Math.round(newLbs / 2.205))
              }}
              className="text-center"
            />
          </div>
        </div>

        {/* Quick Presets */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Quick select</p>
          <div className="grid grid-cols-3 gap-2">
            {[50, 60, 70, 80, 90, 100].map((preset) => (
              <Button
                key={preset}
                variant={preset === kg ? "default" : "outline"}
                onClick={() => setKg(preset)}
                className="text-sm"
              >
                {preset} kg
              </Button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => setShow(false)}>Cancel</Button>
          <Button onClick={handleSelect}>Confirm</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
