"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { User, ArrowLeftRight, ArrowRight, Eye, EyeOff, Zap, RefreshCw, ChevronDown } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { TickSlider } from "@/components/tick-slider"
import { createGenderConfig, type GenderConfig, type ShapeKeyConfig } from "@/lib/data/body-groups"
import { modelLoader } from "@/lib/modelLoader"
import AnalyzingScreen from "@/components/analyzing-screen"
import {
  applyShape,
  updateShoulderWidthMorphs,
  updateStomachShapeMorphs,
  updateStomachWidthMorphs,
  getAllShapeKeyValues,
} from "@/lib/utils/bodyMorphs"
import { calculateTrapezoid } from "@/lib/utils/calculateTrapezoid"
import { generateAlphanumericCode, type ShapeKeys } from "@/lib/utils/bodyCodeGenerator"
import { applyFemaleSkinny } from "@/lib/utils/femaleSkinny"
import { formatLabel } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

interface BodyViewerUpdateProps {
  userResponses: {
    name: string
    age_range: string
    bodyType?: string
    gender: "male" | "female"
    shape_keys?: Record<string, number>
    slider_values?: Record<string, number>
  }
  onComplete: (data: {
    shape: string
    shape_keys: string
    slider_values: Record<string, number>
    alphanumeric_code: string
  }) => void
  onChange?: () => void
}

interface MeasurementsState {
  [key: string]: number
}

export default function BodyViewerUpdate({ userResponses, onComplete, onChange }: BodyViewerUpdateProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const sceneRef = useRef<{ scene?: any; model?: any }>({})
  const isMobile = useIsMobile()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [trimesterEnabled, setTrimesterEnabled] = useState(false)
  const [THREE, setTHREE] = useState<any>(null)
  // Generate unique ID for the rotation button to avoid conflicts
  const uniqueId = `bodyRearBtn-${Math.random().toString(36).substr(2, 9)}`;
  
  const genderConfig: GenderConfig = createGenderConfig(userResponses.gender)
  const [alphaCode, setAlphaCode] = useState<string>("")
  const [shapeKeysState, setShapeKeysState] = useState<ShapeKeys>({} as ShapeKeys)
  // Use slider_values from userResponses as initial values, fallback to default if not provided
  const [measurements, setMeasurements] = useState<MeasurementsState>(() => {
    const defaults = createDefaultValues(genderConfig)
    if (userResponses.slider_values) {
      // Merge the defaults with the provided slider values
      return { ...defaults, ...userResponses.slider_values }
    }
    return defaults
  })
  
  // Store previous slider values to prevent infinite loops
  const prevSliderValuesRef = useRef<string>("")
  
  // NEW: Store initial shape keys for reset
  const initialShapeKeysRef = useRef<ShapeKeys>({} as ShapeKeys)

  // Apply shape keys to model
  const updateModelWithShapeKeys = (keys: Record<string, number>) => {
    if (!sceneRef.current.scene || !THREE) return
    
    sceneRef.current.scene.traverse((child: any) => {
      if (!(child instanceof THREE.Mesh)) return
      if (!child.morphTargetDictionary || !child.morphTargetInfluences) return
      
      Object.entries(keys).forEach(([key, value]) => {
        const index = child.morphTargetDictionary[key]
        if (index !== undefined) {
          child.morphTargetInfluences[index] = value
        }
      })
    })
    console.log("Shape keys applied:", keys)
  }
  
  useEffect(() => {
    const loadThree = async () => {
      try {
        const threeModule = await import("three")
        setTHREE(threeModule)
      } catch (error) {
        console.error("Failed to load Three.js:", error)
      }
    }
    loadThree()
  }, [])



  useEffect(() => {
    if (!canvasRef.current || !THREE) return

    let modelPath = "/models/female_average.glb"
    if (userResponses.gender === "male") modelPath = "/models/male_average.glb"
    if (userResponses.bodyType === "bust") modelPath = "/models/female_bust.glb"
    else if (userResponses.bodyType === "slim")
      modelPath = userResponses.gender === "male" ? "/models/male_slim.glb" : "/models/female_slim.glb"
    else if (userResponses.bodyType === "athletic")
      modelPath = userResponses.gender === "male" ? "/models/male_athletic.glb" : "/models/female_athletic.glb"

    const { dispose, loadPromise, scene, model } = modelLoader(canvasRef.current, modelPath, 1.0, uniqueId)
    sceneRef.current.scene = scene
    sceneRef.current.model = model
    
    // Store reference to model for rotation
    if (scene && model) {
      (scene as any).modelReference = model;
    }

    setIsAnalyzing(true)
    if (loadPromise) loadPromise.finally(() => setIsAnalyzing(false))
    if (loadPromise)
      loadPromise.finally(() => {
        scene.traverse((child: any) => {
          if (!(child instanceof THREE.Mesh)) return
          if (!child.morphTargetDictionary || !child.morphTargetInfluences) return
          const defaults = getAllShapeKeyValues(child)
          
          // If shape_keys are provided in userResponses, use them to initialize the model
          if (userResponses.shape_keys) {
            Object.entries(userResponses.shape_keys).forEach(([key, value]) => {
              const index = child.morphTargetDictionary[key]
              if (index !== undefined) {
                child.morphTargetInfluences[index] = value
              }
            })
            // Update the defaults with provided shape_keys
            Object.assign(defaults, userResponses.shape_keys)
          }
          
          console.log("Initial shape keys:", defaults)
          // NEW: Store initial shape keys for reset
          initialShapeKeysRef.current = defaults
          setShapeKeysState(defaults)
          const code = generateAlphanumericCode(defaults, "average")
          setAlphaCode(code)
        })
        
        // Apply shape keys once model is loaded, similar to shape summary page
        if (userResponses.shape_keys) {
          updateModelWithShapeKeys(userResponses.shape_keys)
        }
      })
    else setTimeout(() => setIsAnalyzing(false), 10000)

    return () => dispose?.()
  }, [isMobile, userResponses.gender, userResponses.bodyType, THREE]) // Remove userResponses.shape_keys from dependencies

  // Update when shapeKeysState changes, similar to shape summary page

  // Effect to update measurements when slider_values change
  useEffect(() => {
    if (userResponses.slider_values) {
      const currentSliderValues = JSON.stringify(userResponses.slider_values)
      // Only update if slider values have actually changed
      if (prevSliderValuesRef.current !== currentSliderValues) {
        prevSliderValuesRef.current = currentSliderValues
        const defaults = createDefaultValues(genderConfig)
        setMeasurements(prev => ({
          ...defaults,
          ...userResponses.slider_values
        }))
      }
    }
  }, [userResponses.slider_values, genderConfig])

  // Update model when measurements change
  useEffect(() => {
    if (!sceneRef.current.model || !THREE) return

    sceneRef.current.model.traverse((child: any) => {
      if (!(child instanceof THREE.Mesh)) return
      if (!child.morphTargetDictionary || !child.morphTargetInfluences) return
      applyFemaleSkinny({
        mesh: child,
        measurements,
        dict: child.morphTargetDictionary,
        debug: true,
      })
    })
  }, [measurements, userResponses.gender, userResponses.bodyType, THREE])

  // Handle rotation button click
  const handleRotateView = () => {
    if (!sceneRef.current.scene || !THREE) {
      console.log("Model or THREE not available");
      return;
    }
    
    const scene = sceneRef.current.scene;
    const model = (scene as any).modelReference || sceneRef.current.model;
    
    if (model) {
      const angles = [0, Math.PI, Math.PI / 2, -Math.PI / 2]; // Front, Back, Right Side, Left Side
      let currentIndex = angles.indexOf(model.rotation.y);
      
      // If current angle is not in our list, start from beginning
      if (currentIndex === -1) {
        currentIndex = 0;
      } else {
        currentIndex = (currentIndex + 1) % angles.length;
      }
      
      model.rotation.y = angles[currentIndex];
      console.log("Rotating to angle:", angles[currentIndex]);
    } else {
      console.log("Model reference not found");
    }
  };

  function createDefaultValues(config: GenderConfig): Record<string, number> {
    const defaults: Record<string, number> = {}
    Object.values(config).forEach((group) => {
      Object.keys(group.measurements).forEach((name) => {
        defaults[name] = 0
      })
    })
    return defaults
  }

  // NEW: Reset function to restore default state
  const handleReset = (groupKey?: string) => {
    if (!THREE || !sceneRef.current.scene) return

    // Reset measurements (either for a specific group or all)
    // Use API data if available, otherwise use defaults
    setMeasurements((prev) => {
      // If we have slider_values from the API, use them as the reset values
      if (userResponses.slider_values) {
        // If resetting a specific group, only reset that group's values
        if (groupKey && genderConfig[groupKey as keyof GenderConfig]) {
          const groupMeasurements = Object.keys(genderConfig[groupKey as keyof GenderConfig].measurements);
          const resetValues: Record<string, number> = {};
          groupMeasurements.forEach(key => {
            // Use API value if available, otherwise use 0
            resetValues[key] = userResponses.slider_values && userResponses.slider_values[key] !== undefined 
              ? userResponses.slider_values[key] 
              : 0;
          });
          return { ...prev, ...resetValues };
        } else {
          // Reset all to API values
          const defaults = createDefaultValues(genderConfig);
          return { ...defaults, ...userResponses.slider_values };
        }
      } else {
        // Fallback to original behavior if no API data
        const newMeasurements = groupKey && genderConfig[groupKey as keyof GenderConfig]
          ? { ...prev, ...Object.keys(genderConfig[groupKey as keyof GenderConfig].measurements).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}) }
          : createDefaultValues(genderConfig)
        return newMeasurements
      }
    })

    // Reset trimester if applicable
    if (!groupKey || groupKey === "stomach") {
      setTrimesterEnabled(false)
    }

    // Reset model morph targets and shape keys
    sceneRef.current.scene.traverse((child: any) => {
      if (!(child instanceof THREE.Mesh)) return
      if (!child.morphTargetDictionary || !child.morphTargetInfluences) return

      // Reset all morph targets to 0
      Object.values(child.morphTargetDictionary).forEach((index) => {
        child.morphTargetInfluences[index as number] = 0
      })

      // Reapply initial shape keys
      const initialKeys = initialShapeKeysRef.current
      Object.entries(initialKeys).forEach(([key, value]) => {
        const index = child.morphTargetDictionary[key]
        if (index !== undefined) {
          child.morphTargetInfluences[index] = value
        }
      })

      // Update shape keys state
      const updatedShapeKeys = getAllShapeKeyValues(child)
      setShapeKeysState(updatedShapeKeys)
    })

    // Regenerate alphanumeric code
    const code = generateAlphanumericCode(initialShapeKeysRef.current, "average")
    setAlphaCode(code)

    onChange?.()
  }

  const shapeKeyHandlers: Record<
    string,
    (mesh: any, index: number, value: number, dict: Record<string, number>) => void
  > = {
    headShape: (mesh, _index, value, dict) => {
      if (!mesh.morphTargetInfluences) return
      const shapes = ["shape_head_oblong", "shape_head_round", "shape_head_coned"]
      applyShape(mesh, dict, value, shapes)
    },
    neckShape: (mesh, _index, value, dict) => {
      if (!mesh.morphTargetInfluences) return
      const idx = dict["neck_shape"]
      if (idx === undefined) return
      const stomachWidthValue = measurements.stomachSize || 0
      mesh.morphTargetInfluences[idx] = value === 0 ? 0 : stomachWidthValue
    },
    shoulderWidth: (mesh, _index, value, dict) => {
      if (!mesh.morphTargetInfluences) return
      updateShoulderWidthMorphs({ mesh, value, measurements, dict, debug: true })
      const trapezoidIdx = dict["trapezoid"]
      if (trapezoidIdx !== undefined) {
        const shoulderHeight = measurements.shoulderHeight || 0
        const neckWidth = measurements.neckWidth || 0
        mesh.morphTargetInfluences[trapezoidIdx] = calculateTrapezoid(value, shoulderHeight, neckWidth)
      }
    },
    stomachShape: (mesh, _index, value, dict) => {
      if (!mesh.morphTargetInfluences) return
      const stomachWidthValue = measurements.stomachSize || 0
      updateStomachShapeMorphs({ mesh, stomachShape: value, stomachWidthValue, dict, debug: true, setTrimesterEnabled })
    },
    stomachSize: (mesh, _index, value, dict) => {
      if (!mesh.morphTargetInfluences) return
      updateStomachWidthMorphs({
        mesh,
        stomachShape: measurements.stomachShape || 0,
        stomachWidthValue: value,
        neckShapeValue: measurements.neckShape || 0,
        dict,
        debug: true,
      })
      const trapezoidIdx = dict["trapezoid"]
      if (trapezoidIdx !== undefined) {
        const shoulderHeight = measurements.shoulderHeight || 0
        const neckWidth = measurements.neckWidth || 0
        mesh.morphTargetInfluences[trapezoidIdx] = calculateTrapezoid(
          measurements.shoulderWidth || 0,
          shoulderHeight,
          neckWidth
        )
      }
    },
    bottomShape: (mesh, _index, value, dict) => {
      if (!mesh.morphTargetInfluences) return
      const shapes = [
        "bottom_shape_round",
        "bottom_shape_square",
        "bottom_shape_inverted",
        "bottom_shape_flat",
        "bottom_shape_heart",
      ]
      applyShape(mesh, dict, value, shapes)
    },
  }

  const handleMeasurementChange = (key: string, value: number) => {
    if (!THREE) return

    onChange?.()

    setMeasurements((prev) => {
      const newState = { ...prev, [key]: value }
      if (key === "stomachSize") newState.shoulderWidth = value
      if (key === "shoulderWidth") newState.stomachSize = value
      return newState
    })

    if (!sceneRef.current?.scene) return

    sceneRef.current.scene.traverse((child: any) => {
      if (!(child instanceof THREE.Mesh)) return
      const mesh = child
      const dict = mesh.morphTargetDictionary
      if (!dict || !mesh.morphTargetInfluences) return

      const measurement: ShapeKeyConfig | undefined = Object.values(genderConfig)
        .flatMap((group) => Object.entries(group.measurements))
        .find(([mKey]) => mKey === key)?.[1]

      if (!measurement) return

      if (shapeKeyHandlers[key]) {
        shapeKeyHandlers[key](mesh, -1, value, dict)
      } else {
        measurement.keys.forEach((morphKey) => {
          const index = dict[morphKey]
          if (index !== undefined && mesh.morphTargetInfluences) {
            mesh.morphTargetInfluences[index] = value
          }
        })
      }

      const updatedShapeKeys = getAllShapeKeyValues(mesh)
      console.log("Updated shape keys:", updatedShapeKeys)
      setShapeKeysState((prev) => ({ ...prev, ...updatedShapeKeys }))
    })

    const code = generateAlphanumericCode(shapeKeysState, "average")
    setAlphaCode(code)
  }

  const handleContinue = async () => {
    const payload = {
      shape: userResponses.bodyType || "average",
      shape_keys: JSON.stringify(shapeKeysState), // Convert object to string
      slider_values: measurements,
      alphanumeric_code: alphaCode,
    }
    
    // Enhanced debugging information
    console.log("=== HANDLE CONTINUE DEBUG INFO ===")
    console.log("Shape:", payload.shape)
    console.log("Alphanumeric Code:", payload.alphanumeric_code)
    
    console.log("Shape Keys:", payload.shape_keys)
    
    console.log("Slider Values:")
    Object.entries(payload.slider_values).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`)
    })
    
    console.log("Full Payload:", payload)
    console.log("###################")
    
    try {
      const response = await fetch('/api/body-data', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      // Log response details for debugging
      console.log("Response status:", response.status);
      console.log("Response headers:", [...response.headers.entries()]);
      
      // Get response text first for debugging
      const responseText = await response.text();
      console.log("Raw response text:", responseText);
      
      // If response is empty
      if (!responseText) {
        if (response.ok) {
          toast({
            title: "Success!",
            description: "Body data updated successfully.",
          });
          onComplete(payload);
        } else {
          toast({
            title: "Error",
            description: `Server error: ${response.status} ${response.statusText}`,
            variant: "destructive",
          });
        }
        return;
      }
      
      // Try to parse JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        toast({
          title: "Error",
          description: "Invalid response from server. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Parsed response:", result);
      
      if (response.ok && result.success) {
        toast({
          title: "Success!",
          description: result.message || "Body data updated successfully.",
        });
        onComplete(payload);
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update body data.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating body data:", error);
      toast({
        title: "Error",
        description: "Failed to update body data. Please try again.",
        variant: "destructive",
      });
    }
  }

  if (!THREE) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading 3D Engine...</p>
        </div>
      </div>
    )
  }

  if (isMobile) {
    const viewerHeight = "42vh"
    const controlsHeight = "calc(100vh - 6rem - 42vh - 160px)"

    return (
      <div className="flex flex-col h-screen bg-gray-50">
        {isAnalyzing && <AnalyzingScreen />}
        <div className="relative bg-gradient-to-b from-gray-100 to-gray-200" style={{ height: viewerHeight }}>
          <canvas ref={canvasRef} className="w-full h-full block" id="renderCanvas" style={{ touchAction: "none" }} />
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-white/90 text-gray-800">
              Body Type
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Button size="sm" variant="secondary" className="h-8 px-2 bg-white/90 text-gray-900 hover:bg-white">
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white border-t border-gray-200 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ height: controlsHeight }}>
            {Object.entries(genderConfig).map(([key, group]) => (
              <Collapsible key={key}>
                <CollapsibleTrigger asChild>
                  <div className="p-3 rounded-lg flex items-center justify-between cursor-pointer transition-colors bg-gray-50 hover:bg-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{group.icon}</span>
                      <span className="font-medium text-gray-900">{group.label}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <div className="p-3 rounded-lg bg-white border border-gray-200 space-y-4">
                    {/* NEW: Add reset button for mobile group */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs bg-transparent"
                      onClick={() => handleReset(key)}
                    >
                      <RefreshCw className="w-3 h-3 mr-1" /> Reset {group.label}
                    </Button>
                    {Object.entries(group.measurements).map(([mKey, config]) => (
                      <div key={mKey} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium text-gray-700 capitalize" htmlFor={`slider-${mKey}`}>
                            {formatLabel(mKey)}
                          </label>
                          <Badge variant="outline" className="text-xs bg-red-50 text-red-600 border-red-200">
                            {measurements[mKey] ?? "--"}
                          </Badge>
                        </div>
                        <TickSlider
                          id={`slider-${mKey}`}
                          label={mKey}
                          value={measurements[mKey] !== undefined ? measurements[mKey] : (config.min ?? 0)}
                          min={config.min ?? 0}
                          max={config.max ?? 1}
                          step={config.step ?? 0.5}
                          ticks={config.ticks ?? 2}
                          onChange={(val: number) => handleMeasurementChange(mKey, val)}
                          name={mKey}
                          disabled={mKey === "Trimester" ? !trimesterEnabled : false}
                        />
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>

          <div className="sticky bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-200 flex-shrink-0 shadow-lg z-50 mb-10">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                id={uniqueId}
                className="flex-1 h-12 bg-transparent border-red-200 text-red-600 hover:bg-red-50"
                title="Rotate view"
                onClick={handleRotateView}
              >
                <ArrowLeftRight className="w-4 h-4 mr-2" /> Body Rear
              </Button>
              <Button
                onClick={handleContinue}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 h-12 text-white font-medium"
              >
                <ArrowRight className="w-4 h-4 mr-2" /> Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-gray-50">
      {isAnalyzing && <AnalyzingScreen />}
      <div className="flex h-full">
        {/* LEFT PANEL (Controls) */}
        <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col ">
         

          <div className="p-3 bg-gray-50 border-b border-gray-200 flex-shrink-0 leading-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{userResponses.name}</h3>
                </div>
              </div>
              {/* <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-2 h-8 text-xs border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
              >
                <Zap className="w-3 h-3" /> Presets <ChevronDown className="w-3 h-3" />
              </Button> */}
            </div>
          </div>

          <div className="flex-1 min-h-0 flex flex-col">
            <Tabs defaultValue="head" className="h-full flex flex-col leading-3">
              <TabsList className="grid w-full grid-cols-6  mb-1 h-12 gap-1 flex-shrink-0">
                {Object.entries(genderConfig).map(([key, group]) => (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="flex flex-col items-center gap-1 py-1 px-1 text-xs border-0 font-medium min-h-[44px] bg-gray-50 data-[state=active]:bg-red-100"
                  >
                    <span className="text-sm">{group.icon}</span>
                    <span className="text-[10px] leading-tight">{group.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pb-20">
                {Object.entries(genderConfig).map(([groupKey, group]) => (
                  <TabsContent key={groupKey} value={groupKey} className="p-3 space-y-4 m-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{group.icon}</span>
                        <h3 className="font-semibold text-gray-900">{group.label} Controls</h3>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs bg-transparent"
                        onClick={() => handleReset(groupKey)} // MODIFIED: Attach reset handler
                      >
                        <RefreshCw className="w-3 h-3 mr-1" /> Reset
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {Object.entries(group.measurements).map(([mKey, config]) => (
                        <div key={mKey} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-700 capitalize" htmlFor={`slider-${mKey}`}>
                              {formatLabel(mKey)}
                            </label>
                            {/* <Badge variant="outline" className="text-xs bg-red-50 text-red-600 border-red-200">
                              {measurements[mKey] ?? "--"}
                            </Badge> */}
                          </div>
                          <TickSlider
                            id={`slider-${mKey}`}
                            label={mKey}
                            value={measurements[mKey] ?? config.min ?? 0}
                            min={config.min ?? 0}
                            max={config.max ?? 1}
                            step={config.step ?? 0.5}
                            ticks={config.ticks ?? 2}
                            onChange={(val: number) => handleMeasurementChange(mKey, val)}
                            name={mKey}
                            disabled={mKey === "Trimester" ? !trimesterEnabled : false}
                          />
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </div>

          <div className="border-t border-gray-200 bg-white flex-shrink-0 shadow-lg p-3">
            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-12 bg-transparent border-red-200 text-red-600 hover:bg-red-50"
                id={uniqueId}
                title="Rotate view"
                onClick={handleRotateView}
              >
                <ArrowLeftRight className="w-4 h-4 mr-2" /> Body Rear
              </Button>
              <Button
                onClick={handleContinue}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 h-12 text-white font-medium"
              >
                <ArrowRight className="w-4 h-4 mr-2" /> Continue
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL (Viewer) */}
        <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center h-full">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full mx-4">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Your Body Model</h2>
              <Badge variant="secondary" className="bg-gradient-to-r from-red-100 to-red-100 text-red-600">
                Body Shape
              </Badge>
            </div>

            <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-200">
              <canvas ref={canvasRef} className="w-full h-auto max-w-sm mx-auto" style={{ minHeight: "500px" }} />
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 mb-3">
                Adjust the measurements on the left to construct your body model.
              </p>
              <div className="flex justify-center space-x-2">
                {/* <Button
                  size="sm"
                  variant="outline"
                  className="h-8 border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                >
                  <Zap className="w-3 h-3 mr-1" /> Presets
                </Button> */}
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 bg-transparent border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => handleReset()} // MODIFIED: Attach reset handler for global reset
                >
                  <RefreshCw className="w-3 h-3 mr-1" /> AI Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}