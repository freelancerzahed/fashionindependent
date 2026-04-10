// ------------------------------
// TYPE DEFINITIONS
// ------------------------------
export interface ShapeKeys {
  stomach_shape?: number;
  head_size?: number;
  head_shape?: number;
  shoulder_width?: number;
  shoulder_height?: number;
  breast?: number;
  arm_size?: number;
  height?: number;
  legs_size?: number;
  hips_size?: number;
  weightClass?: WeightClass;
}

type WeightClass = "skinny" | "average" | "OW" | "obese";

// ------------------------------
// UTILITY FUNCTION: Get Size
// ------------------------------
export function getSize(type: string, value: number = 0.0): string {
    switch (type) {
        case 'head':
            if (value <= 0.0) return "small";
            if (value <= 0.5) return "average";
            if (value <= 0.75) return "large";
            if (value <= 1.0) return "very large";
            break;
        case 'neckHeight':
            if (value === 0.0) return "Tall";
            if (value === 0.25 || value === 0.5) return "Average";
            if (value === 0.75) return "Short";
            if (value === 1.0) return "Hidden";
            break;
        case 'neckWidth': //change made
            if (value === 0.0) return "Skinny";
            if (value <= 0.5) return "Average";
            if (value <= 1.0) return "Girthy";
            break;
        case 'neckLayers': //change made
            if (value === 0.0) return "Null";
            if (value <= 1.0) return "Yes";
            break;
        case 'chinShape': //change made
            if (value === 0.0) return "Null";
            if (value <= 1.0) return "Yes";
            break;
        case 'Trapezoid': //change made
            if (value === 0.0) return "Average";
            if (value === 1.0) return "Trapezoidal";
            break;
        case 'shoulderHeight':
            if (value === 0.0) return "Strong";
            if (value === 0.5) return "Average";
            if (value === 1.0) return "Dropped";
            break;
        case 'shoulderWidth': //change made
            if (value <= 0.125) return "Narrow";
            if (value <= 0.625) return "Average";
            if (value <= 1.0) return "Broad";
            break;
        case 'pregnancy':
            if (value === 0.0) return "Trimester 1";
            if (value === 0.334) return "Trimester 2";
            if (value === 0.667) return "Trimester 3";
            if (value === 1.0) return "Trimester 4";
            break;
        case 'arm':
            if (value === 0.0) return "Small";
            if (value === 0.334 || value === 0.667) return "Average";
            if (value === 1.0) return "Large";
            break;
        case 'armDistention': //change made
            if (value === 0.0) return "Short";
            if (value === 0.5) return "Average";
            if (value === 1.0) return "Distended";
            break;
        case 'breast':
            if (value === 0.0) return "AA/A";
            if (value === 0.125) return "B";
            if (value === 0.25) return "C";
            if (value === 0.375) return "D/DD";
            if (value === 0.5) return "DDD/E";
            if (value === 0.625) return "F/G";
            if (value === 0.75) return "HH";
            if (value === 0.875) return "HHH";
            if (value === 1.0) return "J/K";
            break;
        case 'torsoDistention':
            if (value === 0.0) return "Short";
            if (value === 0.5) return "Average";
            if (value === 1.0) return "Tall";
            break;
        case 'crotchHeight': //change made
            if (value === 0.0) return "Average";
            if (value === 1.0) return "Tall";
            break;
        case 'legHeight':
            if (value === 0.0) return "Short";
            if (value === 0.5) return "Average";
            if (value === 1.0) return "Tall";
            break;
        case 'leg': //varies by shape
            if (value === 0.0) return "Leg 1";
            if (value === 0.334) return "Leg 2";
            if (value === 0.667) return "Leg 3";
            if (value === 1.0) return "Leg 4";
            break;
        case 'hip':
            if (value === 0.0) return "Small";
            if (value === 0.5) return "Average";
            if (value === 1.0) return "Wide";
            break;
        case 'bottomWidth':
            if (value === 0.0) return "Small";
            if (value === 1.0) return "Large";
            break;
        default:
            return "invalid type";
    }
    return "invalid value";
}

// ------------------------------
// MAPPING OBJECTS
// ------------------------------
const weightMap: Record<WeightClass, string> = {
  skinny: "NY_",
  average: "VG_",
  OW: "VE_",
  obese: "MO_",
};


const STOMACH_CODES = [
  "001_", // 0 → average
  "002_", // 1 → curvy
  "003_", // 2 → mt
  "004_", // 3 → spoon
  "005_", // 4 → rectangle
  "006_", // 5 → pregnant
];

const HEAD_NAMES = [
    "average", // 0
    "oblong", // 1
    "round",  // 2
    "coned",  // 3
];



const headMap: Record<string, Record<string, string>> = {
  small: { oval: "HNVS_", oblong: "HNBS_", default: "HNRS_" },
  average: { oval: "HAVS_", oblong: "HABS_", default: "HARS_" },
  large: { oval: "HLVS_", oblong: "HLBS_", default: "HLRS_" },
  "very large": { oval: "HLVS_", oblong: "HLBS_", default: "HLRS_" },
};

const shoulderMap: Record<string, Record<string, string>> = {
  Narrow: { Strong: "NWSS_", Average: "NWAS_", Dropped: "NWDS_" },
  Average: { Strong: "AWSS_", Average: "AWAS_", Dropped: "AWDS_" },
  Broad: { Strong: "BWSS_", Average: "BWAS_", Dropped: "BWDS_" },
};

const breastMap: Record<string, Record<string, string>> = {
  "AA/A": { small: "SBTA_", average: "SBAA_", big: "SBBA_" },
  B: { small: "SBTA_", average: "SBAA_", big: "SBBA_" },
  C: { small: "ABTA_", average: "ABAA_", big: "ABBA_" },
  "D/DD": { small: "ABTA_", average: "ABAA_", big: "ABBA_" },
  "DDD/E": { small: "LBTA_", average: "LBAA_", big: "LBBA_" },
  "F/G": { small: "LBTA_", average: "LBAA_", big: "LBBA_" },
  HH: { small: "EBTA_", average: "EBAA_", big: "EBBA_" },
};

// ------------------------------
// ALPHANUMERIC CODE GENERATOR
// ------------------------------
export function generateAlphanumericCode(shapeKeys: ShapeKeys, weightClass: WeightClass): string {
  const codeSegments: string[] = [];

  // 1️⃣ Weight
  codeSegments.push(weightMap[weightClass] ?? "XX_");

  // 2️⃣ Stomach
codeSegments.push(STOMACH_CODES[shapeKeys.stomach_shape ?? 0] ?? "001_");

  // 3️⃣ Head
 
  const headSize = getSize("head", shapeKeys.head_size ?? 0);
  const headShapeName = HEAD_NAMES[shapeKeys.head_shape ?? 0];
  codeSegments.push(headMap[headSize]?.[headShapeName] ?? headMap[headSize]?.default ?? "HNRS_");

  // 4️⃣ Shoulder
  const shoulderWidth = getSize("shoulderWidth", shapeKeys.shoulder_width ?? 0);
  const shoulderHeight = getSize("shoulderHeight", shapeKeys.shoulder_height ?? 0);
  codeSegments.push(shoulderMap[shoulderWidth]?.[shoulderHeight] ?? "AWAS_");

  // 5️⃣ Breast & Arm
  const breastSize = getSize("breast", shapeKeys.breast ?? 0);
  const armSize = getSize("arm", shapeKeys.arm_size ?? 0);

  const breastKey = breastMap[breastSize] ? breastSize : "HH";
  codeSegments.push(breastMap[breastKey][armSize] ?? "SBTA_");

  // 6️⃣ Height
  const height = shapeKeys.height ?? 0;
  if (height > 67) codeSegments.push("100_");
  else if (height < 60) codeSegments.push("001_");
  else codeSegments.push("111_");

  // 7️⃣  Legs & Hips
  const legSize = getSize("leg", shapeKeys.legs_size ?? 0);
  const hipSize = getSize("hip", shapeKeys.hips_size ?? 0);

  let legsHipsCode = "ALSH";
  if (legSize === "Leg 1") legsHipsCode = hipSize === "Small" ? "SLNH" : hipSize === "Average" ? "SLSH" : "SLWH";
  else if (height > 60 && height < 67) legsHipsCode = hipSize === "Small" ? "ALNH" : hipSize === "Average" ? "ALSH" : "ALWH";
  else legsHipsCode = hipSize === "Small" ? "BLNH" : hipSize === "Average" ? "BLSH" : "BLWH";

  codeSegments.push(legsHipsCode);

  return codeSegments.join("");
}
