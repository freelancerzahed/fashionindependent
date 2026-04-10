// components/navigation/MobileMenuContent.tsx
"use client";

import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import {
  ShoppingCart,
  Heart,
  Star,
  Phone,
  Mail,
  UserPlus,
  LogIn,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from "lucide-react";
import { SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { sidebarData, socialLinks } from "@/lib/data/navigation";
import { MobileMenuSection } from "@/components/navigation/mobile-menu-section";

interface MobileMenuContentProps {
  isAuthenticated: boolean;
  user: any;
  userInitials: string;
  expandedSections: string[];
  toggleSection: (section: string) => void;
  pathname: string;
  wishlistItemCount: number;
  cartItemCount: number;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

export function MobileMenuContent({
  isAuthenticated,
  user,
  userInitials,
  expandedSections,
  toggleSection,
  pathname,
  wishlistItemCount,
  cartItemCount,
  setIsMobileMenuOpen,
}: MobileMenuContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Hidden SheetTitle for accessibility */}
      <VisuallyHidden>
        <SheetTitle>Navigation Menu</SheetTitle>
      </VisuallyHidden>

      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex-shrink-0">
            <ShoppingCart className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">Mirror</span>
        </div>
      </div>

      {/* User Profile Section */}
      {isAuthenticated && user && (
        <div className="flex-shrink-0 p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-red-100">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-red-100 text-red-700 text-sm font-medium">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm text-gray-900 truncate">
                {user?.name ||
                  `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
                  "User"}
              </h3>
              <p className="text-xs text-gray-500 truncate">
                @{user?.username || user?.email?.split("@")[0] || "user"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Content */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {isAuthenticated ? (
            <>
              {/* Quick Access */}
              <MobileMenuSection
                title="Quick Access"
                icon={Star}
                items={sidebarData.quickAccess}
                pathname={pathname}
                onItemClick={() => setIsMobileMenuOpen(false)}
              />

              <Separator />

              {/* Main Sections */}
              <div className="space-y-4">
                {sidebarData.mainSections.map((section) => (
                  <MobileMenuSection
                    key={section.title}
                    title={section.title}
                    icon={section.icon}
                    items={section.items}
                    pathname={pathname}
                    onItemClick={() => setIsMobileMenuOpen(false)}
                    isExpanded={expandedSections.includes(section.title)}
                    onToggle={() => toggleSection(section.title)}
                    color={section.color}
                    bgColor={section.bgColor}
                    collapsible
                  />
                ))}
              </div>

              <Separator />

              {/* Secondary Sections */}
              <div className="space-y-4">
                {sidebarData.secondarySections.map((section) => (
                  <MobileMenuSection
                    key={section.title}
                    title={section.title}
                    icon={section.icon}
                    items={section.items}
                    pathname={pathname}
                    onItemClick={() => setIsMobileMenuOpen(false)}
                    isExpanded={expandedSections.includes(section.title)}
                    onToggle={() => toggleSection(section.title)}
                    color={section.color}
                    collapsible
                  />
                ))}
              </div>

              <Separator />

              {/* Legal Links */}
              <MobileMenuSection
                items={sidebarData.legal}
                pathname={pathname}
                onItemClick={() => setIsMobileMenuOpen(false)}
                small
              />
            </>
          ) : (
            /* Public Navigation for non-authenticated users */
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-3">
                Navigation
              </h3>
              {sidebarData.secondarySections[0].items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors ${
                      isActive
                        ? "bg-red-50 text-red-600 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {item.icon && (
                      <div
                        className={`p-2 rounded-lg ${
                          isActive ? "bg-red-100" : "bg-gray-100"
                        }`}
                      >
                        <item.icon
                          className={`w-4 h-4 ${
                            isActive ? "text-red-600" : "text-gray-600"
                          }`}
                        />
                      </div>
                    )}
                    <span className="flex-1">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Shopping Actions for all users */}
          <Separator />
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-3">
              Shopping
            </h3>
            <Link
              href="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-red-50">
                <Heart className="h-4 w-4 text-red-600" />
              </div>
              <span className="flex-1 font-medium">Wishlist</span>
              {wishlistItemCount > 0 && (
                <Badge className="bg-red-100 text-red-600 text-xs">
                  {wishlistItemCount}
                </Badge>
              )}
            </Link>
            <Link
              href="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-red-50">
                <ShoppingCart className="h-4 w-4 text-red-600" />
              </div>
              <span className="flex-1 font-medium">Shopping Cart</span>
              {cartItemCount > 0 && (
                <Badge className="bg-red-100 text-red-600 text-xs">
                  {cartItemCount}
                </Badge>
              )}
            </Link>
          </div>

          <Separator />

          {/* Contact Info Section */}
          <div className="flex-shrink-0 p-4 border-b border-gray-100 bg-red-50">
            <h4 className="text-sm font-semibold text-red-700 mb-3">
              Contact Information
            </h4>
            <div className="space-y-2 text-sm text-red-600">
             
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3" />
                <span>support@mirrormefashion.com</span>
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="flex-shrink-0 p-4 border-b border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Follow Us
            </h4>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  title={social.title}
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Bottom Actions */}
      <div className="flex-shrink-0 p-4 border-t border-gray-100">
        {isAuthenticated ? (
          <LogoutButton className="w-full justify-start gap-3 text-sm bg-red-600 hover:bg-red-700 text-white h-10" />
        ) : (
          <div className="space-y-3">
            <Button asChild className="w-full bg-red-600 hover:bg-red-700">
              <Link href="/auth/register">
                <UserPlus className="h-4 w-4 mr-2" />
                Get Started
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="w-full bg-transparent"
            >
              <Link href="/auth/login">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
