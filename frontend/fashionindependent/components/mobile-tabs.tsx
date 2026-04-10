"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface MobileTabsProps {
  tabs: Array<{
    id: string
    label: string
  }>
  activeTab: string
  onTabChange: (tabId: string) => void
  children: React.ReactNode
}

export function MobileTabs({ tabs, activeTab, onTabChange, children }: MobileTabsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener("resize", checkScroll)
    return () => window.removeEventListener("resize", checkScroll)
  }, [])

  useEffect(() => {
    const activeElement = scrollContainerRef.current?.querySelector(`[data-tab="${activeTab}"]`)
    if (activeElement) {
      activeElement.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
      checkScroll()
    }
  }, [activeTab])

  return (
    <div className="w-full">
      <div className="relative overflow-hidden">
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex gap-2 overflow-x-auto pb-2 scroll-smooth"
          style={{
            scrollBehavior: "smooth",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {/* Hide scrollbar for Chrome, Safari and Opera */}
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {tabs.map((tab) => (
            <button
              key={tab.id}
              data-tab={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-shrink-0 px-4 py-3 font-medium whitespace-nowrap rounded-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-neutral-900 text-white shadow-md"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white via-white to-transparent pointer-events-none" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white via-white to-transparent pointer-events-none" />
        )}
      </div>

      {/* Tab content */}
      <div className="mt-6">{children}</div>
    </div>
  )
}
