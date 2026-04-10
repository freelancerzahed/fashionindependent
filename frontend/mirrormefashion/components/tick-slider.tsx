"use client"

import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"

interface TickSliderProps {
  id: string
  value: number
  min: number
  max: number
  step: number
  ticks: number
  onChange: (value: number) => void
  name: string
  label: string,
  disabled?: boolean 
}

export const TickSlider = memo(function TickSlider({
  id,
  value,
  min,
  max,
  step,
  ticks,
  onChange,
  name,
  label,
  disabled = false,
}: TickSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [thumbPosition, setThumbPosition] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const tickValues = useMemo(() => {
    const arr: number[] = []
    for (let i = 0; i < ticks; i++) {
      arr.push(min + (i * (max - min)) / (ticks - 1))
    }
    return arr
  }, [min, max, ticks])

  useEffect(() => {
    const pct = ((value - min) / (max - min)) * 100
    setThumbPosition(Number.isFinite(pct) ? Math.min(100, Math.max(0, pct)) : 0)
  }, [value, min, max])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(parseFloat(e.target.value)),
    [onChange]
  )

  const handleTickClick = useCallback((tickValue: number) => onChange(tickValue), [onChange])

  return (
    <div className="slider-container">
      <div className="slider-track-container" ref={trackRef}>
        <div className="slider-track" />
        <div className="slider-filled-track" style={{ width: `${thumbPosition}%` }} />
        <div className="slider-start-circle" />
        <div className="slider-ticks-container">
          {tickValues.map((tickValue, i) => {
            const position = (i / (ticks - 1)) * 100
            const isActive = Math.abs(value - tickValue) < step / 2
            return (
              <div
                key={i}
                className={`slider-tick ${isActive ? "slider-tick-active" : ""}`}
                style={{ left: `${position}%` }}
                onClick={() => handleTickClick(tickValue)}
                title={`${tickValue.toFixed(1)}`}
              />
            )
          })}
        </div>
        <div className={`slider-thumb ${isDragging ? "slider-thumb-dragging" : ""}`} style={{ left: `${thumbPosition}%` }} />
        <input
          id={id}
          className="slider-input"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          name={name}
          onChange={handleInputChange}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          aria-label={label}
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          disabled={disabled} 
        />
      </div>
      {/* <div className="slider-value-display">
        <span className="text-xs text-gray-500">{min}</span>
        <span className="text-xs font-medium text-red-600">{value.toFixed(1)}"</span>
        <span className="text-xs text-gray-500">{max}</span>
      </div> */}

      <style jsx>{`
        .slider-container { width: 100%; margin: 0.5rem 0; box-sizing: border-box; }
        .slider-track-container { position: relative; height: 1.5rem; margin: 0.3rem 0; padding: 0.3rem 0; box-sizing: border-box; }
        .slider-track { position: absolute; top: 50%; width: 100%; height: 0.15rem; background-color: #e5e7eb; border-radius: 0.1rem; transform: translateY(-50%); }
        .slider-filled-track { position: absolute; top: 50%; height: 0.15rem; background: linear-gradient(90deg, #dc2626, #f87171); border-radius: 0.1rem; transform: translateY(-50%); transition: width 0.2s ease; }
        .slider-start-circle { position: absolute; top: 50%; left: 0; width: 0.4rem; height: 0.4rem; background-color: #dc2626; border-radius: 50%; transform: translate(-50%, -50%); z-index: 3; }
        .slider-ticks-container { position: absolute; top: 50%; width: 100%; height: 0.15rem; transform: translateY(-50%); pointer-events: none; }
        .slider-tick { position: absolute; top: 50%; width: 0.3rem; height: 0.3rem; background-color: #dc2626; border: 1px solid #b91c1c; border-radius: 50%; transform: translate(-50%, -50%); cursor: pointer; pointer-events: all; transition: all 0.15s ease; z-index: 2; }
        .slider-tick:hover { background-color: #b91c1c; border-color: #991b1b; transform: translate(-50%, -50%) scale(1.15); }
        .slider-tick-active { background-color: #f87171; border-color: #f87171; transform: translate(-50%, -50%) scale(1.2); box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.3); }
        .slider-thumb { position: absolute; top: 50%; width: 0.9rem; height: 0.9rem; background: linear-gradient(135deg, #dc2626, #f87171); border: 0.15rem solid white; border-radius: 50%; box-shadow: 0 0.1rem 0.3rem rgba(0, 0, 0, 0.2); transform: translate(-50%, -50%); transition: all 0.15s ease; pointer-events: none; z-index: 4; }
        .slider-thumb-dragging { transform: translate(-50%, -50%) scale(1.12); box-shadow: 0 0.2rem 0.6rem rgba(220, 38, 38, 0.35); }
        .slider-input { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; margin: 0; z-index: 5; -webkit-appearance: none; appearance: none; }
        .slider-input:focus ~ .slider-thumb { box-shadow: 0 0 0 0.15rem rgba(220, 38, 38, 0.25); }
      `}</style>
    </div>
  )
})
