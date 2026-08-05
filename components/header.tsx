"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { Menu, X } from "lucide-react"

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const mobileLinks = [
    { href: "/discover", label: "Discover" },
    { href: "/shop", label: "Shop" },
    { href: "/blog", label: "Blog" },
  ]

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
      <div className="w-full max-w-full px-4 sm:px-6 lg:px-8">
        <div className="md:hidden flex items-center justify-between py-3">
          <div className="flex flex-col">
            <a href="https://mirrormefashion.com" target="_blank" rel="noopener noreferrer" className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors">
              by Mirror Me
            </a>
            <Link href="/" className="text-lg font-bold">Fashion Independent</Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="inline-flex items-center justify-center rounded-md border border-neutral-200 p-2 text-neutral-700 hover:bg-neutral-50"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {user ? <ProfileDropdown /> : null}
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-100 py-3">
            <nav className="grid grid-cols-3 gap-2">
              {mobileLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-md px-3 py-2 text-center text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}

        <div className="hidden md:block">
          <div className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div className="flex flex-col min-w-0">
              <a href="https://mirrormefashion.com" target="_blank" rel="noopener noreferrer" className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors">
                by Mirror Me Fashion
              </a>
              <Link href="/" className="text-xl font-bold truncate">The Fashion Independent</Link>
            </div>

            <nav className="hidden md:flex items-center gap-4 lg:gap-8">
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

            <div className="hidden md:flex items-center gap-2 lg:gap-4 flex-wrap justify-end">
              {!user && (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/signup">Become a Member</Link>
                </Button>
              )}
              <Button variant="outline" size="sm" asChild>
                <Link href="/launch-campaign">Launch a Campaign</Link>
              </Button>
              {user ? (
                <ProfileDropdown />
              ) : (
                <Button size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
