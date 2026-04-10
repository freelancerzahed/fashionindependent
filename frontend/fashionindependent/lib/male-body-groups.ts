import { generateStep } from "./utils"
import { MALE_BASE_MODEL_DEFAULTS } from "./base-model-defaults"

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

export type BodyPartGroup = {
  icon: string
  label: string
  measurements: Record<string, ShapeKeyConfig>
}

export type MaleGenderConfig = {
  head: BodyPartGroup
  neck: BodyPartGroup
  shoulders: BodyPartGroup
  torso: BodyPartGroup
  arms: BodyPartGroup
  legs: BodyPartGroup
}

export function createMaleConfig(): MaleGenderConfig {
  return {
    head: {
      icon: "🧠",
      label: "Head",
      measurements: {
        // Head Size with 9 ticks
        headSize: {
          type: "value",
          keys: ["head_size"],
          min: 0,
          max: 1,
          step: generateStep(9),
          ticks: 9,
          classifications: ["Small", "Average", "Large", "Very Large"],
          valueRanges: {
            "Small": { min: 0.0, max: 0.25 },
            "Average": { min: 0.375, max: 0.625 },
            "Large": { min: 0.75, max: 0.875 },
            "Very Large": { min: 1.0, max: 1.0 }
          },
          reconcileWith: {
            key: "shoulderWidth",
            rules: "headSize",
            constraints: {
              "0.375": { maxValue: 0.75 },   // If shoulder_width <= 0.375, max head_size is 0.75
              "0.5": { minValue: 0.125 }     // If shoulder_width >= 0.5, min head_size is 0.125
            }
          }
        },
        // Head Shape with 3 options
        headShape: {
          type: "enum",
          keys: ["head_shape_oblong", "head_shape_round"],
          min: 0,
          max: 2,
          step: 1,
          ticks: 3,
          classifications: ["Average (Oval)", "Oblong", "Round (Circle)"]
        }
      }
    },
    neck: {
      icon: "🦒",
      label: "Neck",
      measurements: {
        // Neck Height with 5 ticks
        neckHeight: {
          type: "value",
          keys: ["neck_height"],
          min: 0,
          max: 1,
          step: generateStep(5),
          ticks: 5,
          classifications: ["Tall", "Average", "Short", "Hidden", "None"],
          measurements: {
            "0.0": "6cm",
            "0.25": "4cm",
            "0.5": "2.5cm",
            "0.75": "1cm",
            "1.0": "0cm"
          }
        },
        // Neck Width with reconciliation
        neckWidth: {
          type: "value",
          keys: ["neck_width"],
          min: 0,
          max: 1,
          step: generateStep(5),
          ticks: 5,
          classifications: ["Skinny", "Average", "Girthy"],
          valueRanges: {
            "Skinny": { min: 0.0, max: 0.25 },
            "Average": { min: 0.5, max: 0.75 },
            "Girthy": { min: 1.0, max: 1.0 }
          },
          reconcileWith: {
            key: "neckWidth",
            rules: "neckWidth",
            constraints: {
              "1.0": { maxHeight: 0.75 }  // If neck_width is 1.0, max neck_height is 0.75
            }
          }
        },
        // Neck Layers
        neckLayers: {
          type: "enum",
          keys: ["neck_layers"],
          min: 0,
          max: 1,
          step: 1,
          ticks: 2,
          classifications: ["Average", "Has Neck Layers"]
        },
        // Chin Shape
        chinShape: {
          type: "enum",
          keys: ["chin_shape"],
          min: 0,
          max: 1,
          step: 1,
          ticks: 2,
          classifications: ["Average", "Has Chin Fat"]
        },
        // Trapezoid with reconciliation
        trapezoid: {
          type: "value",
          keys: ["trapezoid"],
          min: 0,
          max: 1,
          step: 1,
          ticks: 2,
          classifications: ["Average", "Trapezoid"],
          reconcileWith: {
            key: "shoulderHeight",
            rules: "trapezoid",
            constraints: {
              "0.5": { maxValue: 0.75 },  // If shoulder_height == 0.5, trapezoid = 0.75
              "1.0": { maxValue: 0.5 }    // If shoulder_height == 1.0, trapezoid = 0.5
            }
          }
        }
      }
    },
    shoulders: {
      icon: "🤷",
      label: "Shoulders",
      measurements: {
        // Shoulder Height
        shoulderHeight: {
          type: "value",
          keys: ["shoulder_height"],
          min: 0,
          max: 1,
          step: generateStep(3),
          ticks: 3,
          classifications: ["Strong", "Average", "Dropped"]
        },
        // Shoulder Width with measurements
        shoulderWidth: {
          type: "value",
          keys: ["shoulder_width"],
          min: 0,
          max: 1,
          step: generateStep(9),
          ticks: 9,
          classifications: ["Narrow", "Average", "Broad"],
          valueRanges: {
            "Narrow": { min: 0.0, max: 0.25, measurement: "29-31cm" },
            "Average": { min: 0.375, max: 0.75, measurement: "32-36cm" },
            "Broad": { min: 0.875, max: 1.0, measurement: "37-40cm" }
          }
        }
      }
    },
    torso: {
      icon: "👕",
      label: "Torso",
      measurements: {
        // Stomach Weight with 9 ticks
        stomachWeight: {
          type: "value",
          keys: ["stomach_weight"],
          min: 0,
          max: 1,
          step: generateStep(9),
          ticks: 9,
          reconcileWith: {
            key: "shoulderWidth",
            rules: "stomachWeight",
            constraints: {
              "0.375": { maxValue: 0.75 },  // If shoulder_width <= 0.375, max stomach_weight is 0.75
              "0.5": { maxValue: 0.875 },   // If shoulder_width === 0.5, max stomach_weight is 0.875
              "0.625": { maxValue: 1.0 }    // If shoulder_width >= 0.625, no weight restriction
            }
          }
        },
        // Stomach Shape
        stomachShape: {
          type: "enum",
          keys: [
            "stomach_shape_average",
            "stomach_shape_muscular",
            "stomach_shape_rectangle",
            "stomach_shape_round"
          ],
          min: 0,
          max: 3,
          step: 1,
          ticks: 4,
          classifications: ["Average", "Muscular", "Rectangle", "Round"],
          reconcileWith: {
            key: "shoulderWidth",
            rules: "stomachShape",
            constraints: {
              // Muscular stomach constraints
              "muscular_stomach_0.375": { maxValue: 0.375 },  // If stomach_width_muscular >= 0.375
              "muscular_height_0.0": { maxTrapezoid: 0.5 },   // If stomach_shape_muscular === 0.0 && stomach_height === 0.0
              "muscular_height_0.5": { maxTrapezoid: 0.25 },  // If stomach_shape_muscular === 0.0 && stomach_height === 0.5
              "muscular_height_1.0": { maxTrapezoid: 0.0 },   // If stomach_shape_muscular === 0.0 && stomach_height === 1.0
              "muscular_width_0.375": { maxArmSize: 0.75 },   // If stomach_shape_muscular === 0.0 && stomach_width <= 0.375
              "muscular_width_0.5": { minArmSize: 0.375 },    // If stomach_shape_muscular === 0.0 && stomach_width >= 0.5
              // Round stomach constraints
              "round_width_0.375": { maxValue: 0.0 },         // If stomach_width_round <= 0.375
              "round_width_0.5": { maxValue: 0.5 }           // If stomach_width_round >= 0.5
            }
          }
        },
        // Torso Height
        torsoHeight: {
          type: "value",
          keys: ["torso_height"],
          min: 0,
          max: 1,
          step: generateStep(2),
          ticks: 2,
          defaultValue: 0.5,
          classifications: ["Average", "Elongated"]
        }
      }
    },
    arms: {
      icon: "💪",
      label: "Arms",
      measurements: {
        // Arm Size with reconciliation
        armSize: {
          type: "value",
          keys: ["arms_size"],
          min: 0,
          max: 1,
          step: generateStep(9),
          ticks: 9,
          classifications: [
            "Arm size 1",
            "Arm size 2",
            "Arm size 3",
            "Arm size 4",
            "Arm size 5",
            "Arm size 6",
            "Arm size 7",
            "Arm size 8",
            "Arm size 9"
          ],
          reconcileWith: {
            key: "shoulderWidth",
            rules: "armSize",
            constraints: {
              "0.375": { maxValue: 0.625 },  // If shoulder_width <= 0.375, max arm_size = 0.625
              "0.5": { maxValue: 0.75 },     // If shoulder_width === 0.5, max arm_size = 0.75
              "0.625": { maxValue: 1.0 },    // If shoulder_width >= 0.625, max arm_size = 1.0
              "arm_0.375": {                 // If arm_size <= 0.375, arm_muscle = 0.5
                maxValue: 0.375                // This constraint doesn't directly set armMuscle but limits arm_size
              },
              "arm_0.5": {                   // If arm_size >= 0.5, arm_muscle = 1.0
                minValue: 0.5                  // This constraint doesn't directly set armMuscle but limits arm_size
              }
            }
          }
        },
        // Arm Muscle (new)
        armMuscle: {
          type: "value",
          keys: ["arm_muscle"],
          min: 0,
          max: 1,
          step: generateStep(3),
          ticks: 3,
          classifications: ["Toned", "Average", "Untoned"]
        },
        // Arm Extension
        armExtension: {
          type: "value",
          keys: ["arm_extension"],
          min: 0,
          max: 1,
          step: generateStep(3),
          ticks: 3,
          classifications: ["Toned", "Average", "Soft"],
        }
      }
    },
    legs: {
      icon: "🦵",
      label: "Legs",
      measurements: {
        // Leg Height
        legHeight: {
          type: "value",
          keys: ["leg_height"],
          min: 0,
          max: 1,
          step: generateStep(3),
          ticks: 3,
          defaultValue: 0.5,
          classifications: ["Short", "Average", "Tall"]
        },
        // Leg Size (new)
        legSize: {
          type: "value",
          keys: ["legs_size"],
          min: 0,
          max: 1,
          step: generateStep(9),
          ticks: 9,
          classifications: [
            "Leg size 1",
            "Leg size 2",
            "Leg size 3",
            "Leg size 4",
            "Leg size 5",
            "Leg size 6",
            "Leg size 7",
            "Leg size 8",
            "Leg size 9"
          ],
          reconcileWith: {
            key: "shoulderWidth",
            rules: "legSize",
            constraints: {
              "0.375": { maxValue: 0.5 },   // If shoulder_width <= 0.375, max leg_size = 0.5
              "0.5": { minValue: 0.125 }    // If shoulder_width >= 0.5, min leg_size = 0.125
            }
          }
        },
        bottomHeight: {
          type: "value",
          keys: ["bottom_height"],
          min: 0,
          max: 1,
          step: generateStep(3),
          ticks: 3,
          classifications: ["Short", "Average", "Long"],
          reconcileWith: {
            key: "legHeight",
            rules: "bottomHeight",
            constraints: {
              "0.0": { maxValue: 0.75 },     // If leg_height is short (0.0), max bottom_height is 0.75
              "0.5": { maxValue: 0.875 },    // If leg_height is average (0.5), max bottom_height is 0.875
              "1.0": { minValue: 0.25 }      // If leg_height is tall (1.0), min bottom_height is 0.25
            }
          }
        },
        bottomShape: {
          type: "enum",
          keys: [
            "bottom_shape_average",
            "bottom_shape_flat",
            "bottom_shape_round",
            "bottom_shape_square"
          ],
          min: 0,
          max: 3,
          step: 1,
          ticks: 4,
          classifications: ["Average", "Flat", "Round", "Square"],
          reconcileWith: {
            key: "legSize",
            rules: "bottomShape",
            constraints: {
              "0.25": {                      // If leg_size is small (≤ Size 3)
                maxValue: 0.5                // Only Average or Flat shapes allowed
              },
              "0.5": {                       // If leg_size is medium (Size 4-6)
                minValue: 0.0,               // All shapes allowed
                maxValue: 1.0
              },
              "0.75": {                      // If leg_size is large (≥ Size 7)
                minValue: 0.25               // Only Round or Square shapes allowed
              }
            }
          }
        },
        // Crotch Height
        crotchHeight: {
          type: "value",
          keys: ["crotch_height"],
          min: 0,
          max: 1,
          step: generateStep(2),
          ticks: 2,
          classifications: ["Average", "Tall"],
          valueRanges: {
            "Average": { min: 0, max: 0 },
            "Tall": { min: 1, max: 1 }
          },
          reconcileWith: {
            key: "legHeight",
            rules: "crotchHeight",
            constraints: {
              "0.0": { maxValue: 0.5 },     // If leg_height is short, max crotch_height is 0.5
              "0.5": { maxValue: 0.75 },    // If leg_height is average, max crotch_height is 0.75
              "1.0": { minValue: 0.25 }     // If leg_height is tall, min crotch_height is 0.25
            }
          }
        }
      }
    }
  }
}