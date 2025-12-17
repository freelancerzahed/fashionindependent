export type MeasurementRange = {
  min: number
  max: number
  unit: string
}

export type BodyMeasurements = {
  neck: MeasurementRange
  shoulders: MeasurementRange
  chest: MeasurementRange
  waist: MeasurementRange
  hips: MeasurementRange
  arms: MeasurementRange
  legs: MeasurementRange
}

export function calculateMaleMeasurements(shapeKeys: Record<string, number>): BodyMeasurements {
  return {
    neck: getNeckMeasurement(shapeKeys.neck_width),
    shoulders: getShoulderMeasurement(shapeKeys.shoulder_width),
    chest: getChestMeasurement(shapeKeys.stomach_width, shapeKeys.stomach_shape_muscular),
    waist: getWaistMeasurement(shapeKeys.stomach_weight, shapeKeys.stomach_width),
    hips: getHipsMeasurement(shapeKeys.hip_size),
    arms: getArmMeasurement(shapeKeys.arm_size, shapeKeys.arm_muscle),
    legs: getLegMeasurement(shapeKeys.leg_size)
  };
}

function getNeckMeasurement(neckWidth: number): MeasurementRange {
  if (neckWidth <= 0.25) {
    return { min: 32, max: 34, unit: 'cm' };
  } else if (neckWidth <= 0.75) {
    return { min: 34, max: 36, unit: 'cm' };
  } else {
    return { min: 36, max: 38, unit: 'cm' };
  }
}

function getShoulderMeasurement(shoulderWidth: number): MeasurementRange {
  if (shoulderWidth <= 0.25) {
    return { min: 29, max: 31, unit: 'cm' };
  } else if (shoulderWidth <= 0.75) {
    return { min: 32, max: 36, unit: 'cm' };
  } else {
    return { min: 37, max: 40, unit: 'cm' };
  }
}

function getChestMeasurement(stomachWidth: number, muscular: number): MeasurementRange {
  const base = { unit: 'cm' };
  const isMuscular = muscular > 0;

  if (stomachWidth <= 0.25) {
    return { ...base, min: isMuscular ? 90 : 85, max: isMuscular ? 95 : 90 };
  } else if (stomachWidth <= 0.75) {
    return { ...base, min: isMuscular ? 95 : 90, max: isMuscular ? 100 : 95 };
  } else {
    return { ...base, min: isMuscular ? 100 : 95, max: isMuscular ? 105 : 100 };
  }
}

function getWaistMeasurement(stomachWeight: number, stomachWidth: number): MeasurementRange {
  const base = { unit: 'cm' };
  
  if (stomachWidth <= 0.25) {
    return { ...base, min: 70, max: 75 };
  } else if (stomachWidth <= 0.5) {
    return { ...base, min: 75, max: 80 };
  } else if (stomachWidth <= 0.75) {
    return { ...base, min: 80, max: 85 };
  } else {
    return { ...base, min: 85, max: 90 };
  }
}

function getHipsMeasurement(hipSize: number): MeasurementRange {
  const base = { unit: 'cm' };

  if (hipSize <= 0.25) {
    return { ...base, min: 85, max: 90 };
  } else if (hipSize <= 0.75) {
    return { ...base, min: 90, max: 95 };
  } else {
    return { ...base, min: 95, max: 100 };
  }
}

function getArmMeasurement(armSize: number, armMuscle: number): MeasurementRange {
  const base = { unit: 'cm' };
  const isToned = armMuscle <= 0.25;
  
  if (armSize <= 0.25) {
    return { ...base, min: isToned ? 25 : 23, max: isToned ? 28 : 26 };
  } else if (armSize <= 0.75) {
    return { ...base, min: isToned ? 28 : 26, max: isToned ? 31 : 29 };
  } else {
    return { ...base, min: isToned ? 31 : 29, max: isToned ? 34 : 32 };
  }
}

function getLegMeasurement(legSize: number): MeasurementRange {
  const base = { unit: 'cm' };

  if (legSize <= 0.25) {
    return { ...base, min: 45, max: 50 };
  } else if (legSize <= 0.75) {
    return { ...base, min: 50, max: 55 };
  } else {
    return { ...base, min: 55, max: 60 };
  }
}
