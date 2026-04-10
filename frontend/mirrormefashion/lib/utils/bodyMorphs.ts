import * as THREE from "three";

interface BaseMorphOptions {
  mesh: THREE.Mesh;
  dict: Record<string, number>;
  debug?: boolean;
}

interface ShoulderWidthOptions extends BaseMorphOptions {
  value: number;
  measurements: Record<string, number>;
}

interface StomachShapeOptions extends BaseMorphOptions {
  stomachShape: number;
  stomachWidthValue: number;
  setTrimesterEnabled?: (enabled: boolean) => void;
}

interface StomachWidthOptions extends BaseMorphOptions {
  stomachShape: number;
  stomachWidthValue: number;
}

const SHAPE_KEYS = {
  stomachShapes: [
    "shape_stomach_average",
    "shape_stomach_curvy",
    "shape_stomach_MT",
    "shape_stomach_spoon",
    "shape_stomach_rectangle",
    "shape_stomach_pregnant",
    "shape_stomach_pouch",
  ],
  stomachWidths: [
    "stomach_width_average",
    "stomach_width_spoon",
    "stomach_width_rect",
    "stomach_width_pregnant",
    "stomach_width_pouch",
  ],
};

const STOMACH_SHAPE_MAP: Record<number, string> = {
  0: "shape_stomach_average",
  1: "shape_stomach_curvy",
  2: "shape_stomach_MT",
  3: "shape_stomach_spoon",
  4: "shape_stomach_rectangle",
  5: "shape_stomach_pregnant",
};

function debugLog(debug: boolean, ...args: any[]) {
  if (debug) console.log(...args);
}

export function applyShape(
  mesh: THREE.Mesh,
  dict: Record<string, number>,
  value: number,
  shapeKeys: string[]
) {
  const influences = mesh.morphTargetInfluences;
  if (!influences) return;

  shapeKeys.forEach((shape, i) => {
    const idx = dict[shape];
    if (idx !== undefined) {
      influences[idx] = value === i + 1 ? 1 : 0;
    }
  });
}


function initializeMorphTargets(mesh: THREE.Mesh, dict: Record<string, number>, debug: boolean = false): boolean {
  if (!mesh.morphTargetInfluences) {
    mesh.morphTargetInfluences = new Array(Object.keys(dict).length).fill(0);
    debugLog(debug, "Initialized morphTargetInfluences", mesh.morphTargetInfluences);
    return true;
  }
  return false;
}

function resetMorphs(influences: number[], dict: Record<string, number>, keys: string[], debug: boolean = false) {
  keys.forEach((key) => {
    const idx = dict[key];
    if (idx !== undefined) {
      influences[idx] = 0;
      debugLog(debug, `Reset ${key} (index ${idx}) to 0`);
    }
  });
}

function getActiveWidthKey(stomachShape: number): string {
  switch (stomachShape) {
    case 2:
    case 3:
      return "stomach_width_spoon";
    case 4:
      return "stomach_width_rect";
    case 5:
      return "stomach_width_pregnant";
    default:
      return "stomach_width_average";
  }
}

 function getActiveStomachShapeKey(stomachShape: number): string {
  return STOMACH_SHAPE_MAP[stomachShape] || "shape_stomach_average";
}

export function updateShoulderWidthMorphs({ mesh, value, measurements, dict, debug = false }: ShoulderWidthOptions) {
  initializeMorphTargets(mesh, dict, debug);
  const influences = mesh.morphTargetInfluences!;

  // Shoulder Width
  Object.keys(dict).forEach((morphKey) => {
    if (morphKey.includes("shoulder_width")) {
      const idx = dict[morphKey];
      if (idx !== undefined) {
        influences[idx] = value;
        debugLog(debug, `Updated ${morphKey} (index ${idx}) to`, value);
      }
    }
  });

  // Active Stomach Shape
  const stomachShapeValue = measurements.stomachShape || 0;
  const activeKey = getActiveWidthKey(stomachShapeValue);
  debugLog(debug, "Stomach shape value:", stomachShapeValue, "-> active key:", activeKey);

  SHAPE_KEYS.stomachWidths.forEach((key) => {
    const idx = dict[key];
    if (idx !== undefined) {
      influences[idx] = key === activeKey ? value : 0;
      debugLog(debug, `Updated ${key} (index ${idx}) to`, influences[idx]);
    }
  });
}

export function updateStomachShapeMorphs({
  mesh,
  stomachShape,
  dict,
  debug = false,
  setTrimesterEnabled,
}: StomachShapeOptions) {
  initializeMorphTargets(mesh, dict, debug);
  const influences = mesh.morphTargetInfluences!;

  // Reset all shapes
  resetMorphs(influences, dict, SHAPE_KEYS.stomachShapes, debug);

  // Activate shape
  const activeShapeKey = getActiveStomachShapeKey(stomachShape);
  const activeIdx = dict[activeShapeKey];
  if (activeIdx !== undefined) {
    influences[activeIdx] = 1;
    debugLog(debug, "Active stomach shape:", activeShapeKey);
  }

  // Trimester toggle
  if (setTrimesterEnabled) {
    setTrimesterEnabled(stomachShape === 5);
  }
}

export function updateStomachWidthMorphs({
  mesh,
  stomachShape,
  stomachWidthValue,
  dict,
  debug = false,
  neckShapeValue = 0, // 👈 নতুন প্যারামিটার, slider থেকে আসবে
}: StomachWidthOptions & { neckShapeValue?: number }) {
  initializeMorphTargets(mesh, dict, debug);
  const influences = mesh.morphTargetInfluences!;

  // Reset all stomach width morphs
  resetMorphs(influences, dict, SHAPE_KEYS.stomachWidths, debug);

  // Apply width to active stomach morph
  const activeWidth = getActiveWidthKey(stomachShape);
  if (dict[activeWidth] !== undefined) {
    influences[dict[activeWidth]] = stomachWidthValue;
  }

  // Apply same value to shoulder_width
  if (dict["shoulder_width"] !== undefined) {
    influences[dict["shoulder_width"]] = stomachWidthValue;
  }

  // ✅ NeckShape update only if neckShapeValue == 1
  if (dict["neck_shape"] !== undefined) {
    if (neckShapeValue === 1) {
      influences[dict["neck_shape"]] = stomachWidthValue;
      debugLog(debug, "neck_shape updated =", stomachWidthValue);
    } else {
      influences[dict["neck_shape"]] = 0; // neck off
      debugLog(debug, "neck_shape disabled (neckShape slider != 1)");
    }
  }

  debugLog(debug, "Active stomach width morph:", activeWidth);
  debugLog(debug, "stomach_width =", stomachWidthValue);
  debugLog(debug, "shoulder_width =", stomachWidthValue);
}



export function getAllShapeKeyValues(mesh: THREE.Mesh) {
  const dict = mesh.morphTargetDictionary;
  const influences = mesh.morphTargetInfluences;

  if (!dict || !influences) return {};

  const result: Record<string, number> = {};
  Object.entries(dict).forEach(([key, idx]) => {
    result[key] = influences[idx as number] || 0;
  });

  return result;
}
