import {
  User, Bell, MessageCircle, ImageIcon, Users, BarChart3, Settings, HelpCircle,
  MessageSquare, ShoppingBag, Heart, CreditCard, Store, BookOpen, Info,
  Mail, Shield, FileText, Sparkles, FolderOpen, Film, Video, Clapperboard
} from "lucide-react"

import type { SidebarSection } from "@/types/main-sidebar"

// NOTE: Cart is rendered via a custom component flag (custom: true)
export const sidebarData: SidebarSection[] = [
  {
    type: "quickAccess",
    title: "Quick Access",
    showTitle: true,
    items: [
      { icon: Users, label: "Friends", href: "/user/friends" },
      { icon: ImageIcon, label: "Media", href: "/user/media" },
      { icon: BarChart3, label: "Shape Summary", href: "/user/shape-summary" },
      { icon: Bell, label: "Notifications", href: "/user/notifications", badge: 5, color: "text-orange-600" },
      { icon: MessageCircle, label: "Messages", href: "/user/messages", badge: 3, color: "text-green-600" },
      { icon: BarChart3, label: "Recommendations", href: "/user/recommendations" },
    ],
  },

  {
    type: "section",
    title: "Shopping",
    icon: Store,
    color: "text-red-600",
    bgColor: "bg-red-50",
    collapsible: true,
    items: [
      { icon: MessageCircle, label: "Sophia Chat", href: "/user/help" },
      { icon: Store, label: "Shop", href: "/shop" },
      { icon: Sparkles, label: "Recommendations", href: "/user/recommendations" },
      { icon: Heart, label: "Favorites", href: "/user/favorites" },
      { icon: CreditCard, label: "Checkout", href: "/checkout" },
    ],
  },

  {
    type: "section",
    title: "Your Summary",
    icon: User,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    collapsible: true,
    items: [
      { icon: BarChart3, label: "Shape Summary", href: "/user/shape-summary" },
      { icon: Users, label: "Your Body Model", href: "/user/body-model" },
      { icon: ShoppingBag, label: "Closet Essentials", href: "/user/closet-essentials" },
      { icon: User, label: "Personal Info", href: "/user/personal-info" },
      { icon: BookOpen, label: "Blog", href: "/blog" },
      { icon: FolderOpen, label: "Look Book", href: "/user/look-book" },
    ],
  },

  {
    type: "section",
    title: "Media",
    icon: ImageIcon,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    collapsible: true,
    items: [
      { icon: ImageIcon, label: "All Media", href: "/media/all" },
      { icon: ImageIcon, label: "Images", href: "/media/images" },
      { icon: Video, label: "Videos", href: "/media/videos" },
      { icon: Clapperboard, label: "Shorts", href: "/media/shorts" },
    ],
  },

  {
    type: "section",
    title: "Support & Settings",
    icon: Settings,
    color: "text-gray-600",
    collapsible: true,
    items: [
      { icon: Settings, label: "Settings", href: "/user/settings" },
      { icon: HelpCircle, label: "Help & Support", href: "/user/help" },
      { icon: MessageSquare, label: "Send Feedback", href: "/user/feedback" },
    ],
  },
  {
    type: "legal",
    title: "Legal",
    showTitle: false,
    items: [
      { icon: Shield, label: "Privacy Policy", href: "/privacy" },
      { icon: FileText, label: "Terms of Service", href: "/terms" },
    ],
  },
]
