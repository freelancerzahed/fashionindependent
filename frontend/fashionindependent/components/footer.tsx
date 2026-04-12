import Link from "next/link"
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div>
            <a href="https://mirrormefashion.com" target="_blank" rel="noopener noreferrer" className="text-xs text-neutral-400 hover:text-white transition-colors mb-2 block">
              by Mirror Me Fashion
            </a>
            <p className="text-lg font-bold mb-4">The Fashion Independent</p>
          </div>

          {/* Get Help */}
          <div>
            <h3 className="font-semibold mb-4">Get Help</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/rules" className="text-sm text-neutral-300 hover:text-white">
                  Rules
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-sm text-neutral-300 hover:text-white">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-neutral-300 hover:text-white">
                  Customer Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/how-this-works" className="text-sm text-neutral-300 hover:text-white">
                  How This Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-neutral-300 hover:text-white">
                  Company About
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-sm text-neutral-300 hover:text-white">
                  News & Press
                </Link>
              </li>
              <li>
                <Link href="/sitemap-page" className="text-sm text-neutral-300 hover:text-white">
                  Site Map
                </Link>
              </li>
            </ul>
          </div>

          {/* Get Started */}
          <div>
            <h3 className="font-semibold mb-4">Get Started</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/launch-campaign" className="text-sm text-neutral-300 hover:text-white">
                  Become a Creative
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-sm text-neutral-300 hover:text-white">
                  Become a Member
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-sm text-neutral-300 hover:text-white">
                  Become an Affiliate
                </Link>
              </li>
            </ul>
          </div>

                    {/* Fashion Resources */}
          <div>
            <h3 className="font-semibold mb-4">Fashion Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/find-a-job" className="text-sm text-neutral-300 hover:text-white">
                  Find a Job
                </Link>
              </li>
              <li>
                <Link href="/hire-a-professional" className="text-sm text-neutral-300 hover:text-white">
                  Hire a Professional
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="text-sm text-neutral-300 hover:text-white">
                  Marketplace
                </Link>
              </li>
            </ul>
          </div>
        </div>




        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-400">The Fashion Independent © 2025 - 2026</p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-sm text-neutral-400 hover:text-white">
              Website Terms
            </Link>
            <Link href="/privacy" className="text-sm text-neutral-400 hover:text-white">
              Privacy Policy
            </Link>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 pt-8 flex justify-center gap-6">
          <Link
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <Facebook className="h-5 w-5" />
            <span className="sr-only">Facebook</span>
          </Link>
          <Link
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <Instagram className="h-5 w-5" />
            <span className="sr-only">Instagram</span>
          </Link>
          <Link
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <Twitter className="h-5 w-5" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <Youtube className="h-5 w-5" />
            <span className="sr-only">YouTube</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
