// -------------------------------------
// 📌 Slider Configuration
// -------------------------------------
export const TICKS = {
  TWO: 2,    // Binary options
  THREE: 3,  // Basic options (e.g., Small/Average/Large)
  FIVE: 5,   // Extended options
  SEVEN: 7,  // Detailed options (e.g., body shapes)
  NINE: 9    // Fine-grained control (e.g., precise sizes)
} as const;

// Mapping between slider positions (0-based) and actual shape key values
export const SLIDER_TO_VALUE = {
  NINE_STEPS: [ // 9 ticks, full range with fine control
    0.0,    // Position 0
    0.125,  // Position 1
    0.25,   // Position 2
    0.375,  // Position 3
    0.5,    // Position 4 (middle)
    0.625,  // Position 5
    0.75,   // Position 6
    0.875,  // Position 7
    1.0     // Position 8
  ],
  SEVEN_STEPS: [ // 7 ticks, for body shapes
    0.0,    // Base shape
    0.167,  // Shape 1
    0.333,  // Shape 2
    0.5,    // Shape 3 (middle)
    0.667,  // Shape 4
    0.833,  // Shape 5
    1.0     // Shape 6
  ],
  FIVE_STEPS: [ // 5 ticks, common measurements
    0.0,    // Minimum
    0.25,   // Quarter
    0.5,    // Middle
    0.75,   // Three-quarters
    1.0     // Maximum
  ],
  THREE_STEPS: [ // 3 ticks, basic options
    0.0,    // First option
    0.5,    // Middle option
    1.0     // Last option
  ],
  TWO_STEPS: [ // 2 ticks, binary choices
    0.0,    // Off/False
    1.0     // On/True
  ]
} as const;

// -------------------------------------
// 📌 Male Model Defaults & Configuration
// -------------------------------------
export const MALE_BASE_MODEL_DEFAULTS = {
  // Head & Face (9 ticks)
  head_size: 0.5,         // Average head size
  
  // Neck (5 ticks)
  neck_width: 0.5,        // Average neck width
  neck_height: 0.5,       // Average neck height
  
  // Shoulders (9 ticks)
  shoulder_width: 0.5,    // Average shoulder width 42-46cm
  shoulder_height: 0.5,   // Average shoulder height
  trapezoid: 0.25,        // Average trapezoid muscle
  
  // Arms (9 ticks for size, 3 for muscle)
  arms_size: 0.5,        // Average arm size
  arm_muscle: 0.5,      // Average muscle definition
  arm_extension: 0.5,   // Average arm length
  
  // Legs (9 ticks)
  legs_size: 0.5,      // Average leg height
  
} as const;

// -------------------------------------
// 📌 Female Model Defaults & Configuration
// -------------------------------------
export const FEMALE_BASE_MODEL_DEFAULTS = {
  "head_size": 0.5,          // 5 ticks
  "shoulder_width": 0.5,     // Shoulder Width/Stomach Size → 5 ticks
  "stomach_weight": 0.5,     // extracted from same group
  "arm_extension": 0.5,      // 2 ticks
  "torso_height": 0.5,       // 2 ticks
  "leg_height": 0.5          // 2 ticks
} as const;

// -------------------------------------
// 📌 Male Measurements & Classifications
// -------------------------------------
export const MALE_MEASUREMENTS = {
  SHOULDER_WIDTH: {
    NARROW: { min: 37, max: 41, unit: "cm" },
    AVERAGE: { min: 42, max: 46, unit: "cm" },
    BROAD: { min: 47, max: 52, unit: "cm" }
  },
  NECK_HEIGHT: {
    TALL: { value: 8, unit: "cm" },
    AVERAGE: { value: 6, unit: "cm" },
    SHORT: { value: 4, unit: "cm" },
    HIDDEN: { value: 2, unit: "cm" },
    NONE: { value: 0, unit: "cm" }
  }
} as const;

// -------------------------------------
// 📌 Female Measurements & Classifications
// -------------------------------------
export const FEMALE_MEASUREMENTS = {
  SHOULDER_WIDTH: {
    NARROW: { min: 29, max: 31, unit: "cm" },
    AVERAGE: { min: 32, max: 36, unit: "cm" },
    BROAD: { min: 37, max: 40, unit: "cm" }
  },
  NECK_HEIGHT: {
    TALL: { value: 6, unit: "cm" },
    AVERAGE: { value: 4, unit: "cm" },
    SHORT: { value: 2.5, unit: "cm" },
    HIDDEN: { value: 1, unit: "cm" },
    NONE: { value: 0, unit: "cm" }
  }
} as const;

// -------------------------------------
// 📌 Shape Key Value Ranges & Classifications
// -------------------------------------
export const SHAPE_KEY_RANGES = {
  // Head size - 9 ticks
  head_size: {
    SMALL: { min: 0.0, max: 0.25 },
    AVERAGE: { min: 0.375, max: 0.625 },
    LARGE: { min: 0.75, max: 0.875 },
    VERY_LARGE: { min: 1.0, max: 1.0 }
  },
  // Neck width - 5 ticks
  neck_width: {
    SKINNY: { min: 0.0, max: 0.25 },
    AVERAGE: { min: 0.5, max: 0.75 },
    GIRTHY: { min: 1.0, max: 1.0 }
  },
  // Neck height - 5 ticks
  neck_height: {
    TALL: { value: 0.0 },
    AVERAGE: { value: 0.25 },
    SHORT: { value: 0.5 },
    HIDDEN: { value: 0.75 },
    NONE: { value: 1.0 }
  },
  // Shoulder width - 9 ticks
  shoulder_width: {
    narrow: { min: 0.0, max: 0.25, measurement: "29-31cm" },
    average: { min: 0.375, max: 0.75, measurement: "32-36cm" },
    broad: { min: 0.875, max: 1.0, measurement: "37-40cm" }
  }
} as const;