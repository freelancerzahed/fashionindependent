// ✅ Type for each measurement configuration
export type ShapeKeyConfig = {
  type: "value" | "enum"
  keys: string[]
  min: number
  max: number
  step: number
  ticks: number
  defaultValue?: number     // Default value for the base model (usually 0.5 for average)
  classifications?: string[] // Human-readable labels for each tick value
  measurements?: Record<string, string> // Mapping of value ranges to actual measurements
  valueRanges?: Record<string, { min: number; max: number; measurement?: string }> // Valid ranges for each classification
  reconcileWith?: {
    key: string       // The key of the shape to reconcile with
    rules: string     // Name of reconciliation rule to apply
    constraints?: {   // Specific value constraints for reconciliation
      [value: string]: {
        maxValue?: number   // Maximum allowed value when the key is at this value
        minValue?: number   // Minimum allowed value when the key is at this value
        maxHeight?: number  // Maximum height value (for neck)
        maxArmSize?: number // Maximum arm size for muscular stomach reconciliation
        minArmSize?: number // Minimum arm size for muscular stomach reconciliation
        maxTrapezoid?: number // Maximum trapezoid value for muscular stomach
      }
    }
  }
}

// ✅ Type for a body part group
export type BodyPartGroup = {
  icon: string
  label: string
  measurements: Record<string, ShapeKeyConfig>
}

// ✅ Type for the full gender configuration
export type GenderConfig = {
  head: BodyPartGroup
  neck: BodyPartGroup
  shoulders: BodyPartGroup
  torso: BodyPartGroup
  arms: BodyPartGroup
  legs: BodyPartGroup
}

// Import gender-specific configurations
import { createMaleConfig } from "./male-body-groups"
import { createFemaleConfig } from "./female-body-groups"

// Factory function to create gender-specific configurations
export function createGenderConfig(gender: "male" | "female"): GenderConfig {
  return gender === "male" ? createMaleConfig() : createFemaleConfig();
}
