import type { BodyPreset } from "@/types/body"

export const bodyPresets: BodyPreset[] = Object.freeze([
  {
    id: "pear",
    name: "Pear Shape",
    description: "Hips wider than shoulders",
    measurements: { bust: 34, waist: 28, hips: 38, shoulders: 36, torsoLength: 24, legLength: 32, neckWidth: 13, armLength: 24 },
    bodyType: "pear",
  },
  {
    id: "apple",
    name: "Apple Shape",
    description: "Fuller midsection",
    measurements: { bust: 38, waist: 34, hips: 36, shoulders: 38, torsoLength: 22, legLength: 30, neckWidth: 14, armLength: 23 },
    bodyType: "apple",
  },
  {
    id: "hourglass",
    name: "Hourglass",
    description: "Balanced bust and hips",
    measurements: { bust: 36, waist: 26, hips: 36, shoulders: 36, torsoLength: 23, legLength: 31, neckWidth: 13, armLength: 24 },
    bodyType: "hourglass",
  },
  {
    id: "rectangle",
    name: "Rectangle",
    description: "Similar measurements",
    measurements: { bust: 34, waist: 32, hips: 34, shoulders: 34, torsoLength: 24, legLength: 30, neckWidth: 13, armLength: 23 },
    bodyType: "rectangle",
  },
  {
    id: "inverted-triangle",
    name: "Inverted Triangle",
    description: "Shoulders wider than hips",
    measurements: { bust: 38, waist: 30, hips: 34, shoulders: 40, torsoLength: 23, legLength: 31, neckWidth: 14, armLength: 25 },
    bodyType: "inverted-triangle",
  },
])
