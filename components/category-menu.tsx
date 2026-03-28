"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMenuCategories } from "@/hooks/useMenuCategories"

export function CategoryMenu() {
  const pathname = usePathname()
  const { categories, loading, error } = useMenuCategories()

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/")
  }

  // Show loading state
  if (loading) {
    return (
      <div className="border-t py-3 bg-white">
        <div className="flex items-center gap-8 h-6">
          <div className="h-4 w-20 bg-neutral-200 rounded animate-pulse"></div>
          <div className="h-4 w-20 bg-neutral-200 rounded animate-pulse"></div>
          <div className="h-4 w-20 bg-neutral-200 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error || categories.length === 0) {
    return (
      <div className="border-t py-3 bg-white">
        <div className="text-sm text-neutral-500">
          Categories unavailable. Please refresh the page.
        </div>
      </div>
    )
  }

  return (
    <div className="border-t py-3 bg-white">
      <div className="flex items-center gap-8">
        {categories.map((category) => (
          <div key={category.id} className="relative group">
            <Link
              href={category.href}
              className={`text-sm font-medium transition-all duration-200 ease-in-out ${
                isActive(category.href)
                  ? "text-black font-semibold"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              {category.name}
            </Link>

            {category.subcategories && category.subcategories.length > 0 && (
              <div className="absolute left-0 top-full pt-2 hidden group-hover:block z-50">
                <div className="bg-white border border-neutral-200 rounded-lg shadow-lg p-4 w-[400px] grid grid-cols-2 gap-3">
                  {category.subcategories.map((subcategory) => (
                    <Link
                      key={subcategory.id}
                      href={subcategory.href}
                      className="text-sm text-neutral-900 hover:text-black hover:bg-neutral-100 px-2 py-1 rounded transition-all duration-150 ease-in-out block"
                    >
                      {subcategory.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
