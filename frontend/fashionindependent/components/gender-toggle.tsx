import { Button } from "@/components/ui/button"

interface GenderToggleProps {
  gender: "male" | "female"
  onToggle: (gender: "male" | "female") => void
}

export function GenderToggle({ gender, onToggle }: GenderToggleProps) {
  const options = [
    { value: "female", label: "Female", icon: "👩" },
    { value: "male", label: "Male", icon: "👨" },
  ]

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted">
      {options.map(({ value, label, icon }) => (
        <Button
          key={value}
          variant={gender === value ? "default" : "outline"}
          size="sm"
          onClick={() => onToggle(value as "male" | "female")}
          className="flex items-center gap-2"
        >
          <span className="text-lg">{icon}</span>
          {label}
        </Button>
      ))}
    </div>
  )
}