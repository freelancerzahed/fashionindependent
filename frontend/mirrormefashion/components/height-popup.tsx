"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"

interface HeightPopupProps {
  show: boolean
  setShow: (val: boolean) => void
  onSelectHeight: (value: string) => void
}

export default function HeightPopup({ show, setShow, onSelectHeight }: HeightPopupProps) {
  const [cm, setCm] = useState(170)

  const convertToFtIn = (cmValue: number) => {
    const totalInches = cmValue / 2.54
    const ft = Math.floor(totalInches / 12)
    const inch = Math.round(totalInches % 12)
    return { ft, inch }
  }

  const { ft, inch } = convertToFtIn(cm)

  const handleSelect = () => {
    const selected = `${ft}'${inch}" (${cm} cm)`
    onSelectHeight(selected)
    setShow(false)
  }

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent className="max-w-sm rounded-2xl p-6 space-y-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">
            Select Your Height
          </DialogTitle>
        </DialogHeader>

        {/* Preview Section */}
        <div className="text-center">
          <p className="text-2xl font-bold">{ft}′ {inch}″</p>
          <p className="text-gray-500 text-sm">{cm} cm</p>
          <p className="text-xs text-gray-400 mt-1">
            Adjust with slider, quick presets, or type manually.
          </p>
        </div>

        {/* Slider Control */}
        <div>
          <Slider
            value={[cm]}
            min={140}
            max={210}
            step={1}
            onValueChange={(v) => setCm(v[0])}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>140 cm</span>
            <span>210 cm</span>
          </div>
        </div>

        {/* Manual Input */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500">Centimeters</label>
            <Input
              type="number"
              value={cm}
              onChange={(e) => setCm(Number(e.target.value))}
              className="text-center"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Feet & Inches</label>
            <div className="flex gap-1">
              <Input
                type="number"
                value={ft}
                onChange={(e) => {
                  const newFt = Number(e.target.value)
                  setCm(Math.round((newFt * 30.48) + (inch * 2.54)))
                }}
                className="text-center"
              />
              <span className="self-center text-xs text-gray-400">ft</span>
              <Input
                type="number"
                value={inch}
                onChange={(e) => {
                  const newInch = Number(e.target.value)
                  setCm(Math.round((ft * 30.48) + (newInch * 2.54)))
                }}
                className="text-center"
              />
              <span className="self-center text-xs text-gray-400">in</span>
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Quick select</p>
          <div className="grid grid-cols-3 gap-2">
            {[160, 165, 170, 175, 180, 185].map((preset) => (
              <Button
                key={preset}
                variant={preset === cm ? "default" : "outline"}
                onClick={() => setCm(preset)}
                className="text-sm"
              >
                {preset} cm
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
