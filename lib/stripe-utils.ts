// Stripe utility functions for payment processing
export interface StripePaymentIntent {
  clientSecret: string
  amount: number
  currency: string
}

export interface StripePaymentData {
  orderId: string
  campaignId: string
  campaignTitle: string
  amount: number
  quantity: number
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zip: string
  cardNumber: string
  expiryDate: string
  cvv: string
}

// Simulate Stripe payment processing
export async function createPaymentIntent(amount: number): Promise<StripePaymentIntent> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        clientSecret: `pi_${Math.random().toString(36).substr(2, 9)}_secret_${Math.random().toString(36).substr(2, 9)}`,
        amount,
        currency: "usd",
      })
    }, 500)
  })
}

// Simulate Stripe payment confirmation
export async function confirmPayment(paymentData: StripePaymentData): Promise<{ success: boolean; orderId: string }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (paymentData.cardNumber && paymentData.expiryDate && paymentData.cvv && paymentData.amount > 0) {
        const orderId = `TFI-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
        resolve({ success: true, orderId })
      } else {
        reject(new Error("Payment validation failed"))
      }
    }, 1000)
  })
}

// Validate card number (basic Luhn algorithm)
export function validateCardNumber(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, "")
  if (digits.length < 13 || digits.length > 19) return false

  let sum = 0
  let isEven = false

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(digits[i], 10)

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

// Validate expiry date
export function validateExpiryDate(expiryDate: string): boolean {
  const [month, year] = expiryDate.split("/")
  if (!month || !year) return false

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear() % 100
  const currentMonth = currentDate.getMonth() + 1

  const expYear = Number.parseInt(year, 10)
  const expMonth = Number.parseInt(month, 10)

  if (expYear < currentYear) return false
  if (expYear === currentYear && expMonth < currentMonth) return false

  return expMonth >= 1 && expMonth <= 12
}

// Validate CVV
export function validateCVV(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv)
}
