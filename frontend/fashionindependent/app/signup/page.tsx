"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { AlertCircle, Eye, EyeOff, CheckCircle, Smile } from "lucide-react"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    ageRange: "",
    email: "",
    password: "",
    role: "backer" as "backer" | "creator",
    age: false,
    terms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { signup } = useAuth()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleRoleChange = (role: "backer" | "creator") => {
    setFormData((prev) => ({ ...prev, role }))
  }

  const handleSubmit = async () => {
    // Validate all required fields
    if (!formData.name.trim()) {
      setError("Name is required")
      return
    }
    if (!formData.gender) {
      setError("Please select your gender")
      return
    }
    if (!formData.ageRange) {
      setError("Please select your age range")
      return
    }
    if (!formData.email.trim()) {
      setError("Email is required")
      return
    }
    if (!formData.password) {
      setError("Password is required")
      return
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    if (!formData.age) {
      setError("Please confirm you are 18 years or older")
      return
    }
    if (!formData.terms) {
      setError("Please agree to the terms and conditions")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      await signup(formData.email, formData.password, formData.name, formData.role)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <main className="flex-1">
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto bg-white rounded-lg p-8">
              <div className="w-12 h-12 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Smile className="w-6 h-6 text-white" />
              </div>
              {/* Header with sign in link */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-4">Become a Member</h1>
                <p className="text-sm text-neutral-600 mb-2">
                  Existing members{" "}
                  <Link href="/login" className="text-blue-600 hover:underline">
                    sign in here
                  </Link>
                </p>
                <p className="text-neutral-600 mt-2">Join The Fashion Independent</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>
              )}

              {/* Role selection */}
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold text-neutral-800 mb-3">I want to join as:</p>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      className={`flex-1 h-10 font-medium transition-colors ${
                        formData.role === "backer"
                          ? "bg-black text-white hover:bg-neutral-800"
                          : "bg-white text-black border border-neutral-300 hover:bg-neutral-50"
                      }`}
                      onClick={() => handleRoleChange("backer")}
                    >
                      Backer
                    </Button>
                    <Button
                      type="button"
                      className={`flex-1 h-10 font-medium transition-colors ${
                        formData.role === "creator"
                          ? "bg-black text-white hover:bg-neutral-800"
                          : "bg-white text-black border border-neutral-300 hover:bg-neutral-50"
                      }`}
                      onClick={() => handleRoleChange("creator")}
                    >
                      Creator
                    </Button>
                  </div>
                </div>

                {/* Form fields */}
                <div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-neutral-800">
                        Name*
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="border border-neutral-200 bg-neutral-50 focus:bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-sm font-medium text-neutral-800">
                        Select your gender
                      </Label>
                      <Select value={formData.gender} onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}>
                        <SelectTrigger className="w-full border border-neutral-200 bg-neutral-50">
                          <SelectValue placeholder="Choose gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="non-binary">Non-binary</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ageRange" className="text-sm font-medium text-neutral-800">
                        Select your age
                      </Label>
                      <Select value={formData.ageRange} onValueChange={(value) => setFormData((prev) => ({ ...prev, ageRange: value }))}>
                        <SelectTrigger className="w-full border border-neutral-200 bg-neutral-50">
                          <SelectValue placeholder="Choose age range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="18-24">18–24</SelectItem>
                          <SelectItem value="25-34">25–34</SelectItem>
                          <SelectItem value="35-44">35–44</SelectItem>
                          <SelectItem value="45-64">45–64</SelectItem>
                          <SelectItem value="65plus">65+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-neutral-800">
                        Email address*
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="border border-neutral-200 bg-neutral-50 focus:bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-neutral-800">
                        Password*
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="border border-neutral-200 bg-neutral-50 focus:bg-white"
                      />
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-3 pt-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="age"
                          name="age"
                          checked={formData.age}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({ ...prev, age: checked as boolean }))
                          }
                        />
                        <label htmlFor="age" className="text-sm text-neutral-700 cursor-pointer">
                          I am 18 years or older
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          name="terms"
                          checked={formData.terms}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({ ...prev, terms: checked as boolean }))
                          }
                        />
                        <label htmlFor="terms" className="text-sm text-neutral-700 cursor-pointer">
                          I agree to the site terms and conditions
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <Button
                  className="w-full bg-black text-white hover:bg-neutral-800 h-12 text-base font-semibold"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Next"}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
