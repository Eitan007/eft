"use client"

import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaymentSuccessPageProps {
  amount: string
  onBack: () => void
}

export default function PaymentSuccessPage({ amount, onBack }: PaymentSuccessPageProps) {
  return (
    <div className="min-h-screen bg-white text-black p-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Success Title */}
        <h1 className="text-2xl font-bold text-center mb-2">Payment Successful</h1>
        <p className="text-center text-gray-600 mb-6">
          Your payment of <span className="font-semibold">${amount}</span> was submitted successfully.
          Your balance will be updated as soon as payment is received.
        </p>

        {/* Success Details */}
        <div className="bg-green-50 rounded-xl p-4 mb-6 border border-green-200">
          <p className="text-sm text-green-700">
            <span className="font-semibold">Status:</span> Pending Confirmation
          </p>
          <p className="text-sm text-green-700 mt-2">
            This may take a few moments depending on your payment method.
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onBack}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-semibold py-6 text-lg rounded-xl"
          >
            Done
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-gray-200 hover:bg-gray-300 text-black font-semibold py-6 text-lg rounded-xl"
          >
            Back to Investment
          </Button>
        </div>

        {/* Powered By */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Powered by <span className="text-green-600 font-semibold">Alchemy</span>
        </p>
      </div>
    </div>
  )
}
