"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  MessageSquare,
  Star,
  Send,
  CheckCircle,
  Upload,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Zap,
  Navigation,
  Bug,
  Heart,
  RotateCcw,
  FileUp,
} from "lucide-react"

interface FeedbackData {
  fullName: string
  email: string
  deviceType: string
  browser: string
  operatingSystem: string
  homePageSpeed: string
  blogPageSpeed: string
  siteSpeed: string
  navigationAbility: string
  encounteredErrors: string[]
  overallExperience: string
  likeToUse: string
  shapeAIUsage: string[]
  bodyModelFeedback: string
  likelihoodRevisit: string
  additionalFeedback: string
  uploadedFile: File | null
  otherFeedback: string
}

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<FeedbackData>({
    fullName: "",
    email: "",
    deviceType: "",
    browser: "",
    operatingSystem: "",
    homePageSpeed: "",
    blogPageSpeed: "",
    siteSpeed: "",
    navigationAbility: "",
    encounteredErrors: [],
    overallExperience: "",
    likeToUse: "",
    shapeAIUsage: [],
    bodyModelFeedback: "",
    likelihoodRevisit: "",
    additionalFeedback: "",
    uploadedFile: null,
    otherFeedback: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setSubmitted(true)

    // Reset form after 5 seconds
    setTimeout(() => {
      setSubmitted(false)
      setCurrentStep(1)
      setFeedback({
        fullName: "",
        email: "",
        deviceType: "",
        browser: "",
        operatingSystem: "",
        homePageSpeed: "",
        blogPageSpeed: "",
        siteSpeed: "",
        navigationAbility: "",
        encounteredErrors: [],
        overallExperience: "",
        likeToUse: "",
        shapeAIUsage: [],
        bodyModelFeedback: "",
        likelihoodRevisit: "",
        additionalFeedback: "",
        uploadedFile: null,
        otherFeedback: "",
      })
    }, 5000)
  }

  const handleErrorToggle = (error: string) => {
    setFeedback((prev) => ({
      ...prev,
      encounteredErrors: prev.encounteredErrors.includes(error)
        ? prev.encounteredErrors.filter((e) => e !== error)
        : [...prev.encounteredErrors, error],
    }))
  }

  const handleShapeAIToggle = (usage: string) => {
    setFeedback((prev) => ({
      ...prev,
      shapeAIUsage: prev.shapeAIUsage.includes(usage)
        ? prev.shapeAIUsage.filter((u) => u !== usage)
        : [...prev.shapeAIUsage, usage],
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFeedback((prev) => ({ ...prev, uploadedFile: file }))
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-gray-50 p-4">
        <Card className="w-full max-w-md text-center shadow-2xl border-0 bg-gradient-to-br from-white to-red-50">
          <CardContent className="p-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Thank You!</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Your feedback has been submitted successfully. We appreciate you taking the time to help us improve Mirror
              Me Fashion.
            </p>
            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 text-sm font-medium">
              Beta Feedback Received
            </Badge>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8 pb-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-full shadow-lg">
            <MessageSquare className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Mirror Me Fashion</h1>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2 bg-gray-100 text-gray-700">
            Beta Feedback
          </Badge>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Welcome to the Beta launch of the world's first{" "}
            <span className="font-semibold text-red-600">AI-Powered Virtual Fashion Stylist</span>. Your feedback is
            invaluable!
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-red-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-red-600">
                {currentStep} of {totalSteps}
              </span>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="h-3" />
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Monitor className="h-6 w-6" />
                  Tell Us About Yourself
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="fullName" className="text-base font-medium">
                      Full Name (Optional)
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={feedback.fullName}
                      onChange={(e) => setFeedback({ ...feedback, fullName: e.target.value })}
                      className="h-12 border-2 focus:border-red-500"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-base font-medium">
                      Email Address (Optional)
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={feedback.email}
                      onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
                      className="h-12 border-2 focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-base font-medium">What type of device did you use to view the site?</Label>
                    <RadioGroup
                      value={feedback.deviceType}
                      onValueChange={(value) => setFeedback({ ...feedback, deviceType: value })}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors">
                        <RadioGroupItem value="computer" id="computer" />
                        <Monitor className="h-5 w-5 text-red-600" />
                        <Label htmlFor="computer" className="cursor-pointer">
                          Computer/Desktop/Laptop
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors">
                        <RadioGroupItem value="tablet" id="tablet" />
                        <Tablet className="h-5 w-5 text-red-600" />
                        <Label htmlFor="tablet" className="cursor-pointer">
                          Tablet
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors">
                        <RadioGroupItem value="phone" id="phone" />
                        <Smartphone className="h-5 w-5 text-red-600" />
                        <Label htmlFor="phone" className="cursor-pointer">
                          Phone
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-medium">What browser did you use to view the site?</Label>
                    <RadioGroup
                      value={feedback.browser}
                      onValueChange={(value) => setFeedback({ ...feedback, browser: value })}
                      className="grid grid-cols-2 md:grid-cols-3 gap-4"
                    >
                      {["Chrome", "Firefox", "Edge", "Internet Explorer", "Safari", "Other"].map((browser) => (
                        <div
                          key={browser}
                          className="flex items-center space-x-3 p-3 border-2 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
                        >
                          <RadioGroupItem value={browser.toLowerCase()} id={browser.toLowerCase()} />
                          <Globe className="h-4 w-4 text-red-600" />
                          <Label htmlFor={browser.toLowerCase()} className="cursor-pointer text-sm">
                            {browser}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-medium">Do you know your operating system?</Label>
                    <RadioGroup
                      value={feedback.operatingSystem}
                      onValueChange={(value) => setFeedback({ ...feedback, operatingSystem: value })}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors">
                        <RadioGroupItem value="yes" id="os-yes" />
                        <Label htmlFor="os-yes" className="cursor-pointer">
                          Yes, I know it
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors">
                        <RadioGroupItem value="no" id="os-no" />
                        <Label htmlFor="os-no" className="cursor-pointer">
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Performance Feedback */}
          {currentStep === 2 && (
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Zap className="h-6 w-6" />
                  Performance & Navigation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {[
                  {
                    key: "homePageSpeed",
                    label: "I would describe the loading speed for the home page as:",
                    icon: <Star className="h-5 w-5" />,
                  },
                  {
                    key: "blogPageSpeed",
                    label: "I would describe the loading speed for the blog page as:",
                    icon: <Star className="h-5 w-5" />,
                  },
                  {
                    key: "siteSpeed",
                    label: "I would describe the loading speed for the site page as:",
                    icon: <Star className="h-5 w-5" />,
                  },
                ].map((item) => (
                  <div key={item.key} className="space-y-4">
                    <Label className="text-base font-medium flex items-center gap-2">
                      {item.icon}
                      {item.label}
                    </Label>
                    <RadioGroup
                      value={feedback[item.key as keyof FeedbackData] as string}
                      onValueChange={(value) => setFeedback({ ...feedback, [item.key]: value })}
                      className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                      {["Fast", "Average", "Slow", "I don't know"].map((speed) => (
                        <div
                          key={speed}
                          className="flex items-center space-x-3 p-3 border-2 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
                        >
                          <RadioGroupItem
                            value={speed.toLowerCase().replace(" ", "-")}
                            id={`${item.key}-${speed.toLowerCase().replace(" ", "-")}`}
                          />
                          <Label
                            htmlFor={`${item.key}-${speed.toLowerCase().replace(" ", "-")}`}
                            className="cursor-pointer text-sm"
                          >
                            {speed}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}

                <div className="space-y-4">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Navigation className="h-5 w-5" />
                    My ability to navigate the website was:
                  </Label>
                  <RadioGroup
                    value={feedback.navigationAbility}
                    onValueChange={(value) => setFeedback({ ...feedback, navigationAbility: value })}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                  >
                    {["Superb", "Good", "Unsatisfactory", "I don't know"].map((ability) => (
                      <div
                        key={ability}
                        className="flex items-center space-x-3 p-3 border-2 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
                      >
                        <RadioGroupItem
                          value={ability.toLowerCase().replace(" ", "-")}
                          id={`nav-${ability.toLowerCase().replace(" ", "-")}`}
                        />
                        <Label
                          htmlFor={`nav-${ability.toLowerCase().replace(" ", "-")}`}
                          className="cursor-pointer text-sm"
                        >
                          {ability}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Bug className="h-5 w-5" />I found an error/problem/bug:
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["Error (with code)", "Broken page/function", "Typo"].map((error) => (
                      <div
                        key={error}
                        className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
                      >
                        <Checkbox
                          id={`error-${error.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                          checked={feedback.encounteredErrors.includes(error)}
                          onCheckedChange={() => handleErrorToggle(error)}
                        />
                        <Label
                          htmlFor={`error-${error.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                          className="cursor-pointer"
                        >
                          {error}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Experience & AI Features */}
          {currentStep === 3 && (
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Heart className="h-6 w-6" />
                  Experience & AI Features
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <Label className="text-base font-medium">My overall experience was:</Label>
                  <Textarea
                    placeholder="Your response here..."
                    value={feedback.overallExperience}
                    onChange={(e) => setFeedback({ ...feedback, overallExperience: e.target.value })}
                    className="min-h-[100px] border-2 focus:border-red-500"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium">I'd like to use this from Mirror Me Fashion:</Label>
                  <Textarea
                    placeholder="Your response here..."
                    value={feedback.likeToUse}
                    onChange={(e) => setFeedback({ ...feedback, likeToUse: e.target.value })}
                    className="min-h-[100px] border-2 focus:border-red-500"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium">Using the ShapeAI/AI Body Modeler was:</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Impossible - it did not work",
                      "Difficult - it required work, though",
                      "Confusing - How do I use it?",
                      "It was okay - I figured it out",
                      "Super easy",
                    ].map((usage) => (
                      <div
                        key={usage}
                        className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
                      >
                        <Checkbox
                          id={`shape-${usage.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                          checked={feedback.shapeAIUsage.includes(usage)}
                          onCheckedChange={() => handleShapeAIToggle(usage)}
                        />
                        <Label
                          htmlFor={`shape-${usage.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                          className="cursor-pointer text-sm"
                        >
                          {usage}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    The body model that I constructed represents my own body shape:
                  </Label>
                  <RadioGroup
                    value={feedback.bodyModelFeedback}
                    onValueChange={(value) => setFeedback({ ...feedback, bodyModelFeedback: value })}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    {["Strongly agree", "Neither agree nor disagree", "Strongly disagree"].map((feedback_option) => (
                      <div
                        key={feedback_option}
                        className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
                      >
                        <RadioGroupItem
                          value={feedback_option.toLowerCase().replace(" ", "-")}
                          id={`body-${feedback_option.toLowerCase().replace(" ", "-")}`}
                        />
                        <Label
                          htmlFor={`body-${feedback_option.toLowerCase().replace(" ", "-")}`}
                          className="cursor-pointer text-sm"
                        >
                          {feedback_option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium">My likelihood of revisiting Mirror Me Fashion is:</Label>
                  <RadioGroup
                    value={feedback.likelihoodRevisit}
                    onValueChange={(value) => setFeedback({ ...feedback, likelihoodRevisit: value })}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    {[
                      "Strong - I want to see where this goes!",
                      "Meh - maybe I'll check you out later",
                      "Unlikely - this isn't my thing",
                    ].map((likelihood) => (
                      <div
                        key={likelihood}
                        className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
                      >
                        <RadioGroupItem
                          value={likelihood.toLowerCase().replace(/[^a-z0-9]/g, "-")}
                          id={`revisit-${likelihood.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                        />
                        <Label
                          htmlFor={`revisit-${likelihood.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                          className="cursor-pointer text-sm"
                        >
                          {likelihood}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Additional Feedback */}
          {currentStep === 4 && (
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <FileUp className="h-6 w-6" />
                  Additional Feedback
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <Label htmlFor="file-upload" className="text-base font-medium">
                    Attach one or more files:
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-400 transition-colors">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <div className="space-y-2">
                      <Label
                        htmlFor="file-upload"
                        className="cursor-pointer text-red-600 hover:text-red-700 font-medium"
                      >
                        Choose File
                      </Label>
                      <p className="text-sm text-gray-500">or drag and drop files here</p>
                      <Input id="file-upload" type="file" onChange={handleFileUpload} className="hidden" multiple />
                    </div>
                    {feedback.uploadedFile && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700">File uploaded: {feedback.uploadedFile.name}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="other-feedback" className="text-base font-medium">
                    Do you have other feedback?
                  </Label>
                  <Textarea
                    id="other-feedback"
                    placeholder="Your response here..."
                    value={feedback.otherFeedback}
                    onChange={(e) => setFeedback({ ...feedback, otherFeedback: e.target.value })}
                    className="min-h-[120px] border-2 focus:border-red-500"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="additional-feedback" className="text-base font-medium">
                    Additional feedback or comments:
                  </Label>
                  <Textarea
                    id="additional-feedback"
                    placeholder="Share any additional thoughts, suggestions, or experiences..."
                    value={feedback.additionalFeedback}
                    onChange={(e) => setFeedback({ ...feedback, additionalFeedback: e.target.value })}
                    className="min-h-[120px] border-2 focus:border-red-500"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 border-2 hover:bg-gray-50 bg-transparent"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-4">
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg"
                >
                  Next Step
                  <Send className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Feedback
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>

        {/* Tips Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />💡 Tips for Great Beta Feedback
            </h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Be specific about your experience with the AI-powered features</li>
              <li>• Mention any issues with the virtual fashion stylist or body modeler</li>
              <li>• Include details about device performance and loading times</li>
              <li>• Share what features you'd like to see in the final version</li>
              <li>• Upload screenshots if you encountered any visual issues</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
