// ✅ Type for each measurement configuration
export type ShapeKeyConfig = {
  type: "value" | "value";
  keys: string[];
  min: number;
  max: number;
  step: number;
  ticks: number;
};

// ✅ Type for a body part group
export type BodyPartGroup = {
  icon: string;
  label: string;
  measurements: Record<string, ShapeKeyConfig>;
};

// ✅ Type for the full gender configuration
export type GenderConfig = {
  head: BodyPartGroup;
  neck: BodyPartGroup;
  shoulders: BodyPartGroup;
  torso: BodyPartGroup;
  arms: BodyPartGroup;
  legs: BodyPartGroup;
};

// -------------------------------------
// 📌 Constants for consistency
// -------------------------------------
const STEPS = {
  small: 0.125,
  medium: 0.333,
  large: 0.5,
};

const TICKS = {
  binary: 2,
  few: 3,
  medium: 5,
  many: 6,
  extra: 9,
};

// -------------------------------------
// 📌 Utility: Deep Freeze for immutability
// -------------------------------------
function deepFreeze<T>(obj: T): T {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = (obj as any)[prop];
    if (
      value &&
      typeof value === "object" &&
      !Object.isFrozen(value)
    ) {
      deepFreeze(value);
    }
  });
  return obj;
}

// -------------------------------------
// 📌 Factory: Create Gender Config
// -------------------------------------
export function createGenderConfig(gender: "male" | "female"): GenderConfig {
  const torso: BodyPartGroup = {
    icon: "👕",
    label: "Torso",
    measurements: {
      stomachSize: { type: "value", keys: ["stomach_width"], min: 0, max: 1, step: STEPS.small, ticks: TICKS.extra },
      stomachShape: { type: "value", keys: [
      "shape_stomach_average",
      "shape_stomach_curvy",
      "shape_stomach_MT",
      "shape_stomach_spoon",
      "shape_stomach_rectangle",
      "shape_stomach_pregnant",
      "shape_stomach_pouch",
    ], min: 0, max: 5, step: 1, ticks: 6 },
     
    },
    
  };

  // ✅ Add female-only measurements
  if (gender === "female") {
     torso.measurements.Trimester = { type: "value", keys: ["trimester"], min: 0, max: 1, step: STEPS.medium, ticks: 4 };
   
   
  }
  torso.measurements.torsoHeight = { type: "value", keys: ["torso_height"], min: 0, max: 1, step: 0.5, ticks: TICKS.few };
    // ✅ Add female-only measurements
  if (gender === "female") {
     
    torso.measurements.bustSize = { type: "value", keys: ["breasts"], min: 0, max: 1, step: STEPS.small, ticks: TICKS.extra };
   
  }
  const baseConfig: GenderConfig = {
    head: {
      icon: "🧠",
      label: "Head",
      measurements: {
        headShape: { type: "value", keys: ["shape_head_round","shape_head_oblong","shape_head_coned"], min: 0, max: gender === "male" ? 3 : 2, step: 1, ticks: gender === "male" ? 4 : 3 },
        headSize: { type: "value", keys: ["head_size"], min: 0, max: 1, step: 0.25, ticks: TICKS.medium },
       
      },
    },
    neck: {
      icon: "🦒",
      label: "Neck",
      measurements: {
        neckHeight: { type: "value", keys: ["neck_height"], min: 0, max: 1, step: gender === "male" ? 0.20 : 0.25, ticks: gender === "male" ? 6 : 5 },
        neckWidth: { type: "value", keys: ["neck_width"], min: 0, max: 1, step: gender === "male" ? 0.25 : 0.5, ticks: gender === "male" ? 5 : 3 },
        neckShape: { type: "value", keys: ["neck_shape"], min: 0, max: 1, step: 1, ticks: TICKS.binary },
        chinShape: { type: "value", keys: ["chin_shape"], min: 0, max: 1, step: 1, ticks: TICKS.binary },
        neckLayers: { type: "value", keys: ["neck_layers"], min: 0, max: 1, step: 1, ticks: TICKS.binary },
      },
    },
    shoulders: {
      icon: "🤷",
      label: "Shoulders",
      measurements: {
        shoulderHeight: { type: "value", keys: ["shoulder_height"], min: 0, max: 1, step: STEPS.large, ticks: TICKS.few },
        shoulderWidth: { type: "value", keys: ["shoulder_width"], min: 0, max: 1, step: 0.125, ticks: 9 },
       
      },
    },
    torso,
    arms: {
      icon: "💪",
      label: "Arms",
      measurements: {
        armSize: { type: "value", keys: ["arm_size"], min: 0, max: 1, step: STEPS.medium, ticks: 4 },
        armsLength: { type: "value", keys: ["arms_distended"], min: 0, max: 1, step: 1, ticks: TICKS.binary },
                                            
                                          
      },
    },
    legs: {
      icon: "🦵",
      label: "Legs",
      measurements: {
        legHeight: { type: "value", keys: ["leg_height"], min: 0, max: 1, step: STEPS.large, ticks: TICKS.few },
        legSize: { type: "value", keys: ["leg_size"], min: 0, max: 1, step: gender === "male" ? 0.333 : 0.25, ticks: gender === "male" ? 4 : 5 },
        hipsSize: { type: "value", keys: ["hips_size"], min: 0, max: 1, step: STEPS.large, ticks: TICKS.few },
         crotchHeight: { type: "value", keys: ["crotch_height"], min: 0, max: 1, step: 0.5, ticks: TICKS.few },     
        bottomShape: { type: "value", keys: ["bottom_shape"], min: 0, max: 5, step: 1, ticks: 6  },
        bottomWidth: { type: "value", keys: ["bottom_width"], min: 0, max: 1, step: 1, ticks: TICKS.binary },
       
      },
    },
  };

  return deepFreeze(baseConfig);
}
