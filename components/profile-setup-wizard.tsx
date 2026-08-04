"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Radio } from "@/components/ui/radio"
import { Label } from "@/components/ui/label"

interface ProfileSetupWizardProps {
  isOpen: boolean
  email: string
  name: string
  onComplete: (data: { gender: string; ageRange: string }) => Promise<void>
}

export function ProfileSetupWizard({ isOpen, email, name, onComplete }: ProfileSetupWizardProps) {
  const [gender, setGender] = useState<string>("")
  const [ageRange, setAgeRange] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer_not_to_say", label: "Prefer not to say" },
  ]

  const ageRanges = [
    { value: "13-17", label: "13-17" },
    { value: "18-24", label: "18-24" },
    { value: "25-34", label: "25-34" },
    { value: "35-44", label: "35-44" },
    { value: "45-54", label: "45-54" },
    { value: "55-64", label: "55-64" },
    { value: "65+", label: "65+" },
    { value: "prefer_not_to_say", label: "Prefer not to say" },
  ]

  const handleSubmit = async () => {
    if (!gender || !ageRange) {
      setError("Please fill in all fields")
      return
    }

    setIsLoading(true)
    setError("")
    try {
      await onComplete({ gender, ageRange })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-md sm:max-w-lg" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl">Complete Your Profile</DialogTitle>
          <DialogDescription className="text-sm">
            Help us personalize your experience on The Fashion Independent
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Welcome Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-neutral-700">
              Welcome <strong>{name}</strong>! Before you get started, please tell us a bit about yourself.
            </p>
          </div>

          {/* Gender Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Gender</Label>
            <div className="space-y-2">
              {genderOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id={`gender-${option.value}`}
                    name="gender"
                    value={option.value}
                    checked={gender === option.value}
                    onChange={(e) => setGender(e.target.value)}
                    className="h-4 w-4 cursor-pointer accent-blue-600"
                  />
                  <Label htmlFor={`gender-${option.value}`} className="font-normal cursor-pointer flex-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Age Range Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Age Range</Label>
            <div className="space-y-2">
              {ageRanges.map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id={`age-${option.value}`}
                    name="ageRange"
                    value={option.value}
                    checked={ageRange === option.value}
                    onChange={(e) => setAgeRange(e.target.value)}
                    className="h-4 w-4 cursor-pointer accent-blue-600"
                  />
                  <Label htmlFor={`age-${option.value}`} className="font-normal cursor-pointer flex-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">{error}</div>}

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !gender || !ageRange}
            className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            {isLoading ? "Completing Profile..." : "Get Started"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
