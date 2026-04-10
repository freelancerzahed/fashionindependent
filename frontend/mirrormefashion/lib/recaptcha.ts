// Google reCAPTCHA utility functions
export const loadReCaptcha = (siteKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("reCAPTCHA can only be loaded in browser environment"))
      return
    }

    // Check if reCAPTCHA is already loaded
    if (window.grecaptcha) {
      resolve()
      return
    }

    // Create script element
    const script = document.createElement("script")
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
    script.async = true
    script.defer = true

    script.onload = () => {
      // Wait for grecaptcha to be ready
      const checkReady = () => {
        if (window.grecaptcha && window.grecaptcha.ready) {
          window.grecaptcha.ready(() => {
            resolve()
          })
        } else {
          setTimeout(checkReady, 100)
        }
      }
      checkReady()
    }

    script.onerror = () => {
      reject(new Error("Failed to load reCAPTCHA script"))
    }

    document.head.appendChild(script)
  })
}

export const executeReCaptcha = (siteKey: string, action: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!window.grecaptcha) {
      reject(new Error("reCAPTCHA not loaded"))
      return
    }

    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(siteKey, { action })
        .then((token: string) => {
          resolve(token)
        })
        .catch((error: any) => {
          reject(error)
        })
    })
  })
}

// Type definitions for reCAPTCHA
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}
