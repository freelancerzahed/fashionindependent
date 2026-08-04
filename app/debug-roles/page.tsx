"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DebugRolesPage() {
  const [message, setMessage] = useState("")
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      setUserData(JSON.parse(user))
    }
  }, [])

  const addBothRoles = () => {
    const userStr = localStorage.getItem("user")
    if (!userStr) {
      setMessage("❌ No user found in localStorage. Please log in first.")
      return
    }

    try {
      const user = JSON.parse(userStr)
      // Add both creator and backer roles
      user.roles = ["creator", "backer"]
      user.role = "creator" // Keep primary role as creator
      
      localStorage.setItem("user", JSON.stringify(user))
      setUserData(user)
      setMessage("✅ Successfully added both 'creator' and 'backer' roles to your account!")
      
      // Refresh page after 2 seconds to see toggle buttons
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1500)
    } catch (error) {
      setMessage("❌ Error updating roles: " + String(error))
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg p-8 border border-neutral-200">
          <h1 className="text-3xl font-bold mb-6">Debug: Add Dual Roles</h1>
          
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Current Logged-in User:</strong>
              </p>
              {userData ? (
                <div className="mt-3 space-y-2 text-sm">
                  <p><strong>Name:</strong> {userData.name}</p>
                  <p><strong>Email:</strong> {userData.email}</p>
                  <p><strong>ID:</strong> {userData.id}</p>
                  <p><strong>Role:</strong> {userData.role}</p>
                  <p><strong>Roles Array:</strong> {userData.roles ? userData.roles.join(", ") : "None"}</p>
                </div>
              ) : (
                <p className="mt-2 text-sm text-neutral-600">Not logged in or localStorage is empty</p>
              )}
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-900">
                Click the button below to add both 'creator' and 'backer' roles to your account. 
                This will enable the dashboard role toggle buttons.
              </p>
            </div>

            {message && (
              <div className={`p-4 rounded-lg ${
                message.includes("✅") 
                  ? "bg-green-50 border border-green-200 text-green-900" 
                  : "bg-red-50 border border-red-200 text-red-900"
              }`}>
                <p className="text-sm">{message}</p>
              </div>
            )}

            <div className="flex gap-4">
              <Button 
                onClick={addBothRoles}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add Both Roles
              </Button>
              <Link href="/dashboard">
                <Button variant="outline">
                  Back to Dashboard
                </Button>
              </Link>
            </div>

            <div className="p-4 bg-neutral-100 rounded-lg">
              <h3 className="font-semibold text-sm mb-2">What does this do?</h3>
              <ul className="text-sm text-neutral-700 space-y-2">
                <li>✓ Adds both 'creator' and 'backer' roles to your account</li>
                <li>✓ Enables the role toggle buttons on the dashboard</li>
                <li>✓ Lets you switch between Creator and Backer dashboard views</li>
                <li>✓ Stores your role preference in localStorage</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
