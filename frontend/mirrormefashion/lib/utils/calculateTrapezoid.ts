export function calculateTrapezoid(
  shoulderWidth: number,
  shoulderHeight: number,
  neckWidth: number
): number {
  let trapezoid = 0;

  if (shoulderHeight === 0.0) {
    if (neckWidth <= 0.5) {
      if (shoulderWidth <= 0.375) trapezoid = 0.75;
      else if (shoulderWidth <= 0.75) trapezoid = 0.875;
      else trapezoid = 1.0;
    } else if (neckWidth <= 0.75) {
      if (shoulderWidth <= 0.25) trapezoid = 0.5;
      else if (shoulderWidth <= 0.625) trapezoid = 0.625;
      else if (shoulderWidth <= 0.875) trapezoid = 0.75;
      else if (shoulderWidth === 1.0) trapezoid = 1.0;
    } else if (neckWidth <= 1.0) {
      if (shoulderWidth <= 0.125) trapezoid = 0.375;
      else if (shoulderWidth <= 0.375) trapezoid = 0.5;
      else if (shoulderWidth <= 0.75) trapezoid = 0.625;
      else if (shoulderWidth <= 1.0) trapezoid = 0.75;
    }
  } else if (shoulderHeight >= 0.49 && shoulderHeight <= 0.51) {
    if (neckWidth <= 0.25) {
      if (shoulderWidth <= 0.375) trapezoid = 0.5;
      else if (shoulderWidth <= 0.75) trapezoid = 0.625;
      else trapezoid = 0.75;
    } else if (neckWidth <= 0.5) {
      if (shoulderWidth <= 0.25) trapezoid = 0.25;
      else if (shoulderWidth <= 0.625) trapezoid = 0.5;
      else if (shoulderWidth <= 1.0) trapezoid = 0.625;
    } else if (neckWidth <= 0.75) {
      if (shoulderWidth <= 0.25) trapezoid = 0.375;
      else if (shoulderWidth <= 0.625) trapezoid = 0.5;
      else if (shoulderWidth <= 1.0) trapezoid = 0.625;
    } else if (neckWidth === 1.0) {
      if (shoulderWidth <= 0.25) trapezoid = 0.25;
      else if (shoulderWidth <= 0.625) trapezoid = 0.375;
      else if (shoulderWidth <= 1.0) trapezoid = 0.5;
    }
  } else if (shoulderHeight >= 0.99 && shoulderHeight <= 1.01) {
    if (neckWidth <= 0.5) {
      if (shoulderWidth <= 0.375) trapezoid = 0.375;
      else if (shoulderWidth > 0.375) trapezoid = 0.5;
    } else if (neckWidth === 0.75 || neckWidth === 1.0) {
      trapezoid = 0.0;
    }
  }

  return trapezoid;
}
