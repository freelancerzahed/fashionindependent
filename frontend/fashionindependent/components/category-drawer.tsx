"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, X } from "lucide-react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer"
import { useMenuCategories } from "@/hooks/useMenuCategories"

interface CategoryDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategoryDrawer({ open, onOpenChange }: CategoryDrawerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { categories, loading, error } = useMenuCategories()

  const currentCategory = categories.find((c) => c.name === selectedCategory)

  // Show loading state
  if (loading && open) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh] flex flex-col">
          <DrawerHeader className="flex items-center justify-between border-b pb-4">
            <DrawerTitle>Loading categories...</DrawerTitle>
            <DrawerClose className="p-0 h-auto w-auto">
              <X className="h-5 w-5" />
            </DrawerClose>
          </DrawerHeader>
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

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
              {categories.length === 0 && !loading && (
                <div className="p-4 text-center text-neutral-500">
                  {error ? "Error loading categories" : "No categories available"}
                </div>
              )}
              {categories.map((category) => (
                <button
                  key={category.id}
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
            {currentCategory?.subcategories && currentCategory.subcategories.length > 0 ? (
              <div className="divide-y">
                {currentCategory.subcategories.map((subcategory) => (
                  <Link
                    key={subcategory.id}
                    href={subcategory.href}
                    onClick={() => onOpenChange(false)}
                    className="block px-4 py-4 hover:bg-neutral-50 transition-colors border-b last:border-b-0 text-neutral-900 hover:text-black font-medium"
                  >
                    {subcategory.name}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-neutral-500">
                <Link
                  href={currentCategory?.href || "/"}
                  onClick={() => onOpenChange(false)}
                  className="text-blue-600 hover:underline font-medium"
                >
                  View Category
                </Link>
              </div>
            )}
          </div>
        )}
      </DrawerContent>
    </Drawer>
  )
}
