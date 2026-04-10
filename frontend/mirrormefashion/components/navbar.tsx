"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import {
  ShoppingCart,
  Menu,
  User,
  Heart,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Phone,
  Mail,
  Clock,
  X,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { LogoutButton } from "@/components/logout-button"

export default function Navbar() {
  // Safely destructure with default empty arrays to prevent 'reduce' or '.length' errors
  const { state } = useCart()
  const { wishlist } = useWishlist()

  const cartItemCount = state.itemCount
  const wishlistItemCount = wishlist.length

  // State for user authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showTopBar, setShowTopBar] = useState(true)

  useEffect(() => {
    // Check localStorage for user data to determine authentication status
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user")
      if (userData) {
        try {
          setUser(JSON.parse(userData))
          setIsAuthenticated(true)
        } catch (error) {
          console.error("Failed to parse user data from localStorage:", error)
          localStorage.removeItem("user") // Clear corrupted data
          setIsAuthenticated(false)
          setUser(null)
        }
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    }
  }, []) // Empty dependency array means this runs once on mount

  return (
    <>
      {/* Top Bar */}
      {showTopBar && (
        <div className="sticky top-0 z-50 w-full bg-gradient-to-r from-red-600 to-red-700 text-white text-sm">
          <div className="container mx-auto flex h-10 items-center justify-between px-4 md:px-6">
            {/* Left side - Contact Info */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3" />
                <span>support@ecommercesocial.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span>Mon-Fri 9AM-6PM EST</span>
              </div>
            </div>

            {/* Center - Promotional Message */}
            <div className="flex-1 text-center md:flex-none">
              <span className="font-medium">🎉 Free Shipping on Orders Over $50! Limited Time Offer</span>
            </div>

            {/* Right side - Social Media & Close */}
            <div className="flex items-center gap-4">
              {/* Social Media Links */}
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-200 transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-200 transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-200 transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-200 transition-colors"
                >
                  <Youtube className="h-4 w-4" />
                  <span className="sr-only">YouTube</span>
                </Link>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowTopBar(false)}
                className="hover:text-red-200 transition-colors"
                aria-label="Close top bar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header
        className="sticky top-0 z-40 w-full border-b bg-white shadow-sm"
        style={{ top: showTopBar ? "40px" : "0" }}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold" prefetch={false}>
            <ShoppingCart className="h-6 w-6 text-red-600" />
            <span className="sr-only">E-commerce Social</span>
            <span className="hidden md:inline text-red-600">E-commerce Social</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:gap-6">
            <Link href="/shop" className="text-sm font-medium hover:text-red-600 transition-colors" prefetch={false}>
              Shop
            </Link>
            <Link
              href="/profiles"
              className="text-sm font-medium hover:text-red-600 transition-colors"
              prefetch={false}
            >
              Profiles
            </Link>
            <Link href="/blog" className="text-sm font-medium hover:text-red-600 transition-colors" prefetch={false}>
              Blog
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-red-600 transition-colors" prefetch={false}>
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-red-600 transition-colors" prefetch={false}>
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {/* Wishlist Button */}
            <Button variant="ghost" size="icon" className="relative hover:bg-red-50">
              <Link href="/wishlist">
                <Heart className="h-5 w-5 text-red-600" />
                {wishlistItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                    {wishlistItemCount}
                  </span>
                )}
                <span className="sr-only">Wishlist</span>
              </Link>
            </Button>

            {/* Cart Button */}
            <Button variant="ghost" size="icon" className="relative hover:bg-red-50">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5 text-red-600" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                    {cartItemCount}
                  </span>
                )}
                <span className="sr-only">Shopping Cart</span>
              </Link>
            </Button>

            {/* User Profile/Auth */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-50">
                    <Avatar className="h-8 w-8">
                      {(() => {
                        let avatarSrc = "/placeholder.svg"
                        if (user.avatar) {
                          avatarSrc = user.avatar.startsWith('/') || user.avatar.startsWith('http')
                            ? user.avatar
                            : `/api/storage/${user.avatar}`
                        }
                        return <AvatarImage src={avatarSrc} alt={user.name || "User"} />
                      })()}
                      <AvatarFallback className="bg-red-100 text-red-600">
                        {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${user.username || user.id}`}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <LogoutButton asDropdownItem />
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" asChild className="hover:bg-red-50">
                <Link href="/auth/login">
                  <User className="h-5 w-5 text-red-600" />
                  <span className="sr-only">Login</span>
                </Link>
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden hover:bg-red-50">
                  <Menu className="h-6 w-6 text-red-600" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="flex flex-col gap-4 p-4">
                  <Link href="/" className="flex items-center gap-2 text-lg font-semibold" prefetch={false}>
                    <ShoppingCart className="h-6 w-6 text-red-600" />
                    E-commerce Social
                  </Link>

                  {/* Mobile Contact Info */}
                  <div className="border-b pb-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Phone className="h-3 w-3" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Mail className="h-3 w-3" />
                      <span>support@ecommercesocial.com</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-3 w-3" />
                      <span>Mon-Fri 9AM-6PM EST</span>
                    </div>
                  </div>

                  <Link
                    href="/shop"
                    className="text-base font-medium hover:text-red-600 transition-colors"
                    prefetch={false}
                  >
                    Shop
                  </Link>
                  <Link
                    href="/profiles"
                    className="text-base font-medium hover:text-red-600 transition-colors"
                    prefetch={false}
                  >
                    Profiles
                  </Link>
                  <Link
                    href="/blog"
                    className="text-base font-medium hover:text-red-600 transition-colors"
                    prefetch={false}
                  >
                    Blog
                  </Link>
                  <Link
                    href="/about"
                    className="text-base font-medium hover:text-red-600 transition-colors"
                    prefetch={false}
                  >
                    About
                  </Link>
                  <Link
                    href="/contact"
                    className="text-base font-medium hover:text-red-600 transition-colors"
                    prefetch={false}
                  >
                    Contact
                  </Link>
                  {isAuthenticated && user ? (
                    <>
                      <Link
                        href={`/profile/${user.username || user.id}`}
                        className="text-base font-medium hover:text-red-600 transition-colors"
                      >
                        Profile
                      </Link>
                      <Link href="/dashboard" className="text-base font-medium hover:text-red-600 transition-colors">
                        Dashboard
                      </Link>
                      <Link href="/settings" className="text-base font-medium hover:text-red-600 transition-colors">
                        Settings
                      </Link>
                      <LogoutButton className="justify-start pl-0" />
                    </>
                  ) : (
                    <Link href="/auth/login" className="text-base font-medium hover:text-red-600 transition-colors">
                      Login
                    </Link>
                  )}

                  {/* Mobile Social Media */}
                  <div className="border-t pt-4 mt-4">
                    <p className="text-sm font-medium text-gray-600 mb-3">Follow Us</p>
                    <div className="flex items-center gap-4">
                      <Link
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Facebook className="h-5 w-5" />
                        <span className="sr-only">Facebook</span>
                      </Link>
                      <Link
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Twitter className="h-5 w-5" />
                        <span className="sr-only">Twitter</span>
                      </Link>
                      <Link
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Instagram className="h-5 w-5" />
                        <span className="sr-only">Instagram</span>
                      </Link>
                      <Link
                        href="https://youtube.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Youtube className="h-5 w-5" />
                        <span className="sr-only">YouTube</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  )
}
