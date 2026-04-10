"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TickSlider } from "@/components/tick-slider"

interface BodyModelSliderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: BodyModelValues) => void
  initialValues: BodyModelValues
}

export interface BodyModelValues {
  height: number
  weight: number
  bustSize: number
  waistSize: number
  hipSize: number
}

export function BodyModelSliderModal({ open, onOpenChange, onSubmit, initialValues }: BodyModelSliderModalProps) {
  const [values, setValues] = useState<BodyModelValues>(initialValues)

  const handleSubmit = () => {
    onSubmit(values)
    onOpenChange(false)
  }

  const handleCancel = () => {
    setValues(initialValues)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust Body Model</DialogTitle>
          <DialogDescription>Use the sliders below to adjust your body measurements</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Height: {values.height.toFixed(1)} inches</label>
            <TickSlider
              id="height-slider"
              value={values.height}
              min={48}
              max={84}
              step={0.5}
              ticks={9}
              onChange={(value) => setValues((prev) => ({ ...prev, height: value }))}
              name="height"
              label="Height in inches"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Weight: {values.weight.toFixed(1)} lbs</label>
            <TickSlider
              id="weight-slider"
              value={values.weight}
              min={80}
              max={250}
              step={1}
              ticks={9}
              onChange={(value) => setValues((prev) => ({ ...prev, weight: value }))}
              name="weight"
              label="Weight in pounds"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Bust Size: {values.bustSize.toFixed(1)} inches</label>
            <TickSlider
              id="bust-slider"
              value={values.bustSize}
              min={28}
              max={50}
              step={0.5}
              ticks={9}
              onChange={(value) => setValues((prev) => ({ ...prev, bustSize: value }))}
              name="bustSize"
              label="Bust size in inches"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Waist Size: {values.waistSize.toFixed(1)} inches</label>
            <TickSlider
              id="waist-slider"
              value={values.waistSize}
              min={20}
              max={45}
              step={0.5}
              ticks={9}
              onChange={(value) => setValues((prev) => ({ ...prev, waistSize: value }))}
              name="waistSize"
              label="Waist size in inches"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Hip Size: {values.hipSize.toFixed(1)} inches</label>
            <TickSlider
              id="hip-slider"
              value={values.hipSize}
              min={28}
              max={55}
              step={0.5}
              ticks={9}
              onChange={(value) => setValues((prev) => ({ ...prev, hipSize: value }))}
              name="hipSize"
              label="Hip size in inches"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
