"use client"

import { useState } from "react"
import InvestmentPage from "@/components/investment-page"
import CryptoPaymentPage from "@/components/crypto-payment-page"
import CardPaymentPage from "@/components/card-payment-page"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"investment" | "crypto" | "card">("investment")
  const [investmentData, setInvestmentData] = useState({
    amount: "",
    selectedETF: "ETF_1",
    paymentMethod: "",
    selectedCrypto: "",
  })

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="w-full max-w-md">
        {currentPage === "investment" && (
          <InvestmentPage
            onNavigate={(page, data) => {
              setInvestmentData(data)
              setCurrentPage(page)
            }}
          />
        )}
        {currentPage === "crypto" && (
          <CryptoPaymentPage
            amount={investmentData.amount}
            crypto={investmentData.selectedCrypto}
            onBack={() => setCurrentPage("investment")}
          />
        )}
        {currentPage === "card" && (
          <CardPaymentPage amount={investmentData.amount} onBack={() => setCurrentPage("investment")} />
        )}
      </div>
    </main>
  )
}
