"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

interface BodyMeasurements {
  height: number
  chest: number
  waist: number
  hips: number
  shoulders: number
}

export function BodyModeler() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const bodyRef = useRef<THREE.Group | null>(null)
  const animationIdRef = useRef<number | null>(null)

  const [measurements, setMeasurements] = useState<BodyMeasurements>({
    height: 170,
    chest: 95,
    waist: 80,
    hips: 95,
    shoulders: 40,
  })

  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf5f5f5)
    sceneRef.current = scene

    // Camera setup - use container dimensions instead of window
    const width = containerRef.current.clientWidth || 800
    const height = containerRef.current.clientHeight || 400
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 3
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(typeof window !== "undefined" ? window.devicePixelRatio : 1)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    // Create body group
    const bodyGroup = new THREE.Group()
    bodyRef.current = bodyGroup
    scene.add(bodyGroup)

    // Create body parts
    const createBodyParts = () => {
      bodyGroup.clear()

      const scale = measurements.height / 170

      // Head
      const headGeometry = new THREE.SphereGeometry(0.3 * scale, 32, 32)
      const headMaterial = new THREE.MeshPhongMaterial({ color: 0xfdbcb4 })
      const head = new THREE.Mesh(headGeometry, headMaterial)
      head.position.y = 1.2 * scale
      bodyGroup.add(head)

      // Torso
      const torsoGeometry = new THREE.BoxGeometry((measurements.chest / 95) * 0.6 * scale, 0.8 * scale, 0.3 * scale)
      const torsoMaterial = new THREE.MeshPhongMaterial({ color: 0x4a90e2 })
      const torso = new THREE.Mesh(torsoGeometry, torsoMaterial)
      torso.position.y = 0.4 * scale
      bodyGroup.add(torso)

      // Waist
      const waistGeometry = new THREE.BoxGeometry((measurements.waist / 80) * 0.5 * scale, 0.3 * scale, 0.25 * scale)
      const waistMaterial = new THREE.MeshPhongMaterial({ color: 0x4a90e2 })
      const waist = new THREE.Mesh(waistGeometry, waistMaterial)
      waist.position.y = -0.1 * scale
      bodyGroup.add(waist)

      // Hips
      const hipsGeometry = new THREE.BoxGeometry((measurements.hips / 95) * 0.55 * scale, 0.4 * scale, 0.3 * scale)
      const hipsMaterial = new THREE.MeshPhongMaterial({ color: 0x4a90e2 })
      const hips = new THREE.Mesh(hipsGeometry, hipsMaterial)
      hips.position.y = -0.5 * scale
      bodyGroup.add(hips)

      // Left arm
      const armGeometry = new THREE.CylinderGeometry(0.1 * scale, 0.08 * scale, 0.8 * scale, 16)
      const armMaterial = new THREE.MeshPhongMaterial({ color: 0xfdbcb4 })
      const leftArm = new THREE.Mesh(armGeometry, armMaterial)
      leftArm.position.set(-0.5 * scale, 0.3 * scale, 0)
      leftArm.rotation.z = 0.3
      bodyGroup.add(leftArm)

      // Right arm
      const rightArm = new THREE.Mesh(armGeometry, armMaterial)
      rightArm.position.set(0.5 * scale, 0.3 * scale, 0)
      rightArm.rotation.z = -0.3
      bodyGroup.add(rightArm)

      // Left leg
      const legGeometry = new THREE.CylinderGeometry(0.12 * scale, 0.1 * scale, 1 * scale, 16)
      const legMaterial = new THREE.MeshPhongMaterial({ color: 0x2c3e50 })
      const leftLeg = new THREE.Mesh(legGeometry, legMaterial)
      leftLeg.position.set(-0.2 * scale, -1 * scale, 0)
      bodyGroup.add(leftLeg)

      // Right leg
      const rightLeg = new THREE.Mesh(legGeometry, legMaterial)
      rightLeg.position.set(0.2 * scale, -1 * scale, 0)
      bodyGroup.add(rightLeg)
    }

    createBodyParts()

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)

      if (bodyRef.current) {
        bodyRef.current.rotation.x = rotation.x
        bodyRef.current.rotation.y = rotation.y
      }

      renderer.render(scene, camera)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return
      const newWidth = containerRef.current.clientWidth
      const newHeight = containerRef.current.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [mounted, rotation])

  useEffect(() => {
    if (!mounted || !bodyRef.current) return

    const createBodyParts = () => {
      if (!bodyRef.current) return
      bodyRef.current.clear()

      const scale = measurements.height / 170

      // Head
      const headGeometry = new THREE.SphereGeometry(0.3 * scale, 32, 32)
      const headMaterial = new THREE.MeshPhongMaterial({ color: 0xfdbcb4 })
      const head = new THREE.Mesh(headGeometry, headMaterial)
      head.position.y = 1.2 * scale
      bodyRef.current.add(head)

      // Torso
      const torsoGeometry = new THREE.BoxGeometry((measurements.chest / 95) * 0.6 * scale, 0.8 * scale, 0.3 * scale)
      const torsoMaterial = new THREE.MeshPhongMaterial({ color: 0x4a90e2 })
      const torso = new THREE.Mesh(torsoGeometry, torsoMaterial)
      torso.position.y = 0.4 * scale
      bodyRef.current.add(torso)

      // Waist
      const waistGeometry = new THREE.BoxGeometry((measurements.waist / 80) * 0.5 * scale, 0.3 * scale, 0.25 * scale)
      const waistMaterial = new THREE.MeshPhongMaterial({ color: 0x4a90e2 })
      const waist = new THREE.Mesh(waistGeometry, waistMaterial)
      waist.position.y = -0.1 * scale
      bodyRef.current.add(waist)

      // Hips
      const hipsGeometry = new THREE.BoxGeometry((measurements.hips / 95) * 0.55 * scale, 0.4 * scale, 0.3 * scale)
      const hipsMaterial = new THREE.MeshPhongMaterial({ color: 0x4a90e2 })
      const hips = new THREE.Mesh(hipsGeometry, hipsMaterial)
      hips.position.y = -0.5 * scale
      bodyRef.current.add(hips)

      // Left arm
      const armGeometry = new THREE.CylinderGeometry(0.1 * scale, 0.08 * scale, 0.8 * scale, 16)
      const armMaterial = new THREE.MeshPhongMaterial({ color: 0xfdbcb4 })
      const leftArm = new THREE.Mesh(armGeometry, armMaterial)
      leftArm.position.set(-0.5 * scale, 0.3 * scale, 0)
      leftArm.rotation.z = 0.3
      bodyRef.current.add(leftArm)

      // Right arm
      const rightArm = new THREE.Mesh(armGeometry, armMaterial)
      rightArm.position.set(0.5 * scale, 0.3 * scale, 0)
      rightArm.rotation.z = -0.3
      bodyRef.current.add(rightArm)

      // Left leg
      const legGeometry = new THREE.CylinderGeometry(0.12 * scale, 0.1 * scale, 1 * scale, 16)
      const legMaterial = new THREE.MeshPhongMaterial({ color: 0x2c3e50 })
      const leftLeg = new THREE.Mesh(legGeometry, legMaterial)
      leftLeg.position.set(-0.2 * scale, -1 * scale, 0)
      bodyRef.current.add(leftLeg)

      // Right leg
      const rightLeg = new THREE.Mesh(legGeometry, legMaterial)
      rightLeg.position.set(0.2 * scale, -1 * scale, 0)
      bodyRef.current.add(rightLeg)
    }

    createBodyParts()
  }, [measurements, mounted])

  const handleMeasurementChange = (key: keyof BodyMeasurements, value: number) => {
    setMeasurements((prev) => ({ ...prev, [key]: value }))
  }

  const saveMeasurements = () => {
    localStorage.setItem("bodyMeasurements", JSON.stringify(measurements))
    alert("Body measurements saved successfully!")
  }

  if (!mounted) {
    return <div className="w-full space-y-6">Loading...</div>
  }

  return (
    <div className="w-full space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="p-4">
            <div ref={containerRef} className="w-full h-96 bg-gray-50 rounded-lg" />
            <div className="mt-4 flex gap-2 justify-center">
              <Button variant="outline" onClick={() => setRotation((prev) => ({ ...prev, y: prev.y - 0.1 }))}>
                Rotate Left
              </Button>
              <Button variant="outline" onClick={() => setRotation((prev) => ({ ...prev, y: prev.y + 0.1 }))}>
                Rotate Right
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Body Measurements</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm">Height (cm): {measurements.height}</Label>
                <Slider
                  value={[measurements.height]}
                  onValueChange={(value) => handleMeasurementChange("height", value[0])}
                  min={150}
                  max={200}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm">Chest (cm): {measurements.chest}</Label>
                <Slider
                  value={[measurements.chest]}
                  onValueChange={(value) => handleMeasurementChange("chest", value[0])}
                  min={80}
                  max={120}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm">Waist (cm): {measurements.waist}</Label>
                <Slider
                  value={[measurements.waist]}
                  onValueChange={(value) => handleMeasurementChange("waist", value[0])}
                  min={60}
                  max={110}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm">Hips (cm): {measurements.hips}</Label>
                <Slider
                  value={[measurements.hips]}
                  onValueChange={(value) => handleMeasurementChange("hips", value[0])}
                  min={80}
                  max={130}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm">Shoulders (cm): {measurements.shoulders}</Label>
                <Slider
                  value={[measurements.shoulders]}
                  onValueChange={(value) => handleMeasurementChange("shoulders", value[0])}
                  min={35}
                  max={50}
                  step={1}
                  className="mt-2"
                />
              </div>

              <Button onClick={saveMeasurements} className="w-full">
                Save Measurements
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
