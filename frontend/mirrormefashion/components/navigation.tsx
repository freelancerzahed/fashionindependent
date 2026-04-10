"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, ShoppingCart, Heart, Bell, User } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { LogoutButton } from "@/components/logout-button";
import { navigationItems, sidebarData, socialLinks } from "@/lib/data/navigation";
import { TopBar } from "@/components/navigation/top-bar";
import { MobileMenuContent } from "@/components/navigation/mobile-menu";
import { useUserContext } from '@/contexts/UserContext';
type NavigationProps = {
  scrollToSection?: (sectionId: string) => void;
};
export default function Navigation({ scrollToSection }: NavigationProps) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  // Only use context if not on home page
  const context = !isHome ? useUserContext() : null;

  const user = context?.user;
  const loading = context?.loading;
  const error = context?.error;
  const logout = context?.logout;

  const { state } = useCart();
  const { wishlist } = useWishlist();

  const cartItemCount = state.itemCount;
  const wishlistItemCount = wishlist.length;

  // Determine authentication status - on home page, always show auth buttons
  const isAuthenticated = isHome ? false : !!user && !loading;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "Social & Community",
    "Shopping",
  ]);
  const [showTopBar, setShowTopBar] = useState(true);

  // Dispatch custom event when top bar visibility changes
  useEffect(() => {
    const event = new CustomEvent("topBarVisibilityChange", {
      detail: { visible: showTopBar },
    });
    window.dispatchEvent(event);
  }, [showTopBar]);

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionTitle)
        ? prev.filter((s) => s !== sectionTitle)
        : [...prev, sectionTitle]
    );
  };

  const userInitials = useMemo(() => {
    if (!user) return "U";
    return user.name?.charAt(0) || user.email?.charAt(0) || "U";
  }, [user]);

  const userName = useMemo(() => {
    if (!user) return "User";
    return user.name?.split(" ")[0] || user.email?.split("@")[0] || "User";
  }, [user]);

  // Show loading state for user profile if still loading
  const renderUserProfile = () => {
    if (loading) {
      return (
        <Button
          variant="ghost"
          className="relative h-10 px-3 rounded-lg hover:bg-red-50 transition-colors"
          disabled
        >
          <Avatar className="h-7 w-7 mr-2">
            <AvatarFallback className="bg-gray-100 text-gray-400 text-sm font-medium">
              ...
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:inline text-sm font-medium text-gray-400">
            Loading...
          </span>
        </Button>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 px-3 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Avatar className="h-7 w-7 mr-2">
              <AvatarImage
                src={"/placeholder.svg"}
                alt={user?.name || "User"}
              />
              <AvatarFallback className="bg-red-100 text-red-700 text-sm font-medium">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:inline text-sm font-medium text-gray-700">
              {userName}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.name || `${user?.name || ""} ${user || ""}`.trim() || "User"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href={`/profile/${user?.name || user?.id}`}
              className="cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="cursor-pointer">
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <LogoutButton asDropdownItem />
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <>
      <TopBar showTopBar={showTopBar} setShowTopBar={setShowTopBar} />

      {/* Main Header */}
      <header
        className={`fixed z-20 w-full border-b border-red-100 bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300 ${
          showTopBar ? "top-10" : "top-0"
        }`}
      >
        <div className="w-full flex h-16 items-center justify-between px-4 md:px-6">
          {/* Left side - Mobile Menu Toggle + Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle - SheetTrigger must be inside Sheet */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden h-10 w-10 rounded-lg hover:bg-red-50"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0 overflow-hidden">
                <MobileMenuContent
                  isAuthenticated={isAuthenticated}
                  user={user}
                  userInitials={userInitials}
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                  pathname={pathname}
                  wishlistItemCount={wishlistItemCount}
                  cartItemCount={cartItemCount}
                  setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 text-xl font-bold group"
              prefetch={false}
            >
              <img
                src="/logo.png"
                alt="MIRRORME FASHION Logo"
                className="h-12 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:gap-1 flex-1 justify-center max-w-4xl mx-8">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? "bg-red-50 text-red-700 shadow-sm"
                      : "text-gray-600 hover:text-red-600 hover:bg-red-50/50"
                  }`}
                  prefetch={false}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-600 hover:bg-red-600 text-white">
                  3
                </Badge>
                <span className="sr-only">Notifications</span>
              </Button>
            )}

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
              asChild
            >
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
                {wishlistItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-600 hover:bg-red-600 text-white">
                    {wishlistItemCount}
                  </Badge>
                )}
                <span className="sr-only">Wishlist</span>
              </Link>
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
              asChild
            >
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-600 hover:bg-red-600 text-white">
                    {cartItemCount}
                  </Badge>
                )}
                <span className="sr-only">Shopping Cart</span>
              </Link>
            </Button>

            {/* User Profile/Auth */}
            {isAuthenticated ? (
              renderUserProfile()
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="hidden sm:inline-flex"
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  size="sm"
                  onClick={() => scrollToSection ? scrollToSection("howItWorksSection") : window.location.href = "/#howItWorksSection"}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <span>Get Started</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
