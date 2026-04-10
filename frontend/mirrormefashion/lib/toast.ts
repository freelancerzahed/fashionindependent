import { toast as sonnerToast } from "sonner"
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react"

// Enhanced toast with smooth animations and better UX
export const toast = {
  success: (message: string, description?: string) => {
    sonnerToast.success(message, {
      description,
      icon: CheckCircle,
      duration: 4000,
      style: {
        background: "#f0fdf4",
        border: "1px solid #bbf7d0",
        color: "#166534",
      },
    })
  },

  error: (message: string, description?: string) => {
    sonnerToast.error(message, {
      description,
      icon: XCircle,
      duration: 5000,
      style: {
        background: "#fef2f2",
        border: "1px solid #fecaca",
        color: "#dc2626",
      },
    })
  },

  warning: (message: string, description?: string) => {
    sonnerToast.warning(message, {
      description,
      icon: AlertCircle,
      duration: 4500,
      style: {
        background: "#fffbeb",
        border: "1px solid #fed7aa",
        color: "#d97706",
      },
    })
  },

  info: (message: string, description?: string) => {
    sonnerToast.info(message, {
      description,
      icon: Info,
      duration: 4000,
      style: {
        background: "#eff6ff",
        border: "1px solid #bfdbfe",
        color: "#2563eb",
      },
    })
  },

  // For cart actions with brand color styling
  cart: (message: string, description?: string) => {
    sonnerToast.success(message, {
      description,
      duration: 3000,
      style: {
        background: "#dc2626",
        border: "1px solid #dc2626",
        color: "white",
      },
    })
  },
}
