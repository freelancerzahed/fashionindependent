"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ZoomIn, ZoomOut, RotateCw } from "lucide-react"

interface CropAreaState {
  x: number
  y: number
  size: number
}

export interface ImageCropperProps {
  image: string
  aspectRatio?: number
  cropShape?: "square" | "circle"
  onCropComplete: (croppedImage: Blob) => void
  onCancel: () => void
}

export default function ImageCropper({
  image,
  aspectRatio = 1,
  cropShape = "circle",
  onCropComplete,
  onCancel,
}: ImageCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [cropArea, setCropArea] = useState<CropAreaState>({
    x: 0,
    y: 0,
    size: 200,
  })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Draw preview on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !imageRef.current) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = imageRef.current

    canvas.width = 300
    canvas.height = 300

    ctx.save()
    ctx.translate(150, 150)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.translate(-150, -150)

    const scaledZoom = zoom / 100
    const x = 150 - (img.width * scaledZoom) / 2 - cropArea.x
    const y = 150 - (img.height * scaledZoom) / 2 - cropArea.y

    ctx.drawImage(img, x, y, img.width * scaledZoom, img.height * scaledZoom)
    ctx.restore()

    // Draw crop area overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
    ctx.fillRect(0, 0, 300, 300)

    ctx.clearRect(
      cropArea.x,
      cropArea.y,
      cropArea.size,
      cropArea.size
    )

    // Draw crop border
    ctx.strokeStyle = "#fff"
    ctx.lineWidth = 2
    if (cropShape === "circle") {
      ctx.beginPath()
      ctx.arc(
        cropArea.x + cropArea.size / 2,
        cropArea.y + cropArea.size / 2,
        cropArea.size / 2,
        0,
        Math.PI * 2
      )
      ctx.stroke()
    } else {
      ctx.strokeRect(cropArea.x, cropArea.y, cropArea.size, cropArea.size)
    }
  }, [zoom, rotation, cropArea, cropShape])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - cropArea.x,
      y: e.clientY - cropArea.y,
    })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    let newX = e.clientX - rect.left - dragStart.x
    let newY = e.clientY - rect.top - dragStart.y

    // Constrain to canvas bounds
    newX = Math.max(0, Math.min(newX, 300 - cropArea.size))
    newY = Math.max(0, Math.min(newY, 300 - cropArea.size))

    setCropArea((prev) => ({ ...prev, x: newX, y: newY }))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleCropSizeChange = (value: number[]) => {
    const newSize = Math.min(value[0], 300)
    setCropArea((prev) => ({
      ...prev,
      size: newSize,
      x: Math.max(0, Math.min(prev.x, 300 - newSize)),
      y: Math.max(0, Math.min(prev.y, 300 - newSize)),
    }))
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleCrop = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const cropCanvas = document.createElement("canvas")
    const ctx = cropCanvas.getContext("2d")
    if (!ctx) return

    cropCanvas.width = cropArea.size
    cropCanvas.height = cropArea.size

    const imageData = canvas.getImageData(
      cropArea.x,
      cropArea.y,
      cropArea.size,
      cropArea.size
    )
    ctx.putImageData(imageData, 0, 0)

    // Create circular mask if needed
    if (cropShape === "circle") {
      ctx.globalCompositeOperation = "destination-in"
      ctx.beginPath()
      ctx.arc(
        cropArea.size / 2,
        cropArea.size / 2,
        cropArea.size / 2,
        0,
        Math.PI * 2
      )
      ctx.fill()
    }

    cropCanvas.toBlob((blob) => {
      if (blob) {
        onCropComplete(blob)
      }
    })
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Crop Your Image</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preview Canvas */}
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            className="border-2 border-gray-300 rounded-lg cursor-move bg-gray-100"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>

        {/* Hidden image for loading */}
        <img
          ref={imageRef}
          src={image}
          alt="source"
          style={{ display: "none" }}
        />

        {/* Controls */}
        <div className="space-y-4">
          {/* Zoom Control */}
          <div className="flex items-center gap-3">
            <ZoomOut className="w-4 h-4" />
            <Slider
              value={[zoom]}
              onValueChange={(value) => setZoom(value[0])}
              min={50}
              max={200}
              step={10}
              className="flex-1"
            />
            <ZoomIn className="w-4 h-4" />
            <span className="text-sm font-medium w-10">{zoom}%</span>
          </div>

          {/* Crop Size Control */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Size:</span>
            <Slider
              value={[cropArea.size]}
              onValueChange={handleCropSizeChange}
              min={50}
              max={300}
              step={10}
              className="flex-1"
            />
            <span className="text-sm font-medium w-12">{cropArea.size}px</span>
          </div>

          {/* Rotation Control */}
          <Button
            onClick={handleRotate}
            variant="outline"
            className="w-full gap-2"
          >
            <RotateCw className="w-4 h-4" />
            Rotate
          </Button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={onCancel} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleCrop} className="flex-1 bg-primary-600">
            Crop Image
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
