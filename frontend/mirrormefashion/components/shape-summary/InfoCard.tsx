"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface InfoCardProps {
  icon: React.ReactNode
  title: string
  description?: string
  fields: { label: string; value: string | number; color?: string }[]
}

const InfoCard = ({ icon, title, description, fields }: InfoCardProps) => (
  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
    <CardHeader className="pb-4">
      <CardTitle className="flex items-center gap-3 text-xl">
        {icon} {title}
      </CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.label} className="p-4 bg-gray-50 rounded-xl">
            <div className="text-sm text-gray-600 mb-1">{field.label}</div>
            <div className={`text-lg font-semibold ${field.color || "text-gray-900"}`}>{field.value}</div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)

export default InfoCard
