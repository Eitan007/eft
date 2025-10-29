"use client"

import { useState } from "react"
import { ArrowLeft, CreditCard, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import PaymentFailedPage from "./payment-failed-page"

interface CardPaymentPageProps {
  amount: string
  onBack: () => void
}

export default function CardPaymentPage({ amount, onBack }: CardPaymentPageProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    billingAddress: "",
  })
  const [loading, setLoading] = useState(false)
  const [paymentFailed, setPaymentFailed] = useState(false)

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "")
    const chunks = cleaned.match(/.{1,4}/g) || []
    return chunks.join(" ")
  }

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4)
    }
    return cleaned
  }

  const handleInputChange = (field: string, value: string) => {
    if (field === "cardNumber") {
      const cleaned = value.replace(/\s/g, "")
      if (cleaned.length <= 16 && /^\d*$/.test(cleaned)) {
        setFormData((prev) => ({ ...prev, [field]: formatCardNumber(cleaned) }))
      }
    } else if (field === "expiryDate") {
      const cleaned = value.replace(/\D/g, "")
      if (cleaned.length <= 4) {
        setFormData((prev) => ({ ...prev, [field]: formatExpiryDate(cleaned) }))
      }
    }
    // } else if (field === "expiryDate") {
    //   const cleaned = value.replace(/\D/g, "").slice(0, 4); // max 4 digits
    //   if (cleaned.length <= 4) {
    //     let month = cleaned.slice(0, 2);
    //     if (month) {
    //       let monthNum = Math.max(1, Math.min(12, parseInt(month)));
    //       month = monthNum.toString().padStart(2, "0");
    //     }
    //     const formatted = month + (cleaned.length > 2 ? "/" + cleaned.slice(2, 4) : "");
    //     setFormData((prev) => ({ ...prev, [field]: formatted }));
    //   }
    // }
  
    else if (field === "cvv") {
      if (value.length <= 3 && /^\d*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [field]: value }))
      }
    } else if (field === "firstName" || field === "lastName") {
      if (/^[a-zA-Z\s]*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [field]: value }))
      }
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleSubmit = async () => {
    // Validation
    if (!formData.firstName || !formData.lastName) {
      alert("Please enter your full name")
      return
    }
    if (formData.cardNumber.replace(/\s/g, "").length !== 16) {
      alert("Please enter a valid 16-digit card number")
      return
    }
    if (formData.expiryDate.length !== 5) {
      alert("Please enter expiry date in MM/YY format")
      return
    }
    if (formData.cvv.length !== 3) {
      alert("Please enter a valid 3-digit CVV")
      return
    }
    if (!formData.billingAddress) {
      alert("Please enter your billing address")
      return
    }

    setLoading(true)
    
    const delay = Math.floor(Math.random() * (7000 - 4000 + 1)) + 4000

    setTimeout(() => {
      setLoading(false)
      setPaymentFailed(true)
    }, delay)
  }

  if (paymentFailed) {
    return <PaymentFailedPage amount={amount} onBack={() => setPaymentFailed(false)} />
  }

  return (
    <div className="min-h-screen bg-white text-black p-6 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">Card Payment Method</h1>
          <div className="w-10" />
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-blue-600 rounded-full" />
          </div>
        </div>

        {/* Payment Title */}
        <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 mb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-sm">Card</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-xs text-gray-600">Instant</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-6 h-4" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="32" rx="4" fill="#1A1F71" />
              <circle cx="16" cy="16" r="8" fill="#FF5F00" />
              <circle cx="24" cy="16" r="8" fill="#EB001B" />
              <path d="M20 12v8M28 12v8" stroke="white" strokeWidth="1" />
              <text x="32" y="20" fontSize="8" fill="white" fontWeight="bold">
                VISA
              </text>
            </svg>
            <svg className="w-6 h-4" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="32" rx="4" fill="#EB001B" />
              <circle cx="18" cy="16" r="8" fill="#FF5F00" />
              <circle cx="30" cy="16" r="8" fill="#EB001B" />
              <text x="6" y="20" fontSize="8" fill="white" fontWeight="bold">
                MC
              </text>
            </svg>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-3 mb-4 flex-1 overflow-y-auto">
          <div>
            <label className="text-xs text-gray-600 mb-1 block">First Name *</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="John"
              className="w-full bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 outline-none focus:border-blue-500 transition-colors text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">Last Name *</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="Doe"
              className="w-full bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 outline-none focus:border-blue-500 transition-colors text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">Card Number *</label>
            <input
              type="text"
              value={formData.cardNumber}
              onChange={(e) => handleInputChange("cardNumber", e.target.value)}
              placeholder="1234 5678 9012 3456"
              className="w-full bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 outline-none focus:border-blue-500 transition-colors font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Expiry Date *</label>
              <input
                type="text"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                placeholder="MM/YY"
                className="w-full bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 outline-none focus:border-blue-500 transition-colors text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-gray-600 mb-1 block">CVV *</label>
              <input
                type="text"
                value={formData.cvv}
                onChange={(e) => handleInputChange("cvv", e.target.value)}
                placeholder="123"
                className="w-full bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 outline-none focus:border-blue-500 transition-colors text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">Billing Address *</label>
            <input
              type="text"
              value={formData.billingAddress}
              onChange={(e) => handleInputChange("billingAddress", e.target.value)}
              placeholder="123 Main St, City, State, ZIP"
              className="w-full bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 outline-none focus:border-blue-500 transition-colors text-sm"
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-5 text-base rounded-xl disabled:opacity-50"
        >
          {loading ? "Processing..." : `Pay $${amount}`}
        </Button>

        <p className="text-center text-xs text-gray-500 mt-4">
          Powered by <span className="text-blue-600 font-semibold">Alchemy</span>
        </p>
      </div>
    </div>
  )
}
