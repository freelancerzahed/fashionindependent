"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BraSizePopupProps {
  show: boolean
  setShow: (val: boolean) => void
  onSelectBraSize: (value: string) => void
}

export default function BraSizePopup({ show, setShow, onSelectBraSize }: BraSizePopupProps) {
  const [band, setBand] = useState("34")
  const [cup, setCup] = useState("B")
  const [country, setCountry] = useState("US")

  const validCups = ["AAA", "AA", "A", "B", "C", "D", "DD", "DDD", "E", "F", "G", "H", "HH", "HHH", "I", "J", "K", "L", "M", "N", "O"]
  const validBands = Array.from({ length: 29 }, (_, i) => (28 + i * 2).toString()) // 28 to 56, even numbers

  // Conversion logic
  const convertToUS = (inputBand: string, inputCup: string, inputCountry: string) => {
    let usBand = parseInt(inputBand)
    let usCup = inputCup.toUpperCase()

    if (inputCountry === "EU" || inputCountry === "FR") {
      usBand = Math.round((usBand - 10) / 2.54) // EU/FR to US band conversion (cm to inches)
      const cupIndex = validCups.indexOf(inputCup.toUpperCase())
      usCup = cupIndex >= 0 ? validCups[cupIndex] : "B" // EU/FR uses same cup letters
    } else if (inputCountry === "UK") {
      usBand = usBand // UK and US bands are same
      const ukToUsCups: { [key: string]: string } = {
        "AA": "AA", "A": "A", "B": "B", "C": "C", "D": "D", "DD": "DD", "E": "DDD", "F": "E", "FF": "F",
        "G": "G", "GG": "H", "H": "HH", "HH": "I", "J": "J", "JJ": "K", "K": "L"
      }
      usCup = ukToUsCups[inputCup.toUpperCase()] || "B"
    } else if (inputCountry === "JP") {
      usBand = Math.round((usBand - 10) / 2.54) // JP to US band (cm to inches)
      const jpToUsCups: { [key: string]: string } = {
        "A": "AA", "B": "A", "C": "B", "D": "C", "E": "D", "F": "DD", "G": "DDD", "H": "E", "I": "F",
        "J": "G", "K": "H"
      }
      usCup = jpToUsCups[inputCup.toUpperCase()] || "B"
    }

    if (!validBands.includes(usBand.toString()) || !validCups.includes(usCup)) {
      return "34B" // Fallback to default if conversion results in invalid size
    }

    return `${usBand}${usCup}`
  }

  const handleSelect = () => {
    const usSize = country === "US" ? `${band}${cup}` : convertToUS(band, cup, country)
    onSelectBraSize(usSize)
    setShow(false)
  }

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent className="max-w-sm rounded-2xl p-6 space-y-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">
            Select Your Bra Size
          </DialogTitle>
        </DialogHeader>

        {/* Preview Section */}
        <div className="text-center">
          <p className="text-2xl font-bold">{country === "US" ? `${band}${cup}` : convertToUS(band, cup, country)}</p>
          <p className="text-gray-500 text-sm">{country} Sizing</p>
          <p className="text-xs text-gray-400 mt-1">
            Select your country and size or type manually.
          </p>
        </div>

        {/* Country Selector */}
        <div>
          <label className="text-xs text-gray-500">Country</label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">US</SelectItem>
              <SelectItem value="EU">EU</SelectItem>
              <SelectItem value="UK">UK</SelectItem>
              <SelectItem value="JP">Japan</SelectItem>
              <SelectItem value="FR">France</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Band and Cup Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500">Band Size</label>
            <Select value={band} onValueChange={setBand}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select band" />
              </SelectTrigger>
              <SelectContent>
                {validBands.map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-gray-500">Cup Size</label>
            <Select value={cup} onValueChange={setCup}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select cup" />
              </SelectTrigger>
              <SelectContent>
                {validCups.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Manual Input */}
        <div>
          <label className="text-xs text-gray-500">Manual Input (e.g., 34B)</label>
          <Input
            value={`${band}${cup}`}
            onChange={(e) => {
              const match = e.target.value.match(/(\d+)([A-Z]+)/)
              if (match) {
                setBand(match[1])
                setCup(match[2].toUpperCase())
              }
            }}
            className="text-center"
            placeholder="e.g., 34B"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => setShow(false)}>Cancel</Button>
          <Button onClick={handleSelect}>Confirm</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
