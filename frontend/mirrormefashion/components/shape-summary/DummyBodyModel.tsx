"use client"

const DummyBodyModel = ({ shapeType }: { shapeType: string }) => (
  <div className="w-full h-full flex items-center justify-center">
    <svg width="200" height="350" viewBox="0 0 200 350" className="text-gray-400" fill="currentColor">
      {/* Head */}
      <ellipse cx="100" cy="40" rx="25" ry="30" fill="#e5e7eb" />

      {/* Neck */}
      <rect x="90" y="65" width="20" height="15" fill="#e5e7eb" />

      {/* Torso */}
      <path
        d="M 70 80 Q 60 120 65 160 Q 70 200 80 240 L 120 240 Q 130 200 135 160 Q 140 120 130 80 Z"
        fill="#f3f4f6"
        stroke="#d1d5db"
        strokeWidth="2"
      />

      {/* Arms */}
      <ellipse cx="50" cy="130" rx="12" ry="40" fill="#e5e7eb" />
      <ellipse cx="150" cy="130" rx="12" ry="40" fill="#e5e7eb" />

      {/* Legs */}
      <rect x="80" y="240" width="15" height="80" fill="#e5e7eb" />
      <rect x="105" y="240" width="15" height="80" fill="#e5e7eb" />

      {/* Feet */}
      <ellipse cx="87" cy="330" rx="15" ry="8" fill="#d1d5db" />
      <ellipse cx="113" cy="330" rx="15" ry="8" fill="#d1d5db" />

      {/* Shape Type */}
      <text x="100" y="300" textAnchor="middle" className="text-xs fill-gray-600" fontSize="12">
        {shapeType}
      </text>
    </svg>
  </div>
)

export default DummyBodyModel
