"use client"
import { useState, useMemo, useCallback, useEffect } from "react"
import type React from "react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface CalendarProps {
  mode?: "single"
  selected?: Date | null
  onSelect?: (date: Date | undefined) => void
  className?: string
}

export default function Calendar({ selected, onSelect, className }: CalendarProps) {
  const { toast } = useToast()
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(selected?.getMonth() ?? today.getMonth())
  const [currentYear, setCurrentYear] = useState(selected?.getFullYear() ?? today.getFullYear())
  const [manualInput, setManualInput] = useState("")

  useEffect(() => {
    if (selected) {
      setManualInput(format(selected, "yyyy-MM-dd"))
      setCurrentMonth(selected.getMonth())
      setCurrentYear(selected.getFullYear())
    } else {
      setManualInput("")
    }
  }, [selected])

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

  const daysInCalendar = useMemo(() => {
    const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth)
    const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth)

    const days = []

    const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1)
    for (let i = firstDayIndex; i > 0; i--) {
      days.push({
        date: new Date(currentYear, currentMonth - 1, prevMonthDays - i + 1),
        isCurrentMonth: false,
      })
    }

    for (let i = 1; i <= daysInCurrentMonth; i++) {
      days.push({
        date: new Date(currentYear, currentMonth, i),
        isCurrentMonth: true,
      })
    }

    const remainingCells = 42 - days.length
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        date: new Date(currentYear, currentMonth + 1, i),
        isCurrentMonth: false,
      })
    }

    return days
  }, [currentMonth, currentYear])

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1))
    if (currentMonth === 0) setCurrentYear((prev) => prev - 1)
  }

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1))
    if (currentMonth === 11) setCurrentYear((prev) => prev + 1)
  }

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()

  const handleManualDateChange = useCallback(() => {
    const parsedDate = new Date(manualInput)
    if (isNaN(parsedDate.getTime())) {
      toast({
        title: "Invalid Date",
        description: "Please enter a valid date format (e.g., YYYY-MM-DD).",
        variant: "destructive",
      })
      return
    }

    onSelect?.(parsedDate)
    toast({
      title: "Date Set",
      description: `Calendar moved to ${format(parsedDate, "PPP")}.`,
    })
  }, [manualInput, onSelect, toast])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        handleManualDateChange()
      }
    },
    [handleManualDateChange],
  )

  return (
    <div
      className={cn(
        "p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700",
        className,
      )}
    >
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <Input
          type="date"
          placeholder="YYYY-MM-DD"
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
          aria-label="Manual date input"
        />
        <Button onClick={handleManualDateChange}>Set Date</Button>
      </div>

      <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="w-9 h-9 flex items-center justify-center">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {daysInCalendar.map((day, index) => (
          <div key={index} className="flex items-center justify-center">
            <button
              onClick={() => onSelect?.(day.date)}
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center text-sm transition-colors",
                day.isCurrentMonth ? "text-gray-800 dark:text-gray-200" : "text-gray-400 dark:text-gray-600 opacity-70",
                isSameDay(day.date, today) &&
                  "border border-red-400 dark:border-red-600 text-red-600 dark:text-red-400",
                selected && isSameDay(day.date, selected) && "bg-red-600 text-white hover:bg-red-700",
                !(selected && isSameDay(day.date, selected)) && "hover:bg-gray-100 dark:hover:bg-gray-800",
              )}
              aria-label={`Select ${day.date.getDate()}`}
            >
              {day.date.getDate()}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
