"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

interface CustomHorizontalScrollbarProps {
  scrollContainerRef: React.RefObject<HTMLElement>
}

export default function CustomHorizontalScrollbar({ scrollContainerRef }: CustomHorizontalScrollbarProps) {
  const scrollbarRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const [thumbHeight, setThumbHeight] = useState(0)
  const [thumbTop, setThumbTop] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startY = useRef(0)
  const startScrollLeft = useRef(0)

  const updateThumbPosition = useCallback(() => {
    const container = scrollContainerRef.current
    const scrollbar = scrollbarRef.current

    if (container && scrollbar) {
      const { scrollWidth, clientWidth, scrollLeft } = container
      const scrollbarHeight = scrollbar.clientHeight

      if (scrollWidth <= clientWidth) {
        setThumbHeight(0)
        setThumbTop(0)
        return
      }

      const newThumbHeight = (clientWidth / scrollWidth) * scrollbarHeight
      const visibleThumbHeight = Math.max(newThumbHeight, 20)
      setThumbHeight(visibleThumbHeight)

      const scrollableContentDistance = scrollWidth - clientWidth
      const scrollbarTrackScrollableHeight = scrollbarHeight - visibleThumbHeight
      const newThumbTop = (scrollLeft / scrollableContentDistance) * scrollbarTrackScrollableHeight
      setThumbTop(newThumbTop)
    }
  }, [scrollContainerRef])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    container.addEventListener("scroll", updateThumbPosition)
    window.addEventListener("resize", updateThumbPosition)

    updateThumbPosition()

    return () => {
      container.removeEventListener("scroll", updateThumbPosition)
      window.removeEventListener("resize", updateThumbPosition)
    }
  }, [scrollContainerRef, updateThumbPosition])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only react to left click (button 0) and if the click is on the thumb itself
      if (e.button === 0 && thumbRef.current && thumbRef.current.contains(e.target as Node)) {
        e.preventDefault() // Prevent default only when dragging the thumb
        setIsDragging(true)
        startY.current = e.clientY
        startScrollLeft.current = scrollContainerRef.current?.scrollLeft || 0
      }
    },
    [scrollContainerRef],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !scrollContainerRef.current || !scrollbarRef.current) return

      const deltaY = e.clientY - startY.current
      const scrollbarHeight = scrollbarRef.current.clientHeight
      const thumbHeight = thumbRef.current?.clientHeight || 0
      const scrollableTrackHeight = scrollbarHeight - thumbHeight
      const scrollableContentWidth = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth

      if (scrollableTrackHeight === 0 || scrollableContentWidth === 0) return

      const scrollRatio = deltaY / scrollableTrackHeight
      const newScrollLeft = startScrollLeft.current + scrollRatio * scrollableContentWidth
      scrollContainerRef.current.scrollLeft = newScrollLeft
    },
    [isDragging, scrollContainerRef],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => isDragging && handleMouseMove(e)
    const onUp = () => isDragging && handleMouseUp()

    if (isDragging) {
      document.addEventListener("mousemove", onMove)
      document.addEventListener("mouseup", onUp)
    }

    return () => {
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseup", onUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <div
      ref={scrollbarRef}
      className={cn(
        "fixed top-20 right-0 w-2 h-[calc(100vh-80px)] bg-red-500 rounded-full z-[40] border border-red-700",
        "hidden lg:block",
      )}
    >
      {thumbHeight > 0 && (
        <div
          ref={thumbRef}
          className={cn("absolute w-full bg-lime-400 rounded-full cursor-grab", isDragging && "cursor-grabbing")}
          style={{ height: thumbHeight, top: thumbTop }}
          onMouseDown={handleMouseDown}
        />
      )}
    </div>
  )
}
