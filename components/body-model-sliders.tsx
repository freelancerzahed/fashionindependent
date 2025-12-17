"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { TickSlider } from "@/components/tick-slider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { createGenderConfig } from "@/lib/body-groups"
import { applyReconciliationRules } from "@/lib/reconciliation-rules"
import type { BodyPartGroup, ShapeKeyConfig } from "@/lib/body-groups"


interface BodyModelSlidersProps {
  gender: "male" | "female"
  onSubmit: (values: Record<string, number>) => void
  onCancel: () => void
  initialValues?: Record<string, number>
  onChange?: (values: Record<string, number>) => void // called on every slider change
}


export function BodyModelSliders({ gender, onSubmit, onCancel, initialValues = {}, onChange }: BodyModelSlidersProps) {
  const config = useMemo(() => createGenderConfig(gender), [gender]);

  // Build mapping between measurement keys (camelCase used in UI) and shape keys (snake_case used in reconciliation)
  const measurementToShape = useMemo(() => {
    const map: Record<string, string> = {};
    Object.values(config).forEach((group) => {
      Object.entries(group.measurements).forEach(([measurementKey, cfg]) => {
        // Use the first key in the keys array if available, otherwise generate from measurementKey
        const shapeKey = (cfg as ShapeKeyConfig).keys?.[0] ?? measurementKey.replace(/([A-Z])/g, "_$1").toLowerCase();
        map[measurementKey] = shapeKey;
      });
    });
    return map;
  }, [config]);

  const shapeToMeasurement = useMemo(() => {
    const map: Record<string, string> = {};
    Object.entries(measurementToShape).forEach(([m, s]) => {
      // Handle special cases where the mapping might not be straightforward
      const shapeKey = s.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      map[s] = m;
    });
    return map;
  }, [measurementToShape]);
  
  // Import and process base defaults outside of useMemo to avoid circular dependencies
  const baseDefaults = useMemo(() => {
    // Get gender-specific defaults from the module
    const genderDefaults = gender === "female" ? 
      require("@/lib/base-model-defaults").FEMALE_BASE_MODEL_DEFAULTS :
      require("@/lib/base-model-defaults").MALE_BASE_MODEL_DEFAULTS;
    
    // Convert snake_case keys to camelCase and return as a Record
    return Object.entries(genderDefaults).reduce((acc, [key, value]) => {
      const camelKey = key.replace(/_([a-z])/g, g => g[1].toUpperCase());
      acc[camelKey] = value as number;
      return acc;
    }, {} as Record<string, number>);
  }, [gender]);

  // Create default values based on config and base defaults
  const defaultValues = useMemo(() => {
    const values: Record<string, number> = {};
    
    // Iterate through all measurement groups in the config
    Object.values(config).forEach((group) => {
      Object.entries(group.measurements).forEach(([measurementKey, cfg]) => {
        // Priority order for defaults:
        // 1. Base model defaults (from FEMALE/MALE_BASE_MODEL_DEFAULTS)
        // 2. Config-specified default value
        // 3. Config min value as last resort
        values[measurementKey] = 
          baseDefaults[measurementKey as keyof typeof baseDefaults] ?? 
          cfg.defaultValue ?? 
          cfg.min;
      });
    });
    
    return values;
  }, [config, baseDefaults]);

  // Initialize and manage values state
  const [values, setValues] = useState<Record<string, number>>(() => {
    // Values stored internally use measurement keys (camelCase)
    const initialRawValues = Object.keys(initialValues).length > 0 
      ? initialValues 
      : defaultValues;
    return initialRawValues;
  });
  
  // Initialize and manage reconciled values state
  const [reconciledValues, setReconciledValues] = useState<Record<string, number>>(() => {
    const initialRawValues = Object.keys(initialValues).length > 0 
      ? initialValues 
      : defaultValues;
    // Convert measurement-keyed initial values into shape-keyed values for reconciliation
    const initialShapeValues: Record<string, number> = {};
    Object.entries(initialRawValues).forEach(([mKey, val]) => {
      const sKey = measurementToShape[mKey] ?? mKey.replace(/([A-Z])/g, "_$1").toLowerCase();
      initialShapeValues[sKey] = val as number;
    });
    const reconciledShape = applyReconciliationRules(initialShapeValues, gender);
    // Map reconciled shape keys back to measurement keys
    const reconciledMeasurement: Record<string, number> = {};
    Object.entries(reconciledShape).forEach(([sKey, val]) => {
      const mKey = shapeToMeasurement[sKey] ?? sKey.replace(/_([a-z])/g, g => g[1].toUpperCase());
      reconciledMeasurement[mKey] = val;
    });
    return reconciledMeasurement;
  });

  // Handle gender changes and initial setup
  useEffect(() => {
    // Only reset values if there are no initial values provided
    if (Object.keys(initialValues).length === 0) {
      setValues(defaultValues);
      
      // Convert default measurement-keyed values to shape-keyed for reconciliation
      const shapeDefaults: Record<string, number> = {};
      Object.entries(defaultValues).forEach(([mKey, val]) => {
        const sKey = measurementToShape[mKey] ?? mKey.replace(/([A-Z])/g, "_$1").toLowerCase();
        shapeDefaults[sKey] = val as number;
      });
      
      const reconciledShape = applyReconciliationRules(shapeDefaults, gender);
      
      // Map reconciled shape keys back to measurement keys
      const reconciled: Record<string, number> = {};
      Object.entries(reconciledShape).forEach(([sKey, val]) => {
        const mKey = shapeToMeasurement[sKey] ?? sKey.replace(/_([a-z])/g, g => g[1].toUpperCase());
        reconciled[mKey] = val;
      });
      
      setReconciledValues(reconciled);
      
      if (onChange) {
        // Convert reconciled measurement-keyed values to shape-keyed (snake_case) before notifying parent
        const shapeReconciled: Record<string, number> = {};
        Object.entries(reconciled).forEach(([mKey, val]) => {
          const sKey = measurementToShape[mKey] ?? mKey.replace(/([A-Z])/g, "_$1").toLowerCase();
          shapeReconciled[sKey] = val;
        });
        onChange(shapeReconciled);
      }
    }
  }, []); // Only run once on mount

  // Notify parent of initial values when component mounts
  useEffect(() => {
    // Only notify if there are no initial values provided
    if (Object.keys(initialValues).length === 0) {
      // Convert measurement-keyed values to shape-keyed for parent
      const shapeValues: Record<string, number> = {};
      Object.entries(defaultValues).forEach(([mKey, val]) => {
        const sKey = measurementToShape[mKey] ?? mKey.replace(/([A-Z])/g, "_$1").toLowerCase();
        shapeValues[sKey] = val as number;
      });
      
      if (onChange) {
        onChange(shapeValues);
      }
    }
  }, []); // Run only once on mount

  // Reconciliation is now applied directly in handleSliderChange for immediate UI updates

  const handleSliderChange = (key: string, value: number) => {
    // Copy previous values and apply current slider change
    const newValues = { ...values, [key]: value };
    
    // Apply reconciliation rules, passing the touched key so inverse rules skip it
    // IMPORTANT: Convert ALL measurement keys to shape keys, not just changed ones
    const shapeValues: Record<string, number> = {};
    Object.entries(newValues).forEach(([mKey, val]) => {
      const sKey = measurementToShape[mKey] ?? mKey.replace(/([A-Z])/g, "_$1").toLowerCase();
      shapeValues[sKey] = val as number;
    });
    
    console.log('🔍 [handleSliderChange] Before reconciliation:', {
      changedKey: key,
      newValue: value,
      shapeKeysCount: Object.keys(shapeValues).length,
      shapeKeys: Object.keys(shapeValues)
    });
    
    // Convert touched key (measurement key) to shape key for reconciliation function
    const touchedShapeKey = measurementToShape[key] ?? key.replace(/([A-Z])/g, "_$1").toLowerCase();
    const reconciledShape = applyReconciliationRules(shapeValues, gender, touchedShapeKey);
    
    // Map reconciled shape keys back to measurement keys
    const reconciledMeasurement: Record<string, number> = {};
    Object.entries(reconciledShape).forEach(([sKey, val]) => {
      // Try to find the measurement key that corresponds to this shape key
      const mKey = shapeToMeasurement[sKey] || sKey.replace(/_([a-z])/g, g => g[1].toUpperCase());
      reconciledMeasurement[mKey] = val;
    });
    
    // Merge shape and measurement reconciled outputs with the raw inputs
    const mergedShape = { ...shapeValues, ...reconciledShape };
    const mergedMeasurement = { ...newValues, ...reconciledMeasurement };

    console.log('📥 [handleSliderChange] After reconciliation:', {
      reconciledMeasurementKeys: Object.keys(reconciledMeasurement),
      reconciledMeasurement,
      mergedMeasurementKeys: Object.keys(mergedMeasurement),
      changedKeys: Object.keys(mergedMeasurement).filter(k => mergedMeasurement[k] !== newValues[k])
    });

    // Update states with MERGED values (this makes UI sliders auto-update with reconciled values)
    setValues(mergedMeasurement);
    setReconciledValues(mergedMeasurement);
    
    if (onChange) {
      console.log('📤 [BodyModelSliders.handleSliderChange] Calling onChange with merged shape-keyed values:', {
        slider: key,
        sliderValue: value,
        mergedShape,
        mergedMeasurement
      });
      onChange(mergedShape);
    }
  };


  const handleSubmit = () => {
    // Submit the reconciled values to ensure proper proportions are saved
    onSubmit(reconciledValues)
  }

  const renderSliders = (measurements: Record<string, any>) => (
    <div className="space-y-6">
      {Object.entries(measurements).map(([measurementKey, config]) => (
        <div key={measurementKey}>
          <label className="text-sm font-medium mb-2 block">
            {measurementKey.replace(/([A-Z])/g, " $1").trim()}: {
              (() => {
                const val = values[measurementKey] ?? config.min ?? 0;
                const measurement = config as ShapeKeyConfig;

                if (measurement.classifications) {
                  // Find the classification based on value ranges (interpret using measurement.valueRanges)
                  if (measurement.valueRanges) {
                    const classification = Object.entries(measurement.valueRanges)
                      .find(([_, range]) => {
                        const typedRange = range as { min: number; max: number };
                        return val >= typedRange.min && val <= typedRange.max;
                      })?.[0];
                    return classification || val.toFixed(2);
                  }
                  // For enum types or simple classifications
                  const index = Math.round((val / (measurement.max - measurement.min)) * 
                    (measurement.classifications.length - 1));
                  return measurement.classifications[index] || val.toFixed(2);
                }
                return val.toFixed(2);
              })()
            }
          </label>
          <TickSlider
            id={`${measurementKey}-slider`}
            value={values[measurementKey] ?? config.min ?? 0}
            min={config.min}
            max={config.max}
            step={config.step}
            ticks={config.ticks}
            onChange={(value) => handleSliderChange(measurementKey, value)}
            name={measurementKey}
            label={measurementKey}
            displayValue={reconciledValues[measurementKey] ?? values[measurementKey] ?? config.min ?? 0}
          />
        </div>
      ))}
    </div>
  )

  const bodyPartGroups = Object.entries(config) as [string, BodyPartGroup][]

  

  return (
    <div className="space-y-6">
      {/* Desktop Tabs View */}
      <div className="hidden md:block">
        <Tabs defaultValue={bodyPartGroups[0][0]} className="w-full">
          <TabsList className="grid w-full grid-cols-6 gap-1 h-auto bg-transparent p-0">
            {bodyPartGroups.map(([key, group]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="flex flex-col items-center justify-center aspect-square p-2 rounded-lg border-2 border-neutral-200 data-[state=active]:border-primary data-[state=active]:bg-primary/10 hover:border-neutral-300 transition-all"
              >
                <span className="text-lg mb-1">{group.icon}</span>
                <span className="text-[10px] font-medium text-center leading-tight">{group.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {bodyPartGroups.map(([key, group]) => (
            <TabsContent key={key} value={key} className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{group.label}</h3>
                {renderSliders(group.measurements)}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Mobile Collapsible View */}
      <div className="md:hidden space-y-3">
        {bodyPartGroups.map(([key, group]) => (
          <Collapsible key={key} defaultOpen={key === bodyPartGroups[0][0]}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-lg">{group.icon}</span>
                <span className="font-medium">{group.label}</span>
              </div>
              <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 px-3 pb-3 space-y-4">
              {renderSliders(group.measurements)}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-6 border-t">
        <Button variant="outline" className="flex-1 bg-transparent" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  )
}