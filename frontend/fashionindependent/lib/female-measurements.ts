export type MeasurementRange = {
  min: number
  max: number
  unit: string
}

export type BodyMeasurements = {
  neck: MeasurementRange
  shoulders: MeasurementRange
  bust: MeasurementRange
  waist: MeasurementRange
  hips: MeasurementRange
  arms: MeasurementRange
  legs: MeasurementRange
}

// Function to calculate measurements based on shape key values
export function calculateFemaleMeasurements(shapeKeys: Record<string, number>): BodyMeasurements {
  return {
    neck: getNeckMeasurement(shapeKeys.neck_width),
    shoulders: getShoulderMeasurement(shapeKeys.shoulder_width),
    bust: getBustMeasurement(shapeKeys.breasts),
    waist: getWaistMeasurement(shapeKeys.stomach_weight, shapeKeys.stomach_width),
    hips: getHipsMeasurement(shapeKeys.hip_size),
    arms: getArmMeasurement(shapeKeys.arm_size),
    legs: getLegMeasurement(shapeKeys.leg_size)
  };
}

// Helper functions for specific measurements
function getNeckMeasurement(neckWidth: number): MeasurementRange {
  // Base range
  const base = { unit: 'cm' };
  
  if (neckWidth <= 0.25) return { ...base, min: 30, max: 32 };
  if (neckWidth <= 0.75) return { ...base, min: 32, max: 34 };
  return { ...base, min: 34, max: 36 };
}

function getShoulderMeasurement(shoulderWidth: number): MeasurementRange {
  // Based on provided measurements
  if (shoulderWidth <= 0.25) return { min: 29, max: 31, unit: 'cm' };
  if (shoulderWidth <= 0.75) return { min: 32, max: 36, unit: 'cm' };
  return { min: 37, max: 40, unit: 'cm' };
}

function getBustMeasurement(breastSize: number): MeasurementRange {
  // Base measurements for different cup sizes
  const cupSizes = {
    "AAA-AA": { min: 76, max: 78 },
    "A": { min: 78, max: 80 },
    "B-C": { min: 80, max: 85 },
    "D-DD": { min: 85, max: 90 },
    "DDD/E": { min: 90, max: 95 },
    "F/G-H": { min: 95, max: 100 },
    "HH-HHH": { min: 100, max: 105 },
    "J-K": { min: 105, max: 110 },
    "I": { min: 110, max: 115 }
  };

  // Map breast size value to cup size ranges
  if (breastSize <= 0.0) return { ...cupSizes["AAA-AA"], unit: 'cm' };
  if (breastSize <= 0.125) return { ...cupSizes["A"], unit: 'cm' };
  if (breastSize <= 0.25) return { ...cupSizes["B-C"], unit: 'cm' };
  if (breastSize <= 0.375) return { ...cupSizes["D-DD"], unit: 'cm' };
  if (breastSize <= 0.5) return { ...cupSizes["DDD/E"], unit: 'cm' };
  if (breastSize <= 0.625) return { ...cupSizes["F/G-H"], unit: 'cm' };
  if (breastSize <= 0.75) return { ...cupSizes["HH-HHH"], unit: 'cm' };
  if (breastSize <= 0.875) return { ...cupSizes["J-K"], unit: 'cm' };
  return { ...cupSizes["I"], unit: 'cm' };
}

function getWaistMeasurement(stomachWeight: number, stomachWidth: number): MeasurementRange {
  // Base calculation considering both stomach weight and width
  const baseMin = 60 + (stomachWeight * 40); // Range from 60cm to 100cm
  const baseMax = 65 + (stomachWeight * 40); // Range from 65cm to 105cm
  
  // Adjust based on stomach width
  const widthAdjustment = stomachWidth * 10; // Up to 10cm additional
  
  return {
    min: baseMin + widthAdjustment,
    max: baseMax + widthAdjustment,
    unit: 'cm'
  };
}

function getHipsMeasurement(hipSize: number): MeasurementRange {
  // Base measurements for different hip sizes
  if (hipSize <= 0.0) return { min: 85, max: 90, unit: 'cm' };
  if (hipSize <= 0.5) return { min: 90, max: 100, unit: 'cm' };
  return { min: 100, max: 110, unit: 'cm' };
}

function getArmMeasurement(armSize: number): MeasurementRange {
  // 5 size ranges for arms
  if (armSize <= 0.0) return { min: 20, max: 22, unit: 'cm' };
  if (armSize <= 0.25) return { min: 22, max: 24, unit: 'cm' };
  if (armSize <= 0.5) return { min: 24, max: 26, unit: 'cm' };
  if (armSize <= 0.75) return { min: 26, max: 28, unit: 'cm' };
  return { min: 28, max: 30, unit: 'cm' };
}

function getLegMeasurement(legSize: number): MeasurementRange {
  // 5 size ranges for legs
  if (legSize <= 0.125) return { min: 45, max: 48, unit: 'cm' };
  if (legSize <= 0.375) return { min: 48, max: 51, unit: 'cm' };
  if (legSize <= 0.625) return { min: 51, max: 54, unit: 'cm' };
  if (legSize <= 0.875) return { min: 54, max: 57, unit: 'cm' };
  return { min: 57, max: 60, unit: 'cm' };
}