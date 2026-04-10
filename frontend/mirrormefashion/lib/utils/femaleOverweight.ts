// /lib/utils/femaleOverweight.ts
import * as THREE from 'three';
import { calculateTrapezoid } from './calculateTrapezoid';

interface FemaleOverweightOptions {
  mesh: THREE.Mesh;
  measurements: {
    shoulderWidth?: number;
    shoulderHeight?: number;
    neckShape?: number;
  };
  dict: Record<string, number>;
  debug?: boolean;
}

export function applyFemaleOverweight({ mesh, measurements, dict, debug = false }: FemaleOverweightOptions) {
  if (!mesh.morphTargetInfluences) return;
  const influences = mesh.morphTargetInfluences;

  const setMorph = (name: string, value: number) => {
    const idx = dict[name];
    if (idx !== undefined) {
      influences[idx] = value;
      if (debug) console.log(`[FemaleOverweight] ${name} → ${value}`);
    } else if (debug) {
      console.warn(`[FemaleOverweight] morph not found: ${name}`);
    }
  };

  // Trapezoid shape based on shoulder and neck measurements
  const trapezoid = calculateTrapezoid(
    measurements.shoulderWidth ?? 0,
    measurements.shoulderHeight ?? 0,
    measurements.neckShape ?? 0
  );

  setMorph('trapezoid', trapezoid);
}
