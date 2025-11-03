"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaymentFailedPageProps {
  amount: string
  onBack: () => void
}

export default function PaymentFailedPage({ amount, onBack }: PaymentFailedPageProps) {
  return (
    <div className="min-h-screen bg-white text-black p-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 rounded-full p-4">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-center mb-2">Payment Failed</h1>
        <p className="text-center text-gray-600 mb-6">
          We couldn't process your payment of ${amount}. Please check your card details and try again.
        </p>

        {/* Error Details */}
        <div className="bg-red-50 rounded-xl p-4 mb-6 border border-red-200">
          <p className="text-sm text-red-700">
            <span className="font-semibold">Error Code:</span> CARD_DECLINED
          </p>
          <p className="text-sm text-red-700 mt-2">Could not process card at this time</p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onBack}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-6 text-lg rounded-xl"
          >
            Try Again
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-gray-200 hover:bg-gray-300 text-black font-semibold py-6 text-lg rounded-xl"
          >
            Back to Home Page
          </Button>
        </div>

        {/* Powered By */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Powered by <span className="text-blue-600 font-semibold">Alchemy</span>
        </p>
      </div>
    </div>
  )
}
