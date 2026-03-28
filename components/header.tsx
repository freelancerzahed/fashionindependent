"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { CategoryMenu } from "@/components/category-menu"

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="md:hidden flex items-center justify-between py-3">
          <Link href="/" className="flex flex-col">
            <span className="text-xs text-neutral-600">by Mirror Me</span>
            <span className="text-lg font-bold">Fashion Independent</span>
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <ProfileDropdown />
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>

        <div className="hidden md:block">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex flex-col">
              <span className="text-xs text-neutral-600">by Mirror Me Fashion</span>
              <span className="text-xl font-bold">The Fashion Independent</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              <Link
                href="/discover"
                className={`text-sm font-medium transition-all duration-200 ease-in-out ${
                  isActive("/discover")
                    ? "text-black font-semibold border-b-2 border-black"
                    : "text-neutral-600 hover:text-black"
                }`}
              >
                Discover
              </Link>
              <Link
                href="/shop"
                className={`text-sm font-medium transition-all duration-200 ease-in-out ${
                  isActive("/shop")
                    ? "text-black font-semibold border-b-2 border-black"
                    : "text-neutral-600 hover:text-black"
                }`}
              >
                Shop
              </Link>
              <Link
                href="/blog"
                className={`text-sm font-medium transition-all duration-200 ease-in-out ${
                  isActive("/blog")
                    ? "text-black font-semibold border-b-2 border-black"
                    : "text-neutral-600 hover:text-black"
                }`}
              >
                Blog
              </Link>
            </nav>

            <div className="hidden lg:flex items-center gap-4">
            
              <Button variant="outline" asChild>
                <Link href="/signup">Become a Member</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/launch-campaign">Launch a Campaign</Link>
              </Button>
              {user ? (
                <ProfileDropdown />
              ) : (
                <Button asChild>
                  <Link href="/login">Login</Link>
                </Button>
              )}
            </div>
          </div>

          {/* Dynamic Category Menu */}
          <CategoryMenu />
        </div>
      </div>
    </header>
  )
}
