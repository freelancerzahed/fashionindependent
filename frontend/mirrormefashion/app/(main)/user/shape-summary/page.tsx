"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { User, Eye, EyeOff, RotateCcw, Info, Shirt, ArrowLeftRight } from "lucide-react"
import { modelLoader } from "@/lib/modelLoader"
import FriendSuggestions from "@/components/friend-suggestions"
import AiAssistant from "@/components/ai-assistant"
import InfoCard from "@/components/shape-summary/InfoCard"
import ClosetItemCard from "@/components/shape-summary/ClosetItemCard"

// Mock user data
const mockUserData = {
  name: "Sarah Johnson",
  avatar: "/placeholder.svg?height=100&width=100",
  shapeClassification: "Hourglass",
  ageRange: "25-30",
  gender: "Female",
  bmi: 23.0,
  height: 168,
  weight: 65,
  shoeSize: "8.5",
  bustSize: "36C",
  hatSize: "Medium",
  shapeSummary:
    "Your hourglass body shape is characterized by balanced bust and hip measurements with a well-defined waist. Your measurements show excellent symmetry between your upper and lower body.",
}

export default function ShapeSummaryPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const modelRef = useRef<any>(null)

  const [THREE, setTHREE] = useState<typeof import("three") | null>(null)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [showMeasurements, setShowMeasurements] = useState(true)
  const [loadingKeys, setLoadingKeys] = useState(true)

  // Shape keys state
  const [shapeKeys, setShapeKeys] = useState<Record<string, number>>({})

  // Dynamically load Three.js
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

  // Fetch shape keys from API
  useEffect(() => {
    const fetchShapeKeys = async () => {
      try {
        const res = await fetch(`/api/body-data`)
        const data = await res.json()
        console.log("Shape keys fetched:", data)
        if (data.success && data.data.shape_keys) {
          setShapeKeys(data.data.shape_keys)
        } else {
          setShapeKeys({ Waist_Small: 0.4, Hips_Wide: 0.6 }) // fallback dummy keys
        }
      } catch (err) {
        console.error("Failed to fetch shape keys, using dummy:", err)
        setShapeKeys({ Waist_Small: 0.4, Hips_Wide: 0.6 })
      } finally {
        setLoadingKeys(false)
      }
    }
    fetchShapeKeys()
  }, [])

  // Apply shape keys
  const updateModelWithShapeKeys = (keys: Record<string, number>) => {
    if (!modelRef.current || !THREE) return
    // Access the actual model through the scene's modelReference property
    const model = (modelRef.current as any).modelReference || modelRef.current;
    model.traverse((child: any) => {
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

  // Load 3D model
  useEffect(() => {
    if (!canvasRef.current || !THREE) return

    const modelPath = "/models/female_average.glb"
    const { dispose, loadPromise, scene } = modelLoader(
      canvasRef.current,
      modelPath,
      1.0,
      "shapeSummaryRearBtn"
    )

    loadPromise
      ?.then((model) => {
        if (!scene) return
        modelRef.current = scene
        setModelLoaded(true)
        updateModelWithShapeKeys(shapeKeys) // apply once loaded

        // Store model reference for rotation
        if (model) {
          (scene as any).modelReference = model;
        }
      })
      .catch((err) => console.error("Failed to load model:", err))

    return () => dispose?.()
  }, [THREE])

  // Update when shapeKeys change
  useEffect(() => {
    if (!modelLoaded) return
    updateModelWithShapeKeys(shapeKeys)
  }, [shapeKeys, modelLoaded])

  // Handle rotation button click
  const handleRotateView = () => {
    if (!modelRef.current || !THREE) {
      console.log("Model or THREE not available");
      return;
    }

    const scene = modelRef.current;
    const model = (scene as any).modelReference;

    if (model) {
      const angles = [0, Math.PI, Math.PI / 2]; // Front, Back, Right Side
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
  }

  // Attach rotation handler to button when component mounts and model is loaded
  useEffect(() => {
    if (!modelLoaded) return;

    const rotationBtn = document.getElementById("shapeSummaryRearBtn");
    if (rotationBtn) {
      rotationBtn.addEventListener("click", handleRotateView);
      console.log("Rotation event listener attached");
      return () => {
        rotationBtn.removeEventListener("click", handleRotateView);
        console.log("Rotation event listener removed");
      };
    }
  }, [modelLoaded]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
      <div className=" mx-auto p-0">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

           {/* Left Column: Shape Summary + Extra Components */}
          <div className="lg:col-span-2 space-y-8">

            <InfoCard
              icon={<User className="w-6 h-6 text-red-600" />}
              title="Basic Information"
              description="Your fundamental body shape characteristics"
              fields={[
                { label: "Shape Classification", value: mockUserData.shapeClassification },
                { label: "Age Range", value: mockUserData.ageRange },
                { label: "Gender", value: mockUserData.gender },
                { label: "BMI", value: mockUserData.bmi, color: "text-green-600" },
              ]}
            />

            <InfoCard
              icon={<User className="w-6 h-6 text-red-600" />}
              title="Body Data"
              description="Your detailed measurements and sizing information"
              fields={[
                { label: "Height", value: `${mockUserData.height} cm` },
                { label: "Weight", value: `${mockUserData.weight} kg` },
                { label: "Shoe Size", value: mockUserData.shoeSize },
                { label: "Bust Size", value: mockUserData.bustSize },
                { label: "Hat Size", value: mockUserData.hatSize },
              ]}
            />

            {/* Example Closet Items */}
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <h1 className="flex items-center gap-3 p-4 text-xl font-bold text-gray-900">
                <Shirt className="w-6 h-6 text-red-600" />
                Closet Items
              </h1>
              <ClosetItemCard
                name="Wrap Dress"
                description="Flatters your waistline"
                image="/elegant-wrap-dress.jpg"
              />
              <ClosetItemCard
                name="High-Waisted Bottoms"
                description="Emphasize your waistline"
                image="/high-waisted-jeans.png"
              />
            </div>
          </div>
          {/* Right Column: Model */}
          <div className="lg:col-span-3">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg sticky top-8">
              <CardHeader className="pb-4 flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-red-600" /> Your Body Model
                  </CardTitle>
                  <CardDescription>
                    3D visualization of your measurements
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Rotate view"
                    onClick={handleRotateView}
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-4 min-h-[400px] h-[600px] flex items-center justify-center relative">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-auto max-w-sm mx-auto"
                    style={{ minHeight: "500px" }}
                  />
                  {!THREE && (
                    <p className="absolute text-gray-500">Loading 3D engine...</p>
                  )}
                  {THREE && !modelLoaded && (
                    <p className="absolute text-gray-500">
                      3D model is loading...
                    </p>
                  )}
                  {THREE && modelLoaded && loadingKeys && (
                    <p className="absolute text-gray-500">
                      Applying shape keys...
                    </p>
                  )}
                </div>
                <div className="mt-4 flex justify-center">
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 flex items-center gap-2"
                    onClick={() => console.log("Edit model clicked")}
                  >
                    <Info className="w-5 h-5" /> Edit Model
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>


        </div>
      </div>
    </div>
  )
}
