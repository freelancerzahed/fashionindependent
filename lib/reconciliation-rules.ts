// -------------------------------------
// 📌 Reconciliation Rules for Female Body Model
// Based on Client Specification: Female Body Model Instructions
// Only applies to female gender
// -------------------------------------
import { SHAPE_KEY_RANGES } from './base-model-defaults';
import { Gender, ReconciliationRule } from './types/reconciliation';

export const RECONCILIATION_RULES: ReconciliationRule[] = [
  // ========================================
  // FEMALE-ONLY RECONCILIATION RULES

  // ========================================

  // 1. NECK WIDTH RECONCILIATION
  // Objective: Keep head/neck proportions realistic as head size increases
  // If head_size >= 0.75: neck_width = 0.2 * (neck_width_slider_index + 1)
  // Otherwise: neck_width = 0.25 * neck_width_slider_index
  {
    target: 'neck_width',
    gender: 'female',
    condition: (values) => {
      return 'head_size' in values && typeof values.head_size === 'number' && !isNaN(values.head_size);
    },
    outcome: (values) => {
      const headSize = values.head_size;
      const neckWidthSlider = values.neck_width ?? 0;
      let newNeckWidth: number;

      // 5 slider steps (indices 0-4): slider 0.0->index 0, slider 1.0->index 4
      const sliderIndex = Math.round(neckWidthSlider * 4);

      if (headSize >= 0.75) {
        // Formula: neck_width = 0.2 * (sliderIndex + 1)
        // Results: 0->0.2, 1->0.4, 2->0.6, 3->0.8, 4->1.0
        newNeckWidth = 0.2 * (sliderIndex + 1);
      } else {
        // Formula: neck_width = 0.25 * sliderIndex
        // Results: 0->0.0, 1->0.25, 2->0.5, 3->0.75, 4->1.0
        newNeckWidth = 0.25 * sliderIndex;
      }

      newNeckWidth = Math.max(0, Math.min(1, newNeckWidth));
      return { neck_width: newNeckWidth };
    },
    description: "Reconcile neck width based on head size (proportional scaling)"
  },

  // 2. TRAPEZOID RECONCILIATION
  // Objective: Keep trapezoid shape consistent as shoulder height changes
  // shoulder_height = 0.0 -> trapezoid = 0.5
  // shoulder_height = 0.5 -> trapezoid = 0.25
  // shoulder_height = 1.0 -> trapezoid = 0.0
  {
    target: 'trapezoid',
    gender: 'female',
    condition: (values) => {
      return 'shoulder_height' in values && typeof values.shoulder_height === 'number' && !isNaN(values.shoulder_height);
    },
    outcome: (values) => {
      const shoulderHeight = values.shoulder_height;
      let newTrapezoid: number;

      if (shoulderHeight === 0.0) {
        newTrapezoid = 0.5;
      } else if (shoulderHeight === 0.5) {
        newTrapezoid = 0.25;
      } else if (shoulderHeight === 1.0) {
        newTrapezoid = 0.0;
      } else {
        // Interpolate for intermediate values
        if (shoulderHeight < 0.5) {
          newTrapezoid = 0.5 - (shoulderHeight / 0.5) * 0.25;
        } else {
          newTrapezoid = 0.25 - ((shoulderHeight - 0.5) / 0.5) * 0.25;
        }
      }

      return { trapezoid: newTrapezoid };
    },
    description: "Reconcile trapezoid shape based on shoulder height"
  },

  // 3. STOMACH WEIGHT RECONCILIATION
  // Objective: Prevent unrealistic deformations for skinny/average models
  // When shoulder_width changes, stomach_weight slider must adjust to stay within constraint
  // 
  // Logic:
  // - If shoulder_width <= 0.375 (NARROW): stomach_weight max = 0.4
  //   Slider value gets capped: if > 0.4, remap to 0.4
  // - If shoulder_width > 0.375 (NORMAL): stomach_weight max = 1.0
  //   Slider can use full range
  {
    target: 'stomach_weight',
    gender: 'female',
    condition: (values) => {
      // Apply whenever both stomach_weight and shoulder_width exist
      return 'stomach_weight' in values && 'shoulder_width' in values && 
             typeof values.stomach_weight === 'number' && typeof values.shoulder_width === 'number';
    },
    outcome: (values) => {
      const shoulderWidth = values.shoulder_width ?? 0.5;
      const currentStomachWeight = values.stomach_weight ?? 0;

      let newStomachWeight: number;

      if (shoulderWidth <= 0.375) {
        // NARROW SHOULDERS: Cap at 0.4
        // If current value > 0.4, reduce it to 0.4
        newStomachWeight = Math.min(currentStomachWeight, 0.4);
      } else {
        // NORMAL/WIDE SHOULDERS: Full range 0-1.0, no cap needed
        newStomachWeight = currentStomachWeight;
      }

      // If value changed, return it
      if (Math.abs(newStomachWeight - currentStomachWeight) > 0.001) {
        console.log(`📥 [Stomach Weight Rule] Adjusted for shoulder width:`, {
          shoulderWidth,
          oldValue: currentStomachWeight,
          newValue: newStomachWeight
        });
        return { stomach_weight: newStomachWeight };
      }

      return {};
    },
    description: "Reconcile stomach weight: cap at 0.4 if shoulder_width <= 0.375, else allow full range"
  },

  // 4. ARM SIZE RECONCILIATION
  // Objective: Ensure realistic arm sizes based on shoulder width
  // Increment = 0.05 (or 0.1 if shoulder_width >= 0.625)
  // Set min and max constraints based on shoulder_width per client spec table
  {
    target: 'arm_size',
    gender: 'female',
    condition: (values) => {
      return 'shoulder_width' in values && typeof values.shoulder_width === 'number' && !isNaN(values.shoulder_width);
    },
    outcome: (values) => {
      const shoulderWidth = values.shoulder_width;
      const armSizeSlider = values.arm_size ?? 0;
      
      // 9 slider steps (indices 0-8)
      const sliderIndex = Math.round(armSizeSlider * 8);

      // Determine increment based on shoulder width
      let increment = 0.05;
      if (shoulderWidth >= 0.625) {
        increment = 0.1;
      }

      // Calculate base arm size with increment
      let newArmSize = sliderIndex * increment;

      // Apply min/max constraints based on shoulder width (per client spec table)
      if (shoulderWidth <= 0.125) {
        // Max arm_size == 0.375
        newArmSize = Math.min(newArmSize, 0.375);
      } else if (shoulderWidth === 0.25) {
        // Max arm_size == 0.5
        newArmSize = Math.min(newArmSize, 0.5);
      } else if (shoulderWidth === 0.375) {
        // Max arm_size == 0.625
        newArmSize = Math.min(newArmSize, 0.625);
      } else if (shoulderWidth === 0.5) {
        // Min arm_size == 0.125 && Max arm_size == 0.75
        newArmSize = Math.max(0.125, Math.min(newArmSize, 0.75));
      } else if (shoulderWidth === 0.625) {
        // Min arm_size == 0.25 && Max arm_size == 0.75
        newArmSize = Math.max(0.25, Math.min(newArmSize, 0.75));
      } else if (shoulderWidth === 0.75) {
        // Min arm_size == 0.25
        newArmSize = Math.max(0.25, newArmSize);
      } else if (shoulderWidth >= 0.875) {
        // Min arm_size == 0.375
        newArmSize = Math.max(0.375, newArmSize);
      }

      newArmSize = Math.max(0, Math.min(1, newArmSize));
      return { arm_size: newArmSize };
    },
    description: "Reconcile arm size based on shoulder width to maintain realistic proportions"
  },

  // 5. LEG SIZE RECONCILIATION
  // Objective: Prevent oversized legs on low BMI models
  // If shoulder_width <= 0.25: max leg_size = 0.8, use 0.1 increment
  // If shoulder_width >= 0.5: min leg_size = 0.2, add 0.2 to leg_size
  {
    target: 'leg_size',
    gender: 'female',
    condition: (values) => {
      return 'shoulder_width' in values && typeof values.shoulder_width === 'number' && !isNaN(values.shoulder_width);
    },
    outcome: (values) => {
      const shoulderWidth = values.shoulder_width;
      const legSizeSlider = values.leg_size ?? 0;
      
      // 9 slider steps (indices 0-8)
      const sliderIndex = Math.round(legSizeSlider * 8);
      let newLegSize: number;

      if (shoulderWidth <= 0.25) {
        // Use 0.1 increment, cap at 0.8
        // Formula: leg_size = sliderIndex * 0.1, max 0.8
        newLegSize = sliderIndex * 0.1;
        newLegSize = Math.min(newLegSize, 0.8);
      } else if (shoulderWidth >= 0.5) {
        // Add 0.2 to leg_size, minimum 0.2
        // Formula: leg_size = (sliderIndex * increment) + 0.2, min 0.2
        // With 0.1 increment: 0->0.2, 1->0.3, 2->0.4, ..., 8->1.0
        newLegSize = (sliderIndex * 0.1) + 0.2;
        newLegSize = Math.max(0.2, newLegSize);
      } else {
        // Intermediate shoulder width (0.25 < sw < 0.5): standard increment 0.125
        // Formula: leg_size = sliderIndex * (1 / 8)
        newLegSize = sliderIndex * 0.125;
      }

      newLegSize = Math.max(0, Math.min(1, newLegSize));
      return { leg_size: newLegSize };
    },
    description: "Reconcile leg size based on shoulder width to maintain realistic BMI proportions"
  },

  // ========================================
  // INVERSE/REVERSE RULES - For Bidirectional Reconciliation
  // When dependent sliders change, update their drivers
  // ========================================

  // 1B. INVERSE NECK WIDTH → HEAD SIZE
  // When neck_width changes, adjust head_size proportionally
  {
    target: 'head_size',
    gender: 'female',
    condition: (values) => {
      // Only apply if neck_width was explicitly modified (detect by checking if condition would change it)
      return 'neck_width' in values && typeof values.neck_width === 'number' && !isNaN(values.neck_width);
    },
    outcome: (values) => {
      const neckWidth = values.neck_width;
      const headSize = values.head_size ?? 0.5;
      
      // If head_size < 0.75, inverse formula: head_size = neck_width / 0.25
      // If head_size >= 0.75, inverse formula: head_size = (neck_width / 0.2) - 1
      let newHeadSize: number;

      if (neckWidth <= 0.25) {
        // Likely from head_size < 0.75 branch
        newHeadSize = neckWidth / 0.25 * 0.5; // Map back to 0-0.5 range
      } else {
        // Likely from head_size >= 0.75 branch
        newHeadSize = Math.min(1, 0.75 + (neckWidth - 0.2) / 0.2 * 0.25);
      }

      newHeadSize = Math.max(0, Math.min(1, newHeadSize));
      return { head_size: newHeadSize };
    },
    description: "Inverse: Reconcile head size when neck width changes"
  },

  // 2B. INVERSE TRAPEZOID → SHOULDER HEIGHT
  // When trapezoid changes, adjust shoulder_height proportionally
  {
    target: 'shoulder_height',
    gender: 'female',
    condition: (values) => {
      return 'trapezoid' in values && typeof values.trapezoid === 'number' && !isNaN(values.trapezoid);
    },
    outcome: (values) => {
      const trapezoid = values.trapezoid;
      let newShoulderHeight: number;

      // Inverse mapping based on the trapezoid formula
      // trapezoid = 0.5 at shoulder_height = 0.0
      // trapezoid = 0.25 at shoulder_height = 0.5
      // trapezoid = 0.0 at shoulder_height = 1.0
      
      if (trapezoid >= 0.375) {
        // First half: shoulder_height 0 to 0.5
        newShoulderHeight = (0.5 - trapezoid) / 0.25 * 0.5;
      } else {
        // Second half: shoulder_height 0.5 to 1.0
        newShoulderHeight = 0.5 + (0.25 - trapezoid) / 0.25 * 0.5;
      }

      newShoulderHeight = Math.max(0, Math.min(1, newShoulderHeight));
      return { shoulder_height: newShoulderHeight };
    },
    description: "Inverse: Reconcile shoulder height when trapezoid changes"
  },

  // 3B. INVERSE STOMACH WEIGHT → SHOULDER WIDTH
  // When stomach_weight changes, suggest adjustment to shoulder_width
  {
    target: 'shoulder_width',
    gender: 'female',
    condition: (values) => {
      return 'stomach_weight' in values && typeof values.stomach_weight === 'number' && !isNaN(values.stomach_weight);
    },
    outcome: (values) => {
      const stomachWeight = values.stomach_weight;
      const shoulderWidth = values.shoulder_width ?? 0.5;
      
      // If stomach_weight > 0.4 and shoulder_width <= 0.375, adjust shoulder_width up
      if (stomachWeight > 0.4 && shoulderWidth <= 0.375) {
        // Suggest moving shoulder_width to next step
        const steps = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1.0];
        const currentIdx = steps.findIndex(s => s >= shoulderWidth);
        if (currentIdx < steps.length - 1) {
          return { shoulder_width: steps[currentIdx + 1] };
        }
      }

      return {};
    },
    description: "Inverse: Suggest shoulder width adjustment when stomach weight exceeds narrow shoulder limit"
  },

  // 4B. INVERSE ARM SIZE → SHOULDER WIDTH
  // When arm_size changes dramatically, adjust shoulder_width
  {
    target: 'shoulder_width',
    gender: 'female',
    condition: (values) => {
      return 'arm_size' in values && typeof values.arm_size === 'number' && !isNaN(values.arm_size);
    },
    outcome: (values) => {
      const armSize = values.arm_size;
      const shoulderWidth = values.shoulder_width ?? 0.5;

      // If arm_size is very high (> 0.6) but shoulder_width is low (< 0.5), suggest increasing shoulder_width
      if (armSize > 0.6 && shoulderWidth < 0.5) {
        return { shoulder_width: Math.min(0.75, shoulderWidth + 0.125) };
      }
      // If arm_size is very low (< 0.2) but shoulder_width is high (> 0.75), suggest decreasing shoulder_width
      if (armSize < 0.2 && shoulderWidth > 0.75) {
        return { shoulder_width: Math.max(0.25, shoulderWidth - 0.125) };
      }

      return {};
    },
    description: "Inverse: Suggest shoulder width adjustment when arm size is inconsistent"
  },

  // 3B. INVERSE STOMACH WEIGHT → SHOULDER WIDTH  
  // When stomach_weight would exceed narrow shoulder constraint, suggest widening shoulders
  {
    target: 'shoulder_width',
    gender: 'female',
    condition: (values) => {
      return 'stomach_weight' in values && 'shoulder_width' in values &&
             typeof values.stomach_weight === 'number' && typeof values.shoulder_width === 'number';
    },
    outcome: (values) => {
      const stomachWeight = values.stomach_weight;
      const shoulderWidth = values.shoulder_width ?? 0.5;

      // If stomach_weight > 0.4 and shoulder_width is narrow, suggest widening
      if (stomachWeight > 0.4 && shoulderWidth <= 0.375) {
        console.log(`🔄 [Inverse Rule 3B] Stomach weight exceeds narrow shoulder limit, suggesting wider shoulders`);
        return { shoulder_width: Math.min(0.5, shoulderWidth + 0.125) };
      }

      return {};
    },
    description: "Inverse: Suggest shoulder width adjustment when stomach weight exceeds narrow shoulder limit"
  },

  // 5B. INVERSE LEG SIZE → SHOULDER WIDTH
  // When leg_size changes, adjust shoulder_width for consistency
  {
    target: 'shoulder_width',
    gender: 'female',
    condition: (values) => {
      return 'leg_size' in values && typeof values.leg_size === 'number' && !isNaN(values.leg_size);
    },
    outcome: (values) => {
      const legSize = values.leg_size;
      const shoulderWidth = values.shoulder_width ?? 0.5;

      // If leg_size > 0.8 but shoulder_width <= 0.25, suggest increasing shoulder_width
      if (legSize > 0.8 && shoulderWidth <= 0.25) {
        return { shoulder_width: Math.min(0.5, shoulderWidth + 0.25) };
      }
      // If leg_size < 0.2 but shoulder_width >= 0.5, suggest decreasing shoulder_width
      if (legSize < 0.2 && shoulderWidth >= 0.5) {
        return { shoulder_width: Math.max(0.25, shoulderWidth - 0.25) };
      }

      return {};
    },
    description: "Inverse: Suggest shoulder width adjustment when leg size is inconsistent"
  },
];

export function applyReconciliationRules(
  values: Record<string, number>, 
  gender: 'male' | 'female' = 'female',
  touchedKey?: string // The shape key that was directly touched by the user
): Record<string, number> {
  let result: Record<string, number> = { ...values };
  const allAppliedRules: string[] = [];
  let iterationCount = 0;
  const maxIterations = 5; // Prevent infinite loops

  console.log(`🔍 [applyReconciliationRules] Starting with ${gender} gender (touched: ${touchedKey || 'none'}):`, {
    gender,
    touchedKey,
    inputKeys: Object.keys(values),
    inputValues: values
  });

  // Keep applying rules until values stabilize (no changes in an iteration)
  while (iterationCount < maxIterations) {
    iterationCount++;
    let previousResult = { ...result };
    const iterationAppliedRules: string[] = [];
    
    for (const rule of RECONCILIATION_RULES) {
      // Skip rules that don't apply to the current gender
      if (rule.gender !== 'all' && rule.gender !== gender) {
        continue;
      }
      
      // Skip inverse rules if they target the touched key (user should have full control)
      if (touchedKey && rule.description?.includes('Inverse:') && rule.target === touchedKey) {
        console.log(`⏭️ [applyReconciliationRules] Skipping inverse rule for touched key: ${touchedKey}`);
        continue;
      }
      
      if (typeof rule.condition === 'function' && rule.condition(result)) {
        if (rule.description && !iterationAppliedRules.includes(rule.description)) {
          iterationAppliedRules.push(rule.description);
        }
        const outcome = typeof rule.outcome === 'function' ? rule.outcome(result) : rule.outcome;
        if (typeof outcome === 'string') {
          // Parse string outcome like "max_arm_size = 0.5" or "min_arm_size = 0.25 && max_arm_size = 0.75"
          const assignments = outcome.split('&&').map(s => s.trim());
          for (const assignment of assignments) {
            const parts = assignment.split('=');
            if (parts.length === 2) {
              const targetExpression = parts[0].trim();
              const value = parseFloat(parts[1].trim());
              
              // Extract key from expressions like "min_key" or "max_key"
              const targetKey = targetExpression.replace(/^(min_|max_)/, '');
              
              if (targetExpression.startsWith('min_')) {
                result[targetKey] = Math.max(value, result[targetKey] || 0);
              } else if (targetExpression.startsWith('max_')) {
                result[targetKey] = Math.min(value, result[targetKey] || 1);
              } else {
                result[targetKey] = value;
              }
            }
          }
        } else if (typeof outcome === 'object') {
          // Filter out any undefined values from the outcome
          const filteredOutcome: Record<string, number> = {};
          Object.entries(outcome).forEach(([key, value]) => {
            if (value !== undefined) {
              filteredOutcome[key] = value;
            }
          });
          result = { ...result, ...filteredOutcome };
        }
      }
    }

    // Check if values changed in this iteration
    const valuesChanged = JSON.stringify(result) !== JSON.stringify(previousResult);
    if (!valuesChanged) {
      console.log(`✅ [applyReconciliationRules] Converged after ${iterationCount} iteration(s) for ${gender}`);
      break;
    }

    if (iterationAppliedRules.length > 0) {
      allAppliedRules.push(...iterationAppliedRules);
    }
  }

  // Log all applied rules and final result
  if (allAppliedRules.length > 0 || JSON.stringify(result) !== JSON.stringify(values)) {
    console.log(`✅ [applyReconciliationRules] Applied ${allAppliedRules.length} unique rules over ${iterationCount} iteration(s):`, {
      appliedRules: [...new Set(allAppliedRules)], // Deduplicate
      changed: JSON.stringify(result) !== JSON.stringify(values),
      changes: Object.entries(result).reduce((acc, [k, v]) => {
        if (values[k] !== v) acc[k] = { from: values[k], to: v };
        return acc;
      }, {} as Record<string, any>)
    });
  }
  
  return result;
}
