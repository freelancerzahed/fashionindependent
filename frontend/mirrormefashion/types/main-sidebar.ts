import type { LucideIcon } from "lucide-react"
import type { ComponentType } from "react"

export type SidebarItem = {
  icon: LucideIcon | ComponentType<any>
  label: string
  href: string
  badge?: number
  color?: string
  custom?: boolean // for special items like Cart
}

type BaseSection = {
  title: string
  items: SidebarItem[]
  showTitle?: boolean
}

export type QuickAccessSection = BaseSection & {
  type: "quickAccess"
}

export type LegalSection = BaseSection & {
  type: "legal"
}

export type CollapsibleSection = BaseSection & {
  type: "section"
  icon: LucideIcon
  color: string
  bgColor?: string
  collapsible?: boolean
}

export type SidebarSection = QuickAccessSection | LegalSection | CollapsibleSection
