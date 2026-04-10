import { generateStep } from "./utils"
import { GenderConfig, BodyPartGroup, ShapeKeyConfig } from "./body-groups"

export function createFemaleConfig(): GenderConfig {
  return {
    head: {
      icon: "🧠",
      label: "Head",
      measurements: {
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
          }
        },
        headShape: {
          type: "enum",
          keys: ["head_shape_round", "head_shape_oblong", "head_shape_coned"],
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
            key: "head_size",
            rules: "neckWidth"
          }
        },
        neckLayers: {
          type: "value",
          keys: ["neck_layers"],
          min: 0,
          max: 1,
          step: 1,
          ticks: 2,
          classifications: ["Average", "Has Neck Layers"]
        },
        chinShape: {
          type: "enum",
          keys: ["chin_shape"],
          min: 0,
          max: 1,
          step: 1,
          ticks: 2,
          classifications: ["Average", "Has Chin Fat"]
        },
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
            rules: "trapezoid"
          }
        }
      }
    },
    shoulders: {
      icon: "🤷",
      label: "Shoulders",
      measurements: {
        shoulderHeight: {
          type: "value",
          keys: ["shoulder_height"],
          min: 0,
          max: 1,
          step: generateStep(3),
          
          ticks: 3,
          classifications: ["Strong", "Average", "Dropped"]
        },
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
        bustSize: {
          type: "value",
          keys: ["breasts"],
          min: 0,
          max: 1,
          step: generateStep(9),
          ticks: 9,
          classifications: [
            "AAA-AA", "A", "B-C", "D-DD", "DDD/E",
            "F/G-H", "HH-HHH", "J-K", "I"
          ]
        },
        stomachWeight: {
          type: "value",
          keys: ["stomach_weight"],
          min: 0,
          max: 1,
          step: generateStep(9),
          
          ticks: 9,
          reconcileWith: {
            key: "shoulderWidth",
            rules: "stomachWeight"
          }
        },
        stomachShape: {
          type: "enum",
          keys: [
            "stomach_shape_average",
            "stomach_shape_curvy",
            "stomach_shape_spoon",
            "stomach_shape_muffintop",
            "stomach_shape_rectangle",
            "stomach_shape_round",
            "stomach_shape_pregnant"
          ],
          min: 0,
          max: 6,
          step: 1,
          ticks: 7,
          classifications: ["Average", "Curvy", "Spoon", "Muffintop", "Rectangle", "Round", "Pregnant"]
        }
      }
    },
    arms: {
      icon: "💪",
      label: "Arms",
      measurements: {
        armSize: {
          type: "value",
          keys: ["arm_size"],
          min: 0,
          max: 1,
          step: generateStep(9),
          
          ticks: 9,
          classifications: ["Arm Size 1", "Arm Size 2", "Arm Size 3", "Arm Size 4", "Arm Size 5"],
          valueRanges: {
            "Arm Size 1": { min: 0.0, max: 0.125 },
            "Arm Size 2": { min: 0.125, max: 0.25 },
            "Arm Size 3": { min: 0.25, max: 0.5 },
            "Arm Size 4": { min: 0.5, max: 0.75 },
            "Arm Size 5": { min: 0.75, max: 1.0 }
          },
          reconcileWith: {
            key: "shoulderWidth",
            rules: "armSize"
          }
        },
        armMuscle: {
          type: "value",
          keys: ["arm_muscle"],
          min: 0,
          max: 1,
          step: generateStep(3),
          
          ticks: 3,
          classifications: ["Toned", "Average", "Soft"]
        },
        armExtension: {
          type: "value",
          keys: ["arm_extension"],
          min: 0,
          max: 1,
          step: generateStep(3),
          
          ticks: 3,
          classifications: ["Short", "Average", "Long"]
        }
      }
    },
    legs: {
      icon: "🦵",
      label: "Legs",
      measurements: {
        torsoHeight: {
          type: "value",
          keys: ["torso_height"],
          min: 0,
          max: 1,
          step: generateStep(2),
          
          ticks: 2,
          classifications: ["Average", "Elongated"]
        },
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
          }
        },
        legHeight: {
          type: "value",
          keys: ["leg_height"],
          min: 0,
          max: 1,
          step: generateStep(3),
          
          ticks: 3,
          classifications: ["Short", "Average", "Tall"]
        },
        legSize: {
          type: "value",
          keys: ["leg_size"],
          min: 0,
          max: 1,
          step: generateStep(9),
          
          ticks: 9,
          classifications: ["Leg Size 1", "Leg Size 2", "Leg Size 3", "Leg Size 4", "Leg Size 5"],
          valueRanges: {
            "Leg Size 1": { min: 0.0, max: 0.125 },
            "Leg Size 2": { min: 0.125, max: 0.25 },
            "Leg Size 3": { min: 0.25, max: 0.5 },
            "Leg Size 4": { min: 0.5, max: 0.75 },
            "Leg Size 5": { min: 0.75, max: 1.0 }
          },
          reconcileWith: {
            key: "shoulderWidth",
            rules: "legSize"
          }
        },
        hipSize: {
          type: "value",
          keys: ["hip_size"],
          min: 0,
          max: 1,
          step: generateStep(3),
          ticks: 3,
          classifications: ["No Hips", "Some Hips", "Wide Hips"]
        },
        bottomHeight: {
          type: "value",
          keys: ["bottom_height"],
          min: 0,
          max: 1,
          step: generateStep(2),
          ticks: 2,
          classifications: ["Average", "Tall"]
        },
        bottomShape: {
          type: "enum",
          keys: [
            "bottom_shape_average",
            "bottom_shape_flat",
            "bottom_shape_round",
            "bottom_shape_square",
            "bottom_shape_heart",
            "bottom_shape_inverted",
            "bottom_shape_dunk"
          ],
          min: 0,
          max: 6,
          step: 1,
          ticks: 7,
          classifications: ["Average", "Flat", "Round", "Square", "Heart", "Inverted", "Dunk"]
        }
      }
    }
  };
}