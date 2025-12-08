"use client"

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react"
import { modelLoader } from "@/lib/utils/model-loader"
import { useShapeKeys } from "@/hooks/use-shape-keys"
import { createGenderConfig } from "@/lib/body-groups"
import AnalyzingScreen from "@/components/analyzing-screen"

// Pre-defined view angles in radians
const VIEWS = {
  front: 0,
  leftSide: Math.PI / 2,  // 90 degrees
  back: Math.PI,          // 180 degrees
  rightSide: -Math.PI / 2 // -90 degrees
}

interface ModelViewerProps {
  modelPath?: string
  scale?: number
  className?: string
  shapeKeyValues?: Record<string, number>
  gender?: 'male' | 'female'
}

interface ModelViewerRef {
  setToFrontView: () => void;
  setToBackView: () => void;
  setToLeftSideView: () => void;
  setToRightSideView: () => void;
}

const ModelViewer = forwardRef<ModelViewerRef, ModelViewerProps>(({
  modelPath = "/models/male.glb", 
  scale = 1, 
  className, 
  shapeKeyValues = {},
  gender = 'female'
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [model, setModel] = useState<any>(null);
  // Track the current rotation angle to smoothly transition between views
  const [targetRotation, setTargetRotation] = useState(VIEWS.front);
  const currentRotation = useRef(VIEWS.front);
  const animationId = useRef<number | null>(null);

  useEffect(() => {
    // Force log to be visible
    console.log('🔄 [ModelViewer] Shape key values updated:', {
      step: 'Receiving new values',
      values: shapeKeyValues,
      gender,
      modelPath
    });
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { loadPromise, dispose } = modelLoader(canvas, modelPath, scale);

    loadPromise
      .then((model) => {
        setModel(model);
        // Initialize model facing front
        model.rotation.y = VIEWS.front;
        
        // Animation loop for smooth rotation
        const animate = () => {
          // Smoothly interpolate to target rotation
          const diff = targetRotation - currentRotation.current;
          if (Math.abs(diff) > 0.01) {
            // Ease towards target rotation
            currentRotation.current += diff * 0.1;
            model.rotation.y = currentRotation.current;
          }
          animationId.current = requestAnimationFrame(animate);
        };
        animationId.current = requestAnimationFrame(animate);
      })
      .catch((err) => {
        console.error("Model load error:", err);
      });

    return () => {
      if (animationId.current) cancelAnimationFrame(animationId.current);
      dispose();
      setModel(null);
    };
  }, [modelPath, scale, targetRotation]);

  // Apply shape key values to the model and debug
  console.debug('[ModelViewer] Applying shape keys:', {
    step: 'Passing to useShapeKeys',
    modelLoaded: !!model,
    shapeKeyValues,
    gender
  });
  
  // Normalize incoming shapeKeyValues so useShapeKeys always receives a measurement-keyed map
  // The incoming `shapeKeyValues` may be either measurement-keyed (camelCase) or shape-keyed (snake_case).
  // Build mapping from measurementKey -> primary shape key and prefer values in this order:
  // 1) exact measurement-keyed value from incoming (camelCase)
  // 2) shape-keyed value from incoming (snake_case primary key)
  // 3) fallback to default value from config
  const config = createGenderConfig(gender);
  const normalized: Record<string, number> = {};
  
  // Import the correct defaults based on gender
  const baseDefaults = gender === "female" ? 
    require("@/lib/base-model-defaults").FEMALE_BASE_MODEL_DEFAULTS :
    require("@/lib/base-model-defaults").MALE_BASE_MODEL_DEFAULTS;
  
  // Create a mapping from snake_case to camelCase for the keys
  const baseDefaultsCamelCase = Object.entries(baseDefaults).reduce((acc, [key, value]) => {
    const camelKey = key.replace(/_([a-z])/g, g => g[1].toUpperCase());
    acc[camelKey] = value as number;
    return acc;
  }, {} as Record<string, number>);
  
  // First initialize with default values from base defaults or config
  Object.values(config).forEach((group) => {
    Object.entries(group.measurements).forEach(([measurementKey, shapeConfig]) => {
      // Use the base defaults if available, otherwise fallback to config default or min
      normalized[measurementKey] = baseDefaultsCamelCase[measurementKey as keyof typeof baseDefaultsCamelCase] ?? shapeConfig.defaultValue ?? shapeConfig.min ?? 0;
    });
  });
  
  // Then override with provided values
  Object.values(config).forEach((group) => {
    Object.entries(group.measurements).forEach(([measurementKey, shapeConfig]) => {
      // Determine primary shape key for this measurement
      const primaryShapeKey = shapeConfig.keys?.[0] ?? measurementKey.replace(/([A-Z])/g, "_$1").toLowerCase();

      // Prefer camelCase measurement-keyed value if present
      if (shapeKeyValues && Object.prototype.hasOwnProperty.call(shapeKeyValues, measurementKey)) {
        const v = shapeKeyValues[measurementKey];
        normalized[measurementKey] = typeof v === 'number' && !isNaN(v) ? v : (shapeConfig.defaultValue ?? shapeConfig.min ?? 0);
        return;
      }

      // Otherwise check for shape-keyed value
      if (shapeKeyValues && Object.prototype.hasOwnProperty.call(shapeKeyValues, primaryShapeKey)) {
        const v = shapeKeyValues[primaryShapeKey];
        normalized[measurementKey] = typeof v === 'number' && !isNaN(v) ? v : (shapeConfig.defaultValue ?? shapeConfig.min ?? 0);
        return;
      }
    });
  });

  // Additionally, if callers provided a map of shape-keyed values (snake_case) that include
  // keys beyond primaryShapeKey, map any known snake_case keys to their measurementKey equivalents.
  const shapeToMeasurement: Record<string, string> = {};
  Object.values(config).forEach((group: any) => {
    Object.entries(group.measurements).forEach(([measurementKey, shapeConfig]: [string, any]) => {
      const primary = shapeConfig.keys?.[0] ?? measurementKey.replace(/([A-Z])/g, "_$1").toLowerCase();
      shapeToMeasurement[primary] = measurementKey;
      // Also map other keys listed for this measurement
      (shapeConfig.keys || []).forEach((k: string) => { shapeToMeasurement[k] = measurementKey; });
    });
  });

  Object.entries(shapeKeyValues || {}).forEach(([key, val]) => {
    if (key.includes('_') && key in shapeToMeasurement) {
      const mKey = shapeToMeasurement[key];
      normalized[mKey] = typeof val === 'number' && !isNaN(val) ? val : normalized[mKey];
    }
  });

  useShapeKeys(model, normalized, gender);

  console.log('📥 [ModelViewer] Normalized values passed to useShapeKeys:', {
    incomingShapeKeyValues: shapeKeyValues,
    normalizedForHook: normalized,
    gender,
    normalizedKeys: Object.keys(normalized),
    hasValues: Object.values(normalized).some(v => v !== 0)
  });

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    setToFrontView: () => {
      setTargetRotation(VIEWS.front);
    },
    setToBackView: () => {
      setTargetRotation(VIEWS.back);
    },
    setToLeftSideView: () => {
      setTargetRotation(VIEWS.leftSide);
    },
    setToRightSideView: () => {
      setTargetRotation(VIEWS.rightSide);
    }
  }));

  return (
    <div className="w-full h-full relative aspect-square bg-neutral-50">
      <canvas 
        ref={canvasRef} 
        className={`${className} absolute inset-0 w-full h-full`}
      />
      {!model && (
        <div className="absolute inset-0 w-full h-full">
          <AnalyzingScreen />
        </div>
      )}
    </div>
  );
});

ModelViewer.displayName = "ModelViewer";

export default ModelViewer;
export { VIEWS };
export type { ModelViewerRef };