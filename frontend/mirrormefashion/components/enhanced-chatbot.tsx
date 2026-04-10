"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Send, Bot, Sparkles, User, CheckCircle } from "lucide-react"
import HeightPopup from "@/components/height-popup"
import WeightPopup from "@/components/weight-popup"
import BraSizePopup from "@/components/bra-size-popup"

interface UserResponses {
  gender: string
  name: string
  age_range: string
  height: number
  weight: number
  bmi: string
  shoeSize: {
    size: number
    category: string
  }
  braSize: {
    vol: string
    band: string
  }
}

interface ChatbotProps {
  onComplete: (responses: UserResponses) => void
  onReset?: () => void
  isMobile?: boolean
}

interface Message {
  sender: "user" | "bot"
  text: string
  timestamp: Date
  suggestions?: string[]
  showAgeSelector?: boolean
}

export default function EnhancedChatbot({ onComplete, onReset, isMobile = false }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hi there! I'm Sophia, your AI-powered Virtual Fashion Stylist. I'm here to help you discover fashion that fits and flatters your unique body type. Let's start by telling me your gender.",
      timestamp: new Date(),
      suggestions: ["female", "male", "non-binary"],
    },
  ])

  const [userInput, setUserInput] = useState("")
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [isTyping, setIsTyping] = useState(false)
  const [selectedAge, setSelectedAge] = useState("")
  const [showHeightCalculator, setShowHeightCalculator] = useState(false)
  const [showWeightCalculator, setShowWeightCalculator] = useState(false)
  const [showBraSizeCalculator, setShowBraSizeCalculator] = useState(false)
  const [userResponses, setUserResponses] = useState<UserResponses>({
    gender: "",
    name: "",
    age_range: "",
    height: 0,
    weight: 0,
    bmi: "",
    shoeSize: { size: 0, category: "" },
    braSize: { vol: "", band: "" },
  })

  const handleReset = () => {
    setMessages([
      {
        sender: "bot",
        text: "Hi there! I'm Sophia, your AI-powered Virtual Fashion Stylist. I'm here to help you discover fashion that fits and flatters your unique body type. Let's start by telling me your gender.",
        timestamp: new Date(),
        suggestions: ["female", "male", "non-binary"],
      },
    ])
    setUserInput("")
    setCurrentQuestion(1)
    setIsTyping(false)
    setSelectedAge("")
    setShowHeightCalculator(false)
    setShowWeightCalculator(false)
    setShowBraSizeCalculator(false)
    setUserResponses({
      gender: "",
      name: "",
      age_range: "",
      height: 0,
      weight: 0,
      bmi: "",
      shoeSize: { size: 0, category: "" },
      braSize: { vol: "", band: "" },
    })

    if (onReset) {
      onReset()
    }
  }

  const handleHeightSelect = (value: string) => {
    const cleanedValue = value.replace(/\(.*?\)/g, "").trim()
    addMessage("user", value)
    const { text, suggestions } = processHeightInput(cleanedValue)
    addMessage("bot", text, suggestions)

    const heightMatch = cleanedValue.match(/(\d+\.?\d*)/)
    if (heightMatch) {
      const number = parseFloat(heightMatch[1])
      let heightInInches = number

      if (cleanedValue.includes("cm")) {
        heightInInches = number / 2.54
      } else if (cleanedValue.includes("'")) {
        const parts = cleanedValue.split("'")
        const feet = parseFloat(parts[0])
        const inches = parseFloat(parts[1] || "0")
        heightInInches = feet * 12 + inches
      }

      if (heightInInches >= 58 && heightInInches <= 95) {
        setCurrentQuestion(5)
        setShowHeightCalculator(false)
      }
    }
  }

  const handleWeightSelect = (value: string) => {
    const cleanedValue = value.replace(/\(.*?\)/g, "").trim()
    addMessage("user", value)
    const { text, suggestions } = processWeightInput(cleanedValue)
    addMessage("bot", text, suggestions)

    const weightMatch = cleanedValue.match(/(\d+\.?\d*)\s*(lbs?|pounds?|kgs?|kilograms?)/i)
    if (weightMatch) {
      let weight = parseFloat(weightMatch[1])
      const unit = weightMatch[2].toLowerCase()

      if (unit.includes("kg") || unit.includes("kilo")) {
        weight = weight * 2.205
      }

      if (weight >= 90 && weight <= 400) {
        setCurrentQuestion(6)
        setShowWeightCalculator(false)
      }
    }
  }

  const handleBraSizeSelect = (value: string) => {
    const cleanedValue = value.trim()
    addMessage("user", cleanedValue)
    const { text, suggestions } = userResponses.gender === "non-binary" && !userResponses.braSize.vol
      ? processNonBinaryBraQuestion(cleanedValue)
      : processBraSizeInput(cleanedValue)
    addMessage("bot", text, suggestions)

    const braMatch = cleanedValue.match(/(\d+)([A-Z]+)/i)
    let isValidBraSize = false
    if (braMatch) {
      const vol = parseInt(braMatch[1])
      const band = braMatch[2].toUpperCase()
      const validBands = ["AAA", "AA", "A", "B", "C", "D", "DD", "DDD", "E", "F", "G", "H", "HH", "HHH", "I", "J", "K", "L", "M", "N", "O"]
      if (vol >= 28 && vol <= 56 && validBands.includes(band) && !cleanedValue.includes(".")) {
        isValidBraSize = true
      }
    }

    if (braMatch && isValidBraSize) {
      setCurrentQuestion(8)
      setShowBraSizeCalculator(false)
    }
  }

  const chatBodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    try {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        })
        return
      }

      if (chatBodyRef.current) {
        const scrollHeight = chatBodyRef.current.scrollHeight
        const height = chatBodyRef.current.clientHeight
        const maxScrollTop = scrollHeight - height
        chatBodyRef.current.scrollTo({
          top: maxScrollTop,
          behavior: "smooth",
        })
      }
    } catch (error) {
      console.error("Scroll error:", error)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom()
    }, 100)
    return () => clearTimeout(timer)
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => {
        scrollToBottom()
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isTyping, scrollToBottom])

  useEffect(() => {
    if (inputRef.current && currentQuestion !== 3) {
      inputRef.current.focus()
    }
  }, [currentQuestion])

  const addMessage = (
    sender: "user" | "bot",
    text: string | string[],
    suggestions?: string[],
    showAgeSelector?: boolean,
  ) => {
    const newMessages = Array.isArray(text)
      ? text.map((t, index) => ({
          sender,
          text: t,
          timestamp: new Date(),
          suggestions: index === text.length - 1 ? suggestions : undefined,
          showAgeSelector: index === text.length - 1 ? showAgeSelector : false,
        }))
      : [{ sender, text, timestamp: new Date(), suggestions, showAgeSelector }]

    setMessages((prev) => [...prev, ...newMessages])
  }

  const updateUserResponse = (key: keyof UserResponses, value: any) => {
    setUserResponses((prev) => ({ ...prev, [key]: value }))
  }

  const simulateTyping = (callback: () => void, delay = 1000) => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      callback()
      setTimeout(scrollToBottom, 100)
    }, delay)
  }

  const processGenderInput = (input: string): { text: string; suggestions: string[]; showAgeSelector?: boolean } => {
    const validGenders = ["male", "female", "nonbinary", "non-binary", "non binary"]
    const gender = input.toLowerCase().trim()

    if (validGenders.includes(gender)) {
      const normalizedGender = gender.includes("non") ? "non-binary" : gender
      updateUserResponse("gender", normalizedGender)
      setCurrentQuestion(2)
      return {
        text: "Thanks! I'd love to personalize our conversation. What is your full name?",
        suggestions: []
      }
    }

    return {
      text: "I do not understand your response. Please tell me if you identify as female, male, or non-binary. Try again or select a suggestion below! 😊",
      suggestions: ["female", "male", "non-binary"]
    }
  }

  const processNameInput = (input: string): { text: string; suggestions: string[]; showAgeSelector?: boolean } => {
    const trimmedInput = input.trim()
    if (!/^[a-zA-Z\s'\-\p{L}]+$/.test(trimmedInput)) {
      return {
        text: "Please enter a valid first and last name (letters, hyphens, apostrophes only).",
        suggestions: []
      }
    }

    const nameParts = trimmedInput.split(/\s+/).filter(Boolean)
    if (nameParts.length < 2) {
      return {
        text: "Please enter both your first and last name.",
        suggestions: []
      }
    }

    const firstName = nameParts[0]
    updateUserResponse("name", trimmedInput)
    setCurrentQuestion(3)
    return {
      text: `Nice to meet you, ${firstName}! Please select your age range from the options below to continue with personalized style recommendations.`,
      suggestions: [],
      showAgeSelector: true
    }
  }

  const processAgeInput = (ageValue: string): { text: string; suggestions: string[]; showAgeSelector?: boolean } => {
    const validAgeRanges = ["Under 19", "19 - 39", "40 - 64", "Over 65"]
    if (validAgeRanges.includes(ageValue)) {
      updateUserResponse("age_range", ageValue)
      setCurrentQuestion(4)
      const firstName = userResponses.name.split(" ")[0]
      return {
        text: `${firstName}, what is your height? You can use inches (like 64 inches), feet (like 5’9) or
centimeters (like 182 cm). Enter your response. `,
        suggestions: []
      }
    }

    return {
      text: "Please select your age range from the buttons below to proceed with style recommendations! 🎯",
      suggestions: [],
      showAgeSelector: true
    }
  }

  const processHeightInput = (input: string): { text: string; suggestions: string[]; showAgeSelector?: boolean } => {
    let measurement: number
    try {
      if (input.includes("cm") || input.includes("cent")) {
        const num = Number.parseFloat(input.replace(/[^\d.]/g, ""))
        measurement = num / 2.54
      } else if (input.includes("'")) {
        const parts = input.split("'")
        const feet = Number.parseFloat(parts[0])
        const inches = Number.parseFloat(parts[1]?.replace(/[^\d.]/g, "") || "0")
        measurement = feet * 12 + inches
      } else if (input.includes("in") || input.includes("inch")) {
        measurement = Number.parseFloat(input.replace(/[^\d.]/g, ""))
      } else {
        setShowHeightCalculator(true)
        return {
          text: "I do not understand your response. Please enter your height or use the conversion calculator below.",
          suggestions: ["5'4\"", "5'6\"", "5'8\"", "165cm", "170cm"]
        }
      }

      if (measurement >= 58 && measurement <= 95) {
        updateUserResponse("height", measurement)
        setCurrentQuestion(5)
return {
  text: "Great! What is your weight in pounds or kilograms? For example, you can say 145lbs or 145 pounds or 85kgs or 85 kilograms.",
  suggestions: []
}
      }
    } catch {
      setShowHeightCalculator(true)
      return {
        text: "I do not understand your response. Please enter your height or use the conversion calculator below.",
        suggestions: ["5'4\"", "5'6\"", "5'8\"", "165cm", "170cm"]
      }
    }

    setShowHeightCalculator(true)
    return {
      text: "I do not understand your response. Please enter your height or use the conversion calculator below.",
        suggestions: ["5'4\"", "5'6\"", "5'8\"", "165cm", "170cm"]
    }
  }

  const processWeightInput = (input: string): { text: string; suggestions: string[]; showAgeSelector?: boolean } => {
    const match = input.match(/(\d+(?:\.\d+)?)\s*(lbs?|kgs?|pounds?|kilos?|kilograms?)/i)
    if (!match) {
      setShowWeightCalculator(true)
      return {
        text: "I do not understand your response. Please enter your weight in pounds or kilograms or use the weight conversion calculator below.",
        suggestions: ["120 lbs", "140 lbs", "160 lbs", "60 kg", "70 kg"]
      }
    }

    let weight = Number.parseFloat(match[1])
    const unit = match[2].toLowerCase()

    if (unit.includes("kg") || unit.includes("kilo")) {
      weight = weight * 2.205
    }

    if (weight < 90 || weight > 400) {
      setShowWeightCalculator(true)
      return {
        text: "I want to make sure I have the right information. Could you please double-check your weight? I work with weights between 90-400 lbs (40-180 kg) or use the weight conversion calculator below. 🤗",
        suggestions: ["120 lbs", "140 lbs", "160 lbs", "60 kg", "70 kg"]
      }
    }

    updateUserResponse("weight", weight)
    const bmi = calculateBMI(weight, userResponses.height)
    updateUserResponse("bmi", bmi)
    setCurrentQuestion(6)
    return {
      text: "What is your shoe size in U.S. measurement? I recognize men’s, women’s and kid’s sizes.",
      suggestions: ["8 women's", "9 women's", "10 men's", "11 men's"]
    }
  }

  const processShoeSizeInput = (input: string): { text: string; suggestions: string[]; showAgeSelector?: boolean } => {
    const match = input.match(/([\d.]+)\s*([a-zA-Z]+)/)
    if (!match) {
      return {
        text: "It looks like your shoe size input isn't quite right. Please enter a number like 7 or 9.5 followed by men's, women's, or kids (e.g., '7 women's' or '9.5 men's'). Try again or select a suggestion below! 😊",
        suggestions: ["8 women's", "9 women's", "10 men's", "11 men's"]
      }
    }

    const size = Number.parseFloat(match[1])
    const category = match[2].toLowerCase()

    let validCategory = ""
    if (["kid", "kids"].includes(category)) validCategory = "kids"
    else if (["women", "woman", "womens", "womans", "women's"].includes(category)) validCategory = "womens"
    else if (["men", "mens", "man", "mans", "men's"].includes(category)) validCategory = "mens"
    else
      return {
        text: "Please specify the category (men's, women's, or kids) with your shoe size, like '7 women's' or '9.5 men's'. Try again or select a suggestion below! 😊",
        suggestions: ["8 women's", "9 women's", "10 men's", "11 men's"]
      }

    const sizeRanges = {
      kids: [3.5, 7],
      womens: [5, 14],
      mens: [5, 38],
    }

    const [minSize, maxSize] = sizeRanges[validCategory as keyof typeof sizeRanges]
    if (size % 1 !== 0 && size % 1 !== 0.5) {
      return {
        text: "Your shoe size should be a whole or half number (e.g., 7 or 9.5). Please try again with a valid US size and category, like '7 women's' or '9.5 men's', or select a suggestion below! 😊",
        suggestions: ["8 women's", "9 women's", "10 men's", "11 men's"]
      }
    }

    if (size < minSize || size > maxSize) {
      return {
        text: `The size for ${validCategory} shoes should be between ${minSize} and ${maxSize}. Please try again with a valid US size, like '7 women's' or '9.5 men's', or select a suggestion below! 😊`,
        suggestions: ["8 women's", "9 women's", "10 men's", "11 men's"]
      }
    }

    updateUserResponse("shoeSize", { size, category: validCategory })

    if (userResponses.gender === "male") {
      setCurrentQuestion(8)
      return {
        text: ": Thanks for your responses. Use the next window to construct a body model that closely resembles your body shape. Click ‘Continue’ when done.",
        suggestions: []
      }
    } else if (userResponses.gender === "non-binary") {
      setCurrentQuestion(7)
      return {
        text: "Do you wear a bra?",
        suggestions: ["Yes", "No"]
      }
    } else {
      setCurrentQuestion(7)
      return {
        text: "For the most accurate style recommendations, what is your US bra size? Please use the following format: 32C, 36DD, etc. This stays completely private and helps with clothing fit and advice! 👙",
        suggestions: ["32B", "34C", "36D", "38DD"]
      }
    }
  }

  const processNonBinaryBraQuestion = (input: string): { text: string; suggestions: string[]; showAgeSelector?: boolean } => {
    const answer = input.toLowerCase().trim()
    if (answer === "yes" || answer === "y") {
      return {
        text: "What is your US bra size? Please use the format like '32B', '36C' or '38F'.",
        suggestions: ["32B", "34C", "36D", "38DD"]
      }
    } else if (answer === "no" || answer === "n") {
      setCurrentQuestion(8)
      return {
        text: "Thanks for your responses. Use the next window to construct a body model that closely resembles your body shape. Click 'Continue' when done.",
        suggestions: []
      }
    } else {
      setShowBraSizeCalculator(true)
      return {
        text: "Please answer yes or no.",
        suggestions: ["Yes", "No"]
      }
    }
  }

  const processBraSizeInput = (input: string): { text: string; suggestions: string[]; showAgeSelector?: boolean } => {
    const match = input.match(/(\d+)([A-Z]+)/i)
    if (!match) {
      setShowBraSizeCalculator(true)
      return {
        text: "I do not understand your response. Please enter your bra size using US metrics or use the bra size conversion calculator below. For example, you can say: 32B, 36C or 38F.",
        suggestions: ["32B", "34C", "36D", "38DD"]
      }
    }

    const vol = match[1]
    const band = match[2].toUpperCase()
    const validBands = ["AAA", "AA", "A", "B", "C", "D", "DD", "DDD", "E", "F", "G", "H", "HH", "HHH", "I", "J", "K", "L", "M", "N", "O"]

    if (!validBands.includes(band)) {
      setShowBraSizeCalculator(true)
      return {
        text: "I do not understand your response. Please enter your bra size using US metrics or use the bra size conversion calculator below. For example, you can say: 32B, 36C or 38F.",
        suggestions: ["32B", "34C", "36D", "38DD"]
      }
    }

    const volNum = Number.parseInt(vol)
    if (volNum < 28 || volNum > 56 || vol.includes(".")) {
      setShowBraSizeCalculator(true)
      return {
        text: "I do not understand your response. Please enter your bra size using US metrics or use the bra size conversion calculator below. For example, you can say: 32B, 36C or 38F.",
        suggestions: ["32B", "34C", "36D", "38DD"]
      }
    }

    const updatedResponses = {
      ...userResponses,
      braSize: { vol, band },
    }

    setUserResponses(updatedResponses)
    setCurrentQuestion(8)

    setTimeout(() => {
      onComplete(updatedResponses)
    }, 500)

    return {
      text: " Thanks for your responses. Use the next window to construct a body model that closely resembles your body shape. Click ‘Continue’ when done.",
      suggestions: []
    }
  }

  const calculateBMI = (weight: number, height: number) => {
    const bmi = (weight * 0.45) / (height * 0.025 * height * 0.025)
    return bmi.toFixed(1)
  }

  const getBotResponse = (input: string): { text: string; suggestions: string[]; showAgeSelector?: boolean } => {
    switch (currentQuestion) {
      case 1:
        return processGenderInput(input)
      case 2:
        return processNameInput(input)
      case 3:
        return processAgeInput(input)
      case 4:
        return processHeightInput(input)
      case 5:
        return processWeightInput(input)
      case 6:
        return processShoeSizeInput(input)
      case 7:
        if (userResponses.gender === "non-binary" && !userResponses.braSize.vol) {
          return processNonBinaryBraQuestion(input)
        }
        return processBraSizeInput(input)
      default:
        return {
          text: "I'm not sure how to help with that. Let's continue with our styling questions! 🤔",
          suggestions: []
        }
    }
  }

  const handleSend = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    if (!userInput.trim()) {
      return
    }

    addMessage("user", userInput)
    const currentInput = userInput
    setUserInput("")

    simulateTyping(
      () => {
        const { text, suggestions, showAgeSelector } = getBotResponse(currentInput)
        addMessage("bot", text, suggestions, showAgeSelector)
      },
      Math.random() * 1000 + 500,
    )
  }

  const handleAgeSelection = (age: string) => {
    setSelectedAge(age)
    addMessage("user", `${age} years of age`)
    simulateTyping(() => {
      const { text, suggestions, showAgeSelector } = processAgeInput(age)
      addMessage("bot", text, suggestions, showAgeSelector)
    }, 500)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setUserInput(suggestion)
    setTimeout(() => handleSend(), 100)
  }

  const getSuggestions = (questionNumber: number): string[] => {
    switch (questionNumber) {
      case 1:
        return ["female", "male", "non-binary"]
      case 2:
        return []
      case 3:
        return []
      case 4:
        return ["5'4\"", "5'6\"", "5'8\"", "165cm", "170cm"]
      case 5:
        return ["120 lbs", "140 lbs", "160 lbs", "60 kg", "70 kg"]
      case 6:
        return ["8 women's", "9 women's", "10 men's", "11 men's"]
      case 7:
        return userResponses.gender === "non-binary" && !userResponses.braSize.vol
          ? ["Yes", "No"]
          : ["32B", "34C", "36D", "38DD"]
      case 8:
        return []
      default:
        return []
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const renderAgeSelection = () => (
    <div className={`bg-gradient-to-r from-primary-100 to-primary-50 p-4 rounded-xl border border-primary-300 my-4 animateFadeIn shadow-md`}>
      <p className="font-semibold text-primary-700 mb-3 text-center text-sm">
        Please select your age range to continue:
      </p>
      <div className="grid grid-cols-2 gap-2">
        {["Under 19", "19 - 39", "40 - 64", "Over 65"].map((age) => (
          <button
            key={age}
            onClick={() => handleAgeSelection(age)}
            className={`flex items-center justify-center p-3 bg-white border-2 ${
              selectedAge === age ? "border-primary-600 bg-primary-100 text-primary-700" : "border-primary-200"
            } hover:border-primary-600 hover:bg-primary-50 transition-all duration-200 font-medium text-gray-700 hover:text-primary-700 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
            aria-label={`Select age range ${age}`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleAgeSelection(age)
              }
            }}
          >
            {age}
          </button>
        ))}
      </div>
    </div>
  )

  const renderSuggestions = (suggestions: string[]) => (
    <div className={`flex flex-wrap gap-2 mt-3 animateFadeIn`}>
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => handleSuggestionClick(suggestion)}
          className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm hover:bg-primary-200 transition-colors duration-200 border border-primary-200"
        >
          {suggestion}
        </button>
      ))}
    </div>
  )

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .animateFadeIn {
            animation: fadeIn 0.3s ease-out;
          }
          
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          
          .animateSlideIn {
            animation: slideIn 0.4s ease-out;
          }

          .chatbotScrollbarMobile {
            scrollbar-width: thin;
            scrollbar-color: rgb(220 38 38) #f1f5f9;
          }

          .chatbotScrollbarMobile::-webkit-scrollbar {
            width: 12px;
          }
          
          .chatbotScrollbarMobile::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 10px;
            margin: 4px;
          }
          
          .chatbotScrollbarMobile::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, rgb(220 38 38), rgb(185 28 28));
            border-radius: 10px;
            border: 2px solid #f1f5f9;
          }
          
          .chatbotScrollbarMobile::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, rgb(185 28 28), rgb(153 27 27));
          }
          
          .chatbotScrollbarMobile::-webkit-scrollbar-corner {
            background: #f1f5f9;
          }

          .chatbotScrollbarDesktop {
            scrollbar-width: thin;
            scrollbar-color: rgb(220 38 38) #f1f5f9;
          }

          .chatbotScrollbarDesktop::-webkit-scrollbar {
            width: 8px;
          }
          
          .chatbotScrollbarDesktop::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 10px;
            margin: 4px;
          }
          
          .chatbotScrollbarDesktop::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, rgb(220 38 38), rgb(185 28 28));
            border-radius: 10px;
            border: 1px solid #f1f5f9;
          }
          
          .chatbotScrollbarDesktop::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, rgb(185 28 28), rgb(153 27 27));
          }
          
          .chatbotScrollbarDesktop::-webkit-scrollbar-corner {
            background: #f1f5f9;
          }
        `}
      </style>

      {isMobile ? (
        <div
          className="bg-white rounded-3xl shadow-2xl w-full h-[600px] flex flex-col overflow-hidden border border-gray-100"
          style={{ touchAction: "manipulation" }}
        >
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-4 text-white flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg">
                  <Image
                    src="/placeholder.svg?height=48&width=48"
                    alt="Sophia AI"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Sophia AI</h3>
                <p className="text-primary-200 text-sm flex items-center">
                  <Bot className="w-4 h-4 mr-1" />
                  Virtual Fashion Stylist
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleReset}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-200 group"
                  title="Reset conversation"
                >
                  <svg
                    className="w-4 h-4 text-white group-hover:rotate-180 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </div>
            </div>
          </div>

          <div
            ref={chatBodyRef}
            className={`flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white chatbotScrollbarMobile`}
            style={{ height: "400px" }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animateSlideIn`}
              >
                <div className={`max-w-[85%] ${message.sender === "user" ? "order-2" : "order-1"}`}>
                  {message.sender === "bot" && (
                    <div className="flex items-center mb-2">
                      <User className="w-3 h-3 text-primary-600 mr-1" />
                      <span className="text-xs text-gray-500 font-medium">Sophia AI</span>
                    </div>
                  )}
                  <div
                    className={`p-4 rounded-2xl shadow-sm ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-br-md"
                        : "bg-white text-gray-800 rounded-bl-md border border-gray-200"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    {message.showAgeSelector && renderAgeSelection()}
                    {message.suggestions && message.suggestions.length > 0 && renderSuggestions(message.suggestions)}
                  </div>
                  <p
                    className={`text-xs mt-1 ${message.sender === "user" ? "text-right text-gray-400" : "text-left text-gray-500"}`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className={`flex justify-start animateSlideIn`}>
                <div className="bg-white p-4 rounded-2xl rounded-bl-md shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">Sophia is typing...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} className="h-1" />
          </div>

          <form onSubmit={handleSend} className="p-4 border-t bg-gray-50 flex-shrink-0">
            <div className="flex space-x-3">
              <Input
                ref={inputRef}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={currentQuestion === 3 ? "Please select an age range above" : "Type your response here..."}
                className="flex-1 border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 rounded-xl h-12 px-4 text-sm"
                disabled={isTyping || currentQuestion === 3}
              />
              <Button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 px-6 h-12 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                disabled={isTyping || currentQuestion === 3}
              >
                <Send className="w-4 h-4 text-white" />
              </Button>
            </div>
            <HeightPopup
              show={showHeightCalculator}
              setShow={setShowHeightCalculator}
              onSelectHeight={handleHeightSelect}
            />
            <WeightPopup
              show={showWeightCalculator}
              setShow={setShowWeightCalculator}
              onSelectWeight={handleWeightSelect}
            />
            <BraSizePopup
              show={showBraSizeCalculator}
              setShow={setShowBraSizeCalculator}
              onSelectBraSize={handleBraSizeSelect}
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">{currentQuestion === 3 ? "Select an age range to continue" : "Press Enter to send"}</p>
              <div className="flex items-center text-xs text-gray-500">
                <CheckCircle className="w-3 h-3 mr-1" />
                <span>Secure & Private</span>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div
          className="bg-white rounded-3xl shadow-2xl w-full h-full flex flex-col overflow-hidden border border-gray-100"
          style={{ touchAction: "manipulation" }}
        >
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-3 text-white flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-lg">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Sophia AI"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-base">Sophia AI</h3>
                <p className="text-primary-200 text-xs flex items-center">
                  <Bot className="w-3 h-3 mr-1" />
                  Virtual Fashion Stylist
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleReset}
                  className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-200 group"
                  title="Reset conversation"
                >
                  <svg
                    className="w-3.5 h-3.5 text-white group-hover:rotate-180 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.001 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </div>
            </div>
          </div>

          <div
            ref={chatBodyRef}
            className={`flex-1 overflow-y-auto p-3 space-y-3 bg-gradient-to-b from-gray-50 to-white chatbotScrollbarDesktop`}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animateSlideIn`}
              >
                <div className={`max-w-[85%] ${message.sender === "user" ? "order-2" : "order-1"}`}>
                  {message.sender === "bot" && (
                    <div className="flex items-center mb-1">
                      <User className="w-3 h-3 text-primary-600 mr-1" />
                      <span className="text-xs text-gray-500 font-medium">Sophia AI</span>
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl shadow-sm ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-br-md"
                        : "bg-white text-gray-800 rounded-bl-md border border-gray-200"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    {message.showAgeSelector && renderAgeSelection()}
                    {message.suggestions && message.suggestions.length > 0 && renderSuggestions(message.suggestions)}
                  </div>
                  <p
                    className={`text-xs mt-1 ${message.sender === "user" ? "text-right text-gray-400" : "text-left text-gray-500"}`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className={`flex justify-start animateSlideIn`}>
                <div className="bg-white p-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">Sophia is typing...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} className="h-1" />
          </div>

          <form onSubmit={handleSend} className="p-3 border-t bg-gray-50 flex-shrink-0">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={currentQuestion === 3 ? "Please select an age range above" : "Type your response here..."}
                className="flex-1 border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 rounded-xl h-10 px-3 text-sm"
                disabled={isTyping || currentQuestion === 3}
              />
              <Button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 px-4 h-10 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                disabled={isTyping || currentQuestion === 3}
              >
                <Send className="w-4 h-4 text-white" />
              </Button>
            </div>
            <HeightPopup
              show={showHeightCalculator}
              setShow={setShowHeightCalculator}
              onSelectHeight={handleHeightSelect}
            />
            <WeightPopup
              show={showWeightCalculator}
              setShow={setShowWeightCalculator}
              onSelectWeight={handleWeightSelect}
            />
            <BraSizePopup
              show={showBraSizeCalculator}
              setShow={setShowBraSizeCalculator}
              onSelectBraSize={handleBraSizeSelect}
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">{currentQuestion === 3 ? "Select an age range to continue" : "Press Enter to send"}</p>
              <div className="flex items-center text-xs text-gray-500">
                <CheckCircle className="w-3 h-3 mr-1" />
                <span>Secure & Private</span>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
