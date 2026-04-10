"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { loadReCaptcha, executeReCaptcha } from "@/lib/recaptcha"

interface ReCaptchaContextType {
  isLoaded: boolean
  executeRecaptcha: (action: string) => Promise<string | null>
  error: string | null
}

const ReCaptchaContext = createContext<ReCaptchaContextType | undefined>(undefined)

interface ReCaptchaProviderProps {
  children: ReactNode
  siteKey: string
}

export function ReCaptchaProvider({ children, siteKey }: ReCaptchaProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!siteKey) {
      setError("reCAPTCHA site key is required")
      return
    }

    loadReCaptcha(siteKey)
      .then(() => {
        setIsLoaded(true)
        setError(null)
      })
      .catch((err) => {
        setError(err.message)
        setIsLoaded(false)
      })
  }, [siteKey])

  const executeRecaptcha = async (action: string): Promise<string | null> => {
    if (!isLoaded) {
      throw new Error("reCAPTCHA not loaded yet")
    }

    try {
      const token = await executeReCaptcha(siteKey, action)
      return token
    } catch (err) {
      console.error("reCAPTCHA execution failed:", err)
      return null
    }
  }

  return <ReCaptchaContext.Provider value={{ isLoaded, executeRecaptcha, error }}>{children}</ReCaptchaContext.Provider>
}

export function useReCaptcha() {
  const context = useContext(ReCaptchaContext)
  if (context === undefined) {
    throw new Error("useReCaptcha must be used within a ReCaptchaProvider")
  }
  return context
}
