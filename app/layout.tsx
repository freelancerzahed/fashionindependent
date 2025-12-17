import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { CartProvider } from "@/lib/cart-context"
import { PaymentProvider } from "@/lib/payment-context"
import { CampaignProvider } from "@/lib/campaign-context"
import { PayoutProvider } from "@/lib/payout-context"
import { AnalyticsProvider } from "@/lib/analytics-context"
import { AffiliateProvider } from "@/lib/affiliate-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "The Fashion Independent - Fashion Crowdfunding Platform",
  description:
    "Support talented indie fashion designers and discover rare fashion. Join our community of creatives shaping the future of fashion.",
  generator: "v0.app",
  keywords: [
    "fashion crowdfunding",
    "independent designers",
    "sustainable fashion",
    "fashion campaigns",
    "designer support",
  ],
  authors: [{ name: "The Fashion Independent" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://thefashionindependent.com",
    title: "The Fashion Independent - Fashion Crowdfunding Platform",
    description: "Support talented indie fashion designers and discover rare fashion.",
    images: [
      {
        url: "https://fashionindependent.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Fashion Independent",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Fashion Independent",
    description: "Support talented indie fashion designers and discover rare fashion.",
    images: ["https://fashionindependent.com/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <Script id="hydration-fix">{`
          (function() {
            var target = document.documentElement;
            new MutationObserver(function(mutations) {
              mutations.forEach(function(mutation) {
                if (mutation.target.nodeName === 'BODY') {
                  mutation.target.removeAttribute('data-new-gr-c-s-check-loaded');
                  mutation.target.removeAttribute('data-gr-ext-installed');
                }
              });
            }).observe(target, { 
              attributes: true, 
              subtree: true,
              attributeFilter: ['data-new-gr-c-s-check-loaded', 'data-gr-ext-installed']
            });
          })();
        `}</Script>
      </head>
      <body className={`font-sans antialiased`} suppressHydrationWarning={true}>
        <AuthProvider>
          <CartProvider>
            <PaymentProvider>
              <CampaignProvider>
                <PayoutProvider>
                  <AnalyticsProvider>
                    <AffiliateProvider>
                      <Header />
                      <main className="flex-1 pb-20 md:pb-0">{children}</main>
                      <div className="hidden md:block">
                        <Footer />
                      </div>
                      <MobileNav />
                    </AffiliateProvider>
                  </AnalyticsProvider>
                </PayoutProvider>
              </CampaignProvider>
            </PaymentProvider>
          </CartProvider>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics debug={false} />}
      </body>
    </html>
  )
}
