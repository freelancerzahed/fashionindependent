"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Payment {
  id: string
  orderId: string
  campaignId: string
  campaignTitle: string
  amount: number
  quantity: number
  status: "pending" | "completed" | "shipped" | "delivered"
  email: string
  paymentMethod: "stripe" | "paypal"
  createdAt: string
  shippingAddress: {
    firstName: string
    lastName: string
    address: string
    city: string
    state: string
    zip: string
  }
}

interface PaymentContextType {
  payments: Payment[]
  addPayment: (payment: Payment) => void
  updatePaymentStatus: (orderId: string, status: Payment["status"]) => void
  getPaymentByOrderId: (orderId: string) => Payment | undefined
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined)

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const storedPayments = localStorage.getItem("payments")
      if (storedPayments) {
        setPayments(JSON.parse(storedPayments))
      }
    } catch (error) {
      console.error("[v0] Failed to load payments from localStorage:", error)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem("payments", JSON.stringify(payments))
      } catch (error) {
        console.error("[v0] Failed to save payments to localStorage:", error)
      }
    }
  }, [payments, mounted])

  const addPayment = (payment: Payment) => {
    setPayments((prevPayments) => [...prevPayments, payment])
  }

  const updatePaymentStatus = (orderId: string, status: Payment["status"]) => {
    setPayments((prevPayments) => prevPayments.map((p) => (p.orderId === orderId ? { ...p, status } : p)))
  }

  const getPaymentByOrderId = (orderId: string) => {
    return payments.find((p) => p.orderId === orderId)
  }

  if (!mounted) {
    return (
      <PaymentContext.Provider value={{ payments: [], addPayment, updatePaymentStatus, getPaymentByOrderId }}>
        {children}
      </PaymentContext.Provider>
    )
  }

  return (
    <PaymentContext.Provider value={{ payments, addPayment, updatePaymentStatus, getPaymentByOrderId }}>
      {children}
    </PaymentContext.Provider>
  )
}

export function usePayments() {
  const context = useContext(PaymentContext)
  if (context === undefined) {
    throw new Error("usePayments must be used within PaymentProvider")
  }
  return context
}
