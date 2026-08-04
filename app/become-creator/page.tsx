"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function BecomeCreatorPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/signup?role=creator")
  }, [router])

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="text-center">
        <p className="text-lg font-medium text-neutral-700">Redirecting you to the creative signup flow...</p>
      </div>
    </main>
  )
}
