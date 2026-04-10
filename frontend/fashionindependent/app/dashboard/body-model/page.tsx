"use client"

import { useState, useRef } from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BodyModelSliders } from "@/components/body-model-sliders"
import ModelViewer, { VIEWS } from "@/components/model-viewer"
import { createGenderConfig } from "@/lib/body-groups"

export default function BodyModelPage() {
  const modelViewerRef = useRef<any>(null);
  const [currentView, setCurrentView] = useState('front');
  const [isEditMode, setIsEditMode] = useState(false)
  const [gender, setGender] = useState<"male" | "female">("female")
  const [bodyMeasurements, setBodyMeasurements] = useState<Record<string, number>>({
    height: 65,
    weight: 140,
    bustSize: 34,
    waistSize: 26,
    hipSize: 36,
  })

  // Create default shape values using base model defaults
  const getDefaultShapeValues = (gender: "male" | "female") => {
    const config = createGenderConfig(gender);
    
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
    
    const defaultShapeValues: Record<string, number> = {};
    Object.values(config).forEach((group) => {
      Object.entries(group.measurements).forEach(([key, cfg]) => {
        // Use the base defaults if available, otherwise fallback to config default or min
        defaultShapeValues[key] = baseDefaultsCamelCase[key as keyof typeof baseDefaultsCamelCase] ?? cfg.defaultValue ?? cfg.min;
      });
    });
    
    return defaultShapeValues;
  };

  const [shapeKeyValues, setShapeKeyValues] = useState<Record<string, number>>(() => 
    getDefaultShapeValues(gender)
  );

  // Handle gender changes
  const handleGenderChange = (newGender: "male" | "female") => {
    setGender(newGender);
    setShapeKeyValues(getDefaultShapeValues(newGender));
  };

  const handleUpdateClick = () => {
    setIsEditMode(true)
  }


  const setView = (view: string) => {
    if (!modelViewerRef.current) return;
    
    switch(view) {
      case 'front':
        modelViewerRef.current.setToFrontView();
        setCurrentView('front');
        break;
      case 'back':
        modelViewerRef.current.setToBackView();
        setCurrentView('back');
        break;
      case 'left':
        modelViewerRef.current.setToLeftSideView();
        setCurrentView('left');
        break;
      case 'right':
        modelViewerRef.current.setToRightSideView();
        setCurrentView('right');
        break;
    }
  }

  const handleSubmit = (values: Record<string, number>) => {
    console.debug('[BodyModelPage] Submitting values:', {
      step: 'Handling submit',
      newValues: values,
      previousShapeKeys: shapeKeyValues,
      gender
    });
    setBodyMeasurements((prev) => ({ ...prev, ...values }))
    setShapeKeyValues(values)
    setIsEditMode(false)
  }

  const handleCancel = () => {
    setIsEditMode(false)
  }

  return (
    <div className="flex-1 bg-neutral-50">
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <DashboardNav />
            <div className="lg:col-span-3">
              <div className={`bg-white rounded-lg shadow-sm ${isEditMode ? 'p-4 md:p-8' : 'p-8'}`}>
                {!isEditMode && <h1 className="text-2xl font-bold mb-6">ShapeMe Body Model</h1>}
                <div className={`grid grid-cols-1 lg:grid-cols-2 ${isEditMode ? 'gap-4' : 'gap-8'}`}>
                  <div className={`order-first lg:order-last ${isEditMode ? 'md:sticky md:top-4' : ''}`}>
                    <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden relative">
                      <ModelViewer 
                        ref={modelViewerRef}
                        className="w-full h-full" 
                        shapeKeyValues={shapeKeyValues}
                        modelPath={`/models/${gender}.glb`}
                        gender={gender}
                      />
                    </div>
                    <div className="flex flex-col items-center gap-2 mt-2">
                      <div className="flex justify-center gap-1 px-1 overflow-x-auto no-scrollbar">
                        <Button 
                          variant={currentView === 'front' ? 'default' : 'outline'} 
                          size="sm" 
                          onClick={() => setView('front')}
                          className={`min-w-[4rem] px-2 ${
                            currentView === 'front' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
                          }`}
                        >
                          Front
                        </Button>
                        <Button 
                          variant={currentView === 'back' ? 'default' : 'outline'} 
                          size="sm" 
                          onClick={() => setView('back')}
                          className={`min-w-[4rem] px-2 ${
                            currentView === 'back' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
                          }`}
                        >
                          Back
                        </Button>
                        <Button 
                          variant={currentView === 'left' ? 'default' : 'outline'} 
                          size="sm" 
                          onClick={() => setView('left')}
                          className={`min-w-[4rem] px-2 ${
                            currentView === 'left' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
                          }`}
                        >
                          Left
                        </Button>
                        <Button 
                          variant={currentView === 'right' ? 'default' : 'outline'} 
                          size="sm" 
                          onClick={() => setView('right')}
                          className={`min-w-[4rem] px-2 ${
                            currentView === 'right' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
                          }`}
                        >
                          Right
                        </Button>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button 
                          variant={gender === "female" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleGenderChange("female")}
                          className={`min-w-[4rem] px-2 ${
                            gender === "female" ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
                          }`}
                        >
                          Female
                        </Button>
                        <Button 
                          variant={gender === "male" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleGenderChange("male")}
                          className={`min-w-[4rem] px-2 ${
                            gender === "male" ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
                          }`}
                        >
                          Male
                        </Button>
                      </div>
                    </div>
                    {!isEditMode && (
                      <p className="text-sm text-neutral-600 mt-4 text-center">
                        Your personalized body model helps designers create better-fitting garments
                      </p>
                    )}
                  </div>
                  <div className={`order-last lg:order-first space-y-6 ${isEditMode ? 'lg:pt-0' : ''}`}>
                    {!isEditMode && <h2 className="text-lg font-semibold">Body Data</h2>}
                    {!isEditMode ? (
                      <>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="height">Height (inches)</Label>
                            <Input id="height" type="number" value={bodyMeasurements.height} readOnly />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="weight">Weight (pounds)</Label>
                            <Input id="weight" type="number" value={bodyMeasurements.weight} readOnly />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bust">Bust Size (inches)</Label>
                            <Input id="bust" type="number" value={bodyMeasurements.bustSize} readOnly />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="waist">Waist Size (inches)</Label>
                            <Input id="waist" type="number" value={bodyMeasurements.waistSize} readOnly />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="hip">Hip Size (inches)</Label>
                            <Input id="hip" type="number" value={bodyMeasurements.hipSize} readOnly />
                          </div>
                        </div>
                        <Button className="w-full" onClick={handleUpdateClick}>
                          Update
                        </Button>
                      </>
                    ) : (
                      <BodyModelSliders
                        gender={gender}
                        initialValues={shapeKeyValues}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        onChange={(values) => {
                          console.log('🎯 [BodyModelPage] Received onChange from BodyModelSliders:', {
                            gender,
                            receivedValues: values,
                            keys: Object.keys(values),
                            settingShapeKeyValues: values
                          });
                          setShapeKeyValues(values);
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}