"use client"

import { useState } from "react"
import { TickSlider } from "@/components/tick-slider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { createGenderConfig } from "@/lib/body-groups"
import type { BodyPartGroup } from "@/lib/body-groups"

interface BodyModelSlidersProps {
  gender: "male" | "female"
  onSubmit: (values: Record<string, number>) => void
  onCancel: () => void
  initialValues?: Record<string, number>
}

export function BodyModelSliders({ gender, onSubmit, onCancel, initialValues = {} }: BodyModelSlidersProps) {
  const config = createGenderConfig(gender)
  const [values, setValues] = useState<Record<string, number>>(initialValues)

  const handleSliderChange = (key: string, value: number) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    onSubmit(values)
  }

  const renderSliders = (measurements: Record<string, any>) => (
    <div className="space-y-6">
      {Object.entries(measurements).map(([key, config]) => (
        <div key={key}>
          <label className="text-sm font-medium mb-2 block">
            {key.replace(/([A-Z])/g, " $1").trim()}: {(values[key] ?? 0).toFixed(2)}
          </label>
          <TickSlider
            id={`${key}-slider`}
            value={values[key] ?? config.min}
            min={config.min}
            max={config.max}
            step={config.step}
            ticks={config.ticks}
            onChange={(value) => handleSliderChange(key, value)}
            name={key}
            label={key}
          />
        </div>
      ))}
    </div>
  )

  const bodyPartGroups = Object.entries(config) as [string, BodyPartGroup][]

  return (
    <div className="space-y-6">
      {/* Desktop Tabs View */}
      <div className="hidden md:block">
        <Tabs defaultValue={bodyPartGroups[0][0]} className="w-full">
          <TabsList className="grid w-full grid-cols-6 gap-1 h-auto bg-transparent p-0">
            {bodyPartGroups.map(([key, group]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="flex flex-col items-center justify-center aspect-square p-2 rounded-lg border-2 border-neutral-200 data-[state=active]:border-primary data-[state=active]:bg-primary/10 hover:border-neutral-300 transition-all"
              >
                <span className="text-lg mb-1">{group.icon}</span>
                <span className="text-[10px] font-medium text-center leading-tight">{group.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {bodyPartGroups.map(([key, group]) => (
            <TabsContent key={key} value={key} className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{group.label}</h3>
                {renderSliders(group.measurements)}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Mobile Collapsible View */}
      <div className="md:hidden space-y-3">
        {bodyPartGroups.map(([key, group]) => (
          <Collapsible key={key} defaultOpen={key === bodyPartGroups[0][0]}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-lg">{group.icon}</span>
                <span className="font-medium">{group.label}</span>
              </div>
              <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 px-3 pb-3 space-y-4">
              {renderSliders(group.measurements)}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-6 border-t">
        <Button variant="outline" className="flex-1 bg-transparent" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  )
}
