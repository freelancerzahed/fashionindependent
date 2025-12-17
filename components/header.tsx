"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { ProfileDropdown } from "@/components/profile-dropdown"

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

  const womenswearCategories = [
    "Tops",
    "Bottoms",
    "Sweaters & Cardigans",
    "Dresses",
    "Coats & Jackets",
    "Jumpsuits & Rompers",
    "Lingerie & Underwear",
    "Accessories",
    "Shoes",
    "Swimwear",
  ]

  const menswearCategories = ["Shirts", "Bottoms", "Coats & Jackets", "Suits", "Underwear", "Accessories", "Shoes"]

  const kidswearCategories = [
    "Tops",
    "Bottoms",
    "Sweaters & Cardigans",
    "Dresses",
    "Coats & Jackets",
    "Jumpsuits & Rompers",
    "Lingerie & Underwear",
    "Accessories",
    "Shoes",
    "Swimwear",
  ]

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

          <div className="border-t py-3 bg-white">
            <div className="flex items-center gap-8">
              {/* Womenswear Dropdown */}
              <div className="relative group">
                <button className={`text-sm font-medium transition-all duration-200 ease-in-out ${isActive("/category/womenswear") ? "text-black font-semibold" : "text-neutral-600 hover:text-black"}`}>
                  Womenswear
                </button>
                <div className="absolute left-0 top-full pt-2 hidden group-hover:block z-50">
                  <div className="bg-white border border-neutral-200 rounded-lg shadow-lg p-4 w-[400px] grid grid-cols-2 gap-3">
                    {womenswearCategories.map((category) => (
                      <Link
                        key={category}
                        href={`/category/womenswear?sub=${category.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-sm text-neutral-900 hover:text-black hover:bg-neutral-100 px-2 py-1 rounded transition-all duration-150 ease-in-out block"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Menswear Dropdown */}
              <div className="relative group">
                <button className={`text-sm font-medium transition-all duration-200 ease-in-out ${isActive("/category/menswear") ? "text-black font-semibold" : "text-neutral-600 hover:text-black"}`}>
                  Menswear
                </button>
                <div className="absolute left-0 top-full pt-2 hidden group-hover:block z-50">
                  <div className="bg-white border border-neutral-200 rounded-lg shadow-lg p-4 w-[400px] grid grid-cols-2 gap-3">
                    {menswearCategories.map((category) => (
                      <Link
                        key={category}
                        href={`/category/menswear?sub=${category.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-sm text-neutral-900 hover:text-black hover:bg-neutral-100 px-2 py-1 rounded transition-all duration-150 ease-in-out block"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Kidswear Dropdown */}
              <div className="relative group">
                <button className={`text-sm font-medium transition-all duration-200 ease-in-out ${isActive("/category/kidswear") ? "text-black font-semibold" : "text-neutral-600 hover:text-black"}`}>
                  Kidswear
                </button>
                <div className="absolute left-0 top-full pt-2 hidden group-hover:block z-50">
                  <div className="bg-white border border-neutral-200 rounded-lg shadow-lg p-4 w-[400px] grid grid-cols-2 gap-3">
                    {kidswearCategories.map((category) => (
                      <Link
                        key={category}
                        href={`/category/kidswear?sub=${category.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-sm text-neutral-900 hover:text-black hover:bg-neutral-100 px-2 py-1 rounded transition-all duration-150 ease-in-out block"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Wearables Link */}
              <Link
                href="/category/wearables"
                className={`text-sm font-medium transition-all duration-200 ease-in-out ${
                  isActive("/category/wearables") ? "text-black font-semibold" : "text-neutral-600 hover:text-black"
                }`}
              >
                Wearables
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
