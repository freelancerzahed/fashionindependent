import type { Metadata } from "next"
import "./globals.css"
import { Roboto } from "next/font/google"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import Providers from "./providers"

// Load Roboto from Google Fonts
const fontSans = Roboto({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "700"], // optional: define font weights you need
})

export const metadata: Metadata = {
  title: "E-commerce Social",
  description: "A social e-commerce platform",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
