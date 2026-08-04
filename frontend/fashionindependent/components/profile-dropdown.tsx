"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { User, Settings, LogOut, Eye, Globe, LayoutGrid, Heart, History, ShoppingBag, CreditCard, Sparkles } from "lucide-react"

export function ProfileDropdown() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [publicProfileSlug, setPublicProfileSlug] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  if (!user) return null

  const handleLogout = () => {
    setOpen(false)
    logout()
    router.push("/")
  }

  useEffect(() => {
    if (!user || user.role !== "creator") {
      setPublicProfileSlug(null)
      return
    }

    const token = localStorage.getItem("auth_token") || localStorage.getItem("sanctum_token") || localStorage.getItem("token")
    if (!token) {
      return
    }

    const loadPublicProfileSlug = async () => {
      try {
        const response = await fetch(`/api/creator/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          console.warn("Failed to fetch creator profile:", response.status)
          return
        }

        const data = await response.json()
        console.log("Creator profile data:", data)
        const slug = data?.creator?.slug?.trim()
        console.log("Extracted slug:", slug)
        if (slug) {
          setPublicProfileSlug(slug)
          console.log("Public profile slug set to:", slug)
        }
      } catch (error) {
        console.warn("Failed to load creator public profile slug", error)
      }
    }

    loadPublicProfileSlug()
  }, [user?.role])

  const handleDashboard = () => {
    setOpen(false)
    router.push("/dashboard")
  }

  const handleDashboardSection = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  const handleProfile = () => {
    setOpen(false)
    console.log("Profile clicked - role:", user?.role, "slug:", publicProfileSlug)
    if (user?.role === "creator" && publicProfileSlug) {
      const url = `/creators/${publicProfileSlug}`
      console.log("Navigating to public profile:", url)
      router.push(url)
      return
    }

    console.log("Navigating to dashboard profile")
    router.push("/dashboard/profile")
  }

  const handleSettings = () => {
    setOpen(false)
    router.push("/dashboard/account")
  }

  const initials = user.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()

  // Convert avatar path to proxy URL if needed
  let avatarUrl = null
  if (user.avatar) {
    avatarUrl = user.avatar.startsWith('/') || user.avatar.startsWith('http')
      ? user.avatar
      : `/api/storage/${user.avatar}`
  }

  const dashboardLinks = [
    { href: "/dashboard", label: "Overview", icon: LayoutGrid },
    { href: "/dashboard/products", label: "Products", icon: ShoppingBag },
    { href: "/dashboard/campaigns", label: "Campaigns", icon: Sparkles },
    { href: "/dashboard/pledges", label: "Pledges", icon: Heart },
    { href: "/dashboard/history", label: "History", icon: History },
  ]

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full hover:opacity-80 transition-opacity">
          <Avatar className="size-8 cursor-pointer">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={user.name} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-2">
        <DropdownMenuLabel className="flex flex-col px-2 py-2">
          <span className="text-sm font-semibold">{user.name}</span>
          <span className="text-xs text-neutral-500">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 py-2">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
            Dashboard
          </p>
          <div className="space-y-1">
            {dashboardLinks.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.href}
                  onClick={() => handleDashboardSection(item.href)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-100"
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
          {user?.role === "creator" && publicProfileSlug ? (
            <Globe className="mr-2 size-4" />
          ) : (
            <Eye className="mr-2 size-4" />
          )}
          <span>{user?.role === "creator" && publicProfileSlug ? "Public Profile" : "Profile"}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
          <Settings className="mr-2 size-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} variant="destructive" className="cursor-pointer">
          <LogOut className="mr-2 size-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
