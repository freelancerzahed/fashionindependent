"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Radio = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="radio"
        className={cn("h-4 w-4 cursor-pointer accent-blue-600", className)}
        {...props}
      />
    )
  },
)

Radio.displayName = "Radio"

export { Radio }
