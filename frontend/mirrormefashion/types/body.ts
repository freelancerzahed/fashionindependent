export interface UserResponses {
  gender: string
  name: string
  age_range: string
  height: number
  weight: number
  bmi: string
  shoeSize: { size: number; category: string }
  braSize: { vol: string; band: string }
  bodyViewer: {
    state: BodyViewerState
    action: BodyViewerAction
  }
}

export type Measurements = {
  headSize: number
  faceWidth: number
  neckWidth: number
  neckHeight: number
  shoulders: number
  shoulderSlope: number
  bust: number
  waist: number
  torsoLength: number
  backCurve: number
  armLength: number
  bicepSize: number
  forearmSize: number
  hips: number
  legLength: number
  thighSize: number
  calfSize: number
}

export interface BodyPreset {
  id: string
  name: string
  description: string
  measurements: {
    bust: number
    waist: number
    hips: number
    shoulders: number
    torsoLength: number
    legLength: number
    neckWidth: number
    armLength: number
  }
  bodyType: string
}

export interface BodyViewerState {
  measurements: Measurements
  showPresets: boolean
  selectedPreset: string | null
  isAnalyzing: boolean
  bodyType: string
  showMeasurements: boolean
  openSections: Record<string, boolean>
  showTopBar: boolean
}

export type BodyViewerAction =
  | { type: 'INITIALIZE'; payload: UserResponses }
  | { type: 'COMPLETE_INITIALIZATION'; payload: { measurements: Measurements; bodyType: string } }
  | { type: 'UPDATE_MEASUREMENT'; payload: { key: keyof Measurements; value: number } }
  | { type: 'APPLY_PRESET'; payload: BodyPreset }
  | { type: 'RESET_TO_AI'; payload: UserResponses }
  | { type: 'TOGGLE_PRESETS' }
  | { type: 'TOGGLE_MEASUREMENTS' }
  | { type: 'TOGGLE_SECTION'; payload: string }
  | { type: 'SET_TOP_BAR_VISIBILITY'; payload: boolean }
