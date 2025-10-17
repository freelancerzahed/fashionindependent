"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/lib/auth-context"

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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
    if (!formData.age || !formData.terms) {
      setError("Please agree to terms and confirm age")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      await signup(formData.email, formData.password, formData.name, formData.role)
      router.push("/dashboard")
    } catch (err) {
      setError("Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-neutral-50">
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Become a Member</h1>
                <p className="text-neutral-600">Join The Fashion Independent community</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Tell us about yourself</h2>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name*</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email address*</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password*</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone number*</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-3 pt-4">
                      <Label>I want to join as a:</Label>
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant={formData.role === "backer" ? "default" : "outline"}
                          className="flex-1"
                          onClick={() => handleRoleChange("backer")}
                        >
                          Backer
                        </Button>
                        <Button
                          type="button"
                          variant={formData.role === "creator" ? "default" : "outline"}
                          className="flex-1"
                          onClick={() => handleRoleChange("creator")}
                        >
                          Creator
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="age"
                          name="age"
                          checked={formData.age}
                          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, age: checked as boolean }))}
                        />
                        <label htmlFor="age" className="text-sm">
                          I am 18 years or older
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          name="terms"
                          checked={formData.terms}
                          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, terms: checked as boolean }))}
                        />
                        <label htmlFor="terms" className="text-sm">
                          I agree to the site terms and conditions
                        </label>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full" size="lg" onClick={() => setStep(2)}>
                    Next
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Review Your Information</h2>
                    <p className="text-neutral-600 text-sm">Please review your information before completing signup.</p>
                  </div>

                  <div className="space-y-3 bg-neutral-50 p-4 rounded">
                    <div>
                      <p className="text-sm text-neutral-600">Name</p>
                      <p className="font-semibold">{formData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Email</p>
                      <p className="font-semibold">{formData.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Role</p>
                      <p className="font-semibold capitalize">{formData.role}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button className="flex-1" onClick={handleSubmit} disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Complete Signup"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
