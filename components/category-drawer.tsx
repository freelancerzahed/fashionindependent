"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, X } from "lucide-react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer"

interface CategoryDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategoryDrawer({ open, onOpenChange }: CategoryDrawerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = [
    {
      name: "Womenswear",
      href: "/category/womenswear",
      subcategories: [
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
      ],
    },
    {
      name: "Menswear",
      href: "/category/menswear",
      subcategories: ["Shirts", "Bottoms", "Coats & Jackets", "Suits", "Underwear", "Accessories", "Shoes"],
    },
    {
      name: "Kidswear",
      href: "/category/kidswear",
      subcategories: [
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
      ],
    },
    {
      name: "Wearables",
      href: "/category/wearables",
      subcategories: [],
    },
  ]

  const currentCategory = categories.find((c) => c.name === selectedCategory)

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh] flex flex-col">
        <DrawerHeader className="flex items-center justify-between border-b pb-4">
          <DrawerTitle>
            {selectedCategory ? (
              <button
                onClick={() => setSelectedCategory(null)}
                className="flex items-center gap-2 text-lg font-semibold hover:text-neutral-600 transition-colors"
              >
                <ChevronRight className="h-5 w-5 rotate-180" />
                {selectedCategory}
              </button>
            ) : (
              "Shop by Category"
            )}
          </DrawerTitle>
          <DrawerClose className="p-0 h-auto w-auto">
            <X className="h-5 w-5" />
          </DrawerClose>
        </DrawerHeader>

        {/* Main Categories View */}
        {!selectedCategory ? (
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className="w-full flex items-center justify-between px-4 py-4 hover:bg-neutral-50 transition-colors text-left"
                >
                  <span className="font-medium text-neutral-900">{category.name}</span>
                  <ChevronRight className="h-5 w-5 text-neutral-400" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Subcategories View */
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y">
              {/* View all category link */}
              <Link
                href={currentCategory?.href || "#"}
                onClick={() => onOpenChange(false)}
                className="w-full flex items-center justify-between px-4 py-4 hover:bg-neutral-50 transition-colors font-semibold text-neutral-900 border-b-2"
              >
                <span>View All {selectedCategory}</span>
                <ChevronRight className="h-5 w-5 text-neutral-400" />
              </Link>

              {/* Subcategories */}
              {currentCategory?.subcategories.map((subcategory) => (
                <Link
                  key={subcategory}
                  href={`${currentCategory.href}?sub=${subcategory.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => onOpenChange(false)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-neutral-50 transition-colors text-neutral-700 hover:text-neutral-900"
                >
                  <span className="text-sm">{subcategory}</span>
                  <ChevronRight className="h-4 w-4 text-neutral-300" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  )
}
