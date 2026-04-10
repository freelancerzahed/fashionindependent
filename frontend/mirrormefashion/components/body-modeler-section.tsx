import BodyViewer from "@/components/body-viewer"

interface BodyModelerSectionProps {
  isMobile: boolean
  userResponses: any
  handleBodyModelerComplete: (bodyData: any) => void  // ✅ now expects bodyData
}

export default function BodyModelerSection({
  isMobile,
  userResponses,
  handleBodyModelerComplete,
}: BodyModelerSectionProps) {
  if (isMobile) {
    return (
      <section id="bodyModelerSection" className="min-h-screen bg-gradient-to-br from-primary-100 to-white">
        <div className="min-h-screen relative overflow-hidden">
          {userResponses && (
            <div className="relative z-10 min-h-screen">
              <BodyViewer userResponses={userResponses} onComplete={handleBodyModelerComplete} />
            </div>
          )}
        </div>
      </section>
    )
  }

  // Desktop version
  return (
    <section
      id="bodyModelerSection"
      className="min-w-full h-full snap-center bg-gradient-to-br from-primary-100 to-white"
    >
      <div className="h-full relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-200 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary-200 rounded-full blur-2xl"></div>
        </div>

        {userResponses && (
          <div className="relative z-10 h-full">
            <BodyViewer userResponses={userResponses} onComplete={handleBodyModelerComplete} />
          </div>
        )}
      </div>
    </section>
  )
}
