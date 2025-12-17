"use client"

import { NavigationMenuTrigger } from "./ui/navigation-menu"
import type { ComponentProps } from "react"

export function ClientNavigationMenuTrigger(
  props: ComponentProps<typeof NavigationMenuTrigger>
) {
  return <NavigationMenuTrigger {...props} />
}