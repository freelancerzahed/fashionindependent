"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { User, Mail, Lock, Shield, CheckCircle, AlertCircle, Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RegistrationFormProps {
  userResponses: any
  onSubmit: (formData: any) => void
}

export default function RegistrationForm({ userResponses, onSubmit }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    bust: "",
    shoe_size: "",
    weight: "",
    height: "",
    bmi: "",
    age_range: "",
    gender: "",

    // Extra fields from BodyViewer
    shape: "",
    shape_keys: "",
    slider_values: "",
    alphanumeric_code: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [agreed, setAgreed] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form data with userResponses when component mounts or userResponses changes
  useEffect(() => {
    if (userResponses) {
      console.log("UserResponses received:", userResponses)

      setFormData((prev) => ({
        ...prev,
        name: userResponses.name || "",
        email: "",
        password: "",
        password_confirmation: "",
        bust: userResponses.braSize ? `${userResponses.braSize.vol}${userResponses.braSize.band}` : "",
        shoe_size: userResponses.shoeSize ? `${userResponses.shoeSize.size} ${userResponses.shoeSize.category}` : "",
        weight: userResponses.weight ? userResponses.weight.toString() : "",
        height: userResponses.height ? userResponses.height.toString() : "",
        bmi: userResponses.bmi || "",
        age_range: userResponses.age_range || "",
        gender: userResponses.gender || "",

        // extra from BodyViewer
        shape: userResponses.shape || "",
        shape_keys: userResponses.shape_keys || "",
        slider_values: userResponses.slider_values || "",
        alphanumeric_code: userResponses.alphanumeric_code || "",
      }))
    }
  }, [userResponses])

  // Calculate BMI whenever height or weight changes
  useEffect(() => {
    if (formData.height && formData.weight) {
      const heightInMeters = Number(formData.height) * 0.0254 // inches → meters
      const weightInKg = Number(formData.weight) * 0.453592 // lbs → kg
      const bmiValue = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1)
      setFormData((prev) => ({ ...prev, bmi: bmiValue }))
    } else if (userResponses?.bmi) {
      setFormData((prev) => ({ ...prev, bmi: userResponses.bmi }))
    }
  }, [formData.height, formData.weight, userResponses?.bmi])

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 25
    return strength
  }

  const getPasswordStrengthLabel = (strength: number) => {
    if (strength < 25) return { label: "Weak", color: "bg-red-500" }
    if (strength < 50) return { label: "Fair", color: "bg-orange-500" }
    if (strength < 75) return { label: "Good", color: "bg-yellow-500" }
    return { label: "Strong", color: "bg-green-500" }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!validateEmail(formData.email)) newErrors.email = "Please enter a valid email address"
    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"
    if (formData.password !== formData.password_confirmation)
      newErrors.password_confirmation = "Passwords do not match"
    if (!agreed) newErrors.agreement = "You must agree to the terms and conditions"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsSubmitting(true)
      setTimeout(() => {
        setIsSubmitting(false)
        onSubmit(formData) // ✅ Now includes extra fields
      }, 2000)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const passwordStrengthInfo = getPasswordStrengthLabel(passwordStrength)

  const completionPercentage = Math.round(
    (Object.values(formData).filter((value) => value.toString().trim() !== "").length /
      Object.keys(formData).length) *
      100
  )


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-7xl mx-auto">
        {/* Mobile Header */}
        <div className="sm:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-10 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-600" />
              </div>
              <h1 className="text-lg font-bold text-primary-600">Complete Profile</h1>
            </div>
            <div className="w-24">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-1" />
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:block text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary-600">Almost There!</h1>
              <p className="text-xs text-gray-600">Complete your Mirror Me Fashion profile</p>
            </div>
          </div>

          {/* Progress */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Profile Completion</span>
              <span>{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-1" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-12 sm:mt-0">
          {/* Left Column - Your Profile Summary */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="lg:sticky lg:top-4">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm text-primary-600 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Your Profile Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4">
                <div className="bg-primary-50 rounded p-3">
                  <h3 className="font-semibold text-xs text-primary-800 mb-1">Basic Information</h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <Badge variant="outline" className="text-xs">
                        {formData.name || "Not provided"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <Badge variant="outline" className="text-xs">
                        {formData.email || "Not provided"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age Range:</span>
                      <Badge variant="outline" className="text-xs">
                        {formData.age_range || "Not provided"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {formData.gender || "Not provided"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded p-3">
                  <h3 className="font-semibold text-xs text-blue-800 mb-1">Body Measurements</h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Height:</span>
                      <Badge variant="outline" className="text-xs">
                        {formData.height ? `${formData.height}"` : "Not provided"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weight:</span>
                      <Badge variant="outline" className="text-xs">
                        {formData.weight ? `${formData.weight} lbs` : "Not provided"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">BMI:</span>
                      <Badge variant="outline" className="text-xs">
                        {formData.bmi || "Not provided"}
                        {formData.bmi && (
                          <span className="ml-1 text-gray-500">({getBmiCategory(Number(formData.bmi))})</span>
                        )}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded p-3">
                  <h3 className="font-semibold text-xs text-purple-800 mb-1">Clothing Sizes</h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bust Size:</span>
                      <Badge variant="outline" className="text-xs">
                        {formData.bust || "Not provided"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shoe Size:</span>
                      <Badge variant="outline" className="text-xs">
                        {formData.shoe_size || "Not provided"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded p-3">
                  <div className="flex items-center gap-1 text-xs text-green-800">
                    <CheckCircle className="w-3 h-3" />
                    <span className="font-semibold">AI Profile Ready</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Column - Basic Information */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <Card className="border-0 sm:border shadow-none sm:shadow">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-bold text-primary-600">Basic Information</CardTitle>
              </CardHeader>

              <CardContent className="px-4 py-2">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="name" className="flex items-center gap-1 text-xs">
                      <User className="w-3 h-3" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={`mt-1 text-xs h-8 ${errors.name ? "border-red-500" : ""}`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center gap-1 text-xs">
                      <Mail className="w-3 h-3" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`mt-1 text-xs h-8 ${errors.email ? "border-red-500" : ""}`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="password" className="flex items-center gap-1 text-xs">
                      <Lock className="w-3 h-3" />
                      Password
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className={`pr-10 text-xs h-8 ${errors.password ? "border-red-500" : ""}`}
                        placeholder="Create a strong password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-8 w-8"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </Button>
                    </div>
                    {formData.password && (
                      <div className="mt-1">
                        <div className="flex items-center gap-1 mb-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-1">
                            <div
                              className={`h-1 rounded-full transition-all duration-300 ${passwordStrengthInfo.color}`}
                              style={{ width: `${passwordStrength}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">{passwordStrengthInfo.label}</span>
                        </div>
                      </div>
                    )}
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="password_confirmation" className="flex items-center gap-1 text-xs">
                      <Shield className="w-3 h-3" />
                      Confirm Password
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="password_confirmation"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.password_confirmation}
                        onChange={(e) => handleInputChange("password_confirmation", e.target.value)}
                        className={`pr-10 text-xs h-8 ${errors.password_confirmation ? "border-red-500" : ""}`}
                        placeholder="Confirm your password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-8 w-8"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </Button>
                    </div>
                    {formData.password_confirmation && formData.password === formData.password_confirmation && (
                      <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Passwords match
                      </p>
                    )}
                    {errors.password_confirmation && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.password_confirmation}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="age_range" className="flex items-center gap-1 text-xs">
                      <User className="w-3 h-3" />
                      Age Range
                    </Label>
                    <Select value={formData.age_range} onValueChange={(value) => handleInputChange("age_range", value)}>
                      <SelectTrigger className="mt-1 text-xs h-8">
                        <SelectValue placeholder="Select age range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Under 19">Under 19</SelectItem>
                        <SelectItem value="19 - 39">19 - 39</SelectItem>
                        <SelectItem value="40 - 64">40 - 64</SelectItem>
                        <SelectItem value="Over 65">Over 65</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="gender" className="flex items-center gap-1 text-xs">
                      <User className="w-3 h-3" />
                      Gender
                    </Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger className="mt-1 text-xs h-8">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Body Measurements */}
          <div className="lg:col-span-1 order-1 lg:order-3">
            <Card className="border-0 sm:border shadow-none sm:shadow">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-bold text-primary-800">Body Measurements</CardTitle>
              </CardHeader>

              <CardContent className="px-4 py-2">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="height" className="flex items-center gap-1 text-xs">
                      <User className="w-3 h-3" />
                      Height (inches)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      value={formData.height}
                      onChange={(e) => handleInputChange("height", e.target.value)}
                      className="mt-1 text-xs h-8"
                      placeholder="Enter height in inches"
                    />
                  </div>

                  <div>
                    <Label htmlFor="weight" className="flex items-center gap-1 text-xs">
                      <User className="w-3 h-3" />
                      Weight (lbs)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      value={formData.weight}
                      onChange={(e) => handleInputChange("weight", e.target.value)}
                      className="mt-1 text-xs h-8"
                      placeholder="Enter weight in pounds"
                    />
                  </div>

                  {formData.bmi && (
                    <div className="bg-blue-50 p-3 rounded">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-blue-800">Your BMI:</span>
                        <Badge variant="outline" className="text-xs">
                          {formData.bmi}
                          <span className="ml-1 text-gray-500">({getBmiCategory(Number(formData.bmi))})</span>
                        </Badge>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="bust" className="flex items-center gap-1 text-xs">
                      <User className="w-3 h-3" />
                      Bust Size
                    </Label>
                    <Input
                      id="bust"
                      value={formData.bust}
                      onChange={(e) => handleInputChange("bust", e.target.value)}
                      className="mt-1 text-xs h-8"
                      placeholder="e.g., 34C"
                    />
                  </div>

                  <div>
                    <Label htmlFor="shoe_size" className="flex items-center gap-1 text-xs">
                      <User className="w-3 h-3" />
                      Shoe Size
                    </Label>
                    <Input
                      id="shoe_size"
                      value={formData.shoe_size}
                      onChange={(e) => handleInputChange("shoe_size", e.target.value)}
                      className="mt-1 text-xs h-8"
                      placeholder="e.g., 8.5 womens"
                    />
                  </div>

                  <Separator className="my-3" />

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreement"
                      checked={agreed}
                      onCheckedChange={(checked) => setAgreed(checked as boolean)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <label htmlFor="agreement" className="text-xs text-gray-700 leading-tight">
                        I agree to the{" "}
                        <a href="#" className="text-primary-600 hover:underline">
                          Terms
                        </a>
                        ,{" "}
                        <a href="#" className="text-primary-600 hover:underline">
                          Privacy
                        </a>
                        , and{" "}
                        <a href="#" className="text-primary-600 hover:underline">
                          Cookie Policy
                        </a>
                        . I confirm I'm above 18.
                      </label>
                      {errors.agreement && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.agreement}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 text-sm font-semibold h-9"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Join Mirror Me Fashion
                        <ArrowRight className="ml-1 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to get BMI category
function getBmiCategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight"
  if (bmi < 25) return "Normal weight"
  if (bmi < 30) return "Overweight"
  return "Obese"
}
