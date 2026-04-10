"use client"

import RegistrationForm from "@/components/registration-form"

interface RegistrationSectionProps {
  isMobile: boolean
  userResponses: any
  handleRegistrationSubmit: (formData: any) => void
}

export default function RegistrationSection({
  isMobile,
  userResponses,
  handleRegistrationSubmit,
}: RegistrationSectionProps) {
  if (isMobile) {
    return (
      <section id="registrationSection" className="min-h-screen bg-gradient-to-br from-primary-100 to-white">
        <div className="min-h-screen relative overflow-hidden safe-area-inset-top">
          {/* Background decorations */}
          <div className="absolute inset-0">
            <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-primary-100 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/3 left-1/3 w-56 h-56 bg-primary-200 rounded-full blur-2xl"></div>
          </div>

          {userResponses && (
            <div className="relative z-10">
              <RegistrationForm userResponses={userResponses} onSubmit={handleRegistrationSubmit} />
            </div>
          )}
        </div>
      </section>
    )
  }

  // Desktop version
  return (
    <section
      id="registrationSection"
      className="min-w-full h-full snap-center bg-gradient-to-br from-primary-100 to-white"
    >
      <div className="h-full relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-primary-100 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/3 w-56 h-56 bg-primary-200 rounded-full blur-2xl"></div>
        </div>

        {userResponses && (
          <div className="relative z-10">
            <RegistrationForm userResponses={userResponses} onSubmit={handleRegistrationSubmit} />
          </div>
        )}
      </div>
    </section>
  )
}
