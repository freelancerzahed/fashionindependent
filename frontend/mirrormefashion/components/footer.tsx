import Link from "next/link"
import { ShoppingCart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-gray-100 py-8 dark:bg-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold" prefetch={false}>
              <ShoppingCart className="h-6 w-6 text-primary-600" />
              E-commerce Social
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Connecting shoppers and creators through shared style.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-semibold">Shop</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/shop"
                  className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-600 transition-colors"
                  prefetch={false}
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/new-arrivals"
                  className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-600 transition-colors"
                  prefetch={false}
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/best-sellers"
                  className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-600 transition-colors"
                  prefetch={false}
                >
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/sale"
                  className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-600 transition-colors"
                  prefetch={false}
                >
                  Sale
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-semibold">Company</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-600 transition-colors"
                  prefetch={false}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-600 transition-colors"
                  prefetch={false}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-600 transition-colors"
                  prefetch={false}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-600 transition-colors"
                  prefetch={false}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-600 transition-colors"
                  prefetch={false}
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-semibold">Connect</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-600 transition-colors"
                  prefetch={false}
                >
                  Facebook
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-600 transition-colors"
                  prefetch={false}
                >
                  Instagram
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-600 transition-colors"
                  prefetch={false}
                >
                  Twitter
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-600 transition-colors"
                  prefetch={false}
                >
                  Pinterest
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          © 2023 E-commerce Social. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
