import { Badge } from "@/components/ui/badge"

interface PaymentStatusBadgeProps {
  status: "pending" | "completed" | "shipped" | "delivered" | "failed" | "refunded"
  className?: string
}

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  const statusConfig = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
    completed: { bg: "bg-green-100", text: "text-green-800", label: "Completed" },
    shipped: { bg: "bg-blue-100", text: "text-blue-800", label: "Shipped" },
    delivered: { bg: "bg-emerald-100", text: "text-emerald-800", label: "Delivered" },
    failed: { bg: "bg-red-100", text: "text-red-800", label: "Failed" },
    refunded: { bg: "bg-gray-100", text: "text-gray-800", label: "Refunded" },
  }

  const config = statusConfig[status]

  return <Badge className={`${config.bg} ${config.text} ${className}`}>{config.label}</Badge>
}
