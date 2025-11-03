"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import ETFListModal from "./etf-list-modal"
import PaymentMethodModal from "./payment-method-modal"
import { ChevronRight, CreditCard, Bitcoin, CircleDollarSign, MoreVertical  } from "lucide-react"
import CurrencyListModal from "./currencies-modal"

interface InvestmentPageProps {
  onNavigate: (page: "crypto" | "card", data: any) => void
}

const ETF_RATES = 0.000009

const ETF_LIST = [
  { symbol: "IVV", name: "iShares Core S&P 500 ETF", color: "bg-blue-500" },
  { symbol: "VTI", name: "Vanguard Total Stock Market ETF", color: "bg-green-500" },
  { symbol: "SPY", name: "SPDR S&P 500 ETF Trust", color: "bg-orange-300" }, // peach-like
  { symbol: "QQQ", name: "Invesco QQQ Trust", color: "bg-indigo-500" },
  { symbol: "EFA", name: "iShares MSCI EAFE ETF", color: "bg-gray-500" },
  { symbol: "BND", name: "Vanguard Total Bond Market ETF", color: "bg-sky-300" }, // pale-blue
  { symbol: "AGG", name: "iShares Core U.S. Aggregate Bond ETF", color: "bg-neutral-700" }, // dark-gray
  { symbol: "VNQ", name: "Vanguard Real Estate ETF", color: "bg-green-300" }, // pale-green
  { symbol: "ARKK", name: "ARK Innovation ETF", color: "bg-pink-400" },
]


const ETF_NAMES = {
  IVV: "iShares Core S&P 500 ETF",
  VTI: "Vanguard Total Stock Market ETF",
  SPY: "SPDR S&P 500 ETF Trust",
  QQQ: "Invesco QQQ Trust",
  EFA: "iShares MSCI EAFE ETF",
  BND: "Vanguard Total Bond Market ETF",
  AGG: "iShares Core U.S. Aggregate Bond ETF",
  VNQ: "Vanguard Real Estate ETF",
  ARKK: "ARK Innovation ETF",
}

const CURRENCY_RATES = {
  USD: 1,
  GBP: 1.28,
  EUR: 1.07,
  CAD: 0.73,
  AUD: 0.66,
  JPY: 0.0066,
  INR: 0.012,
  CNY: 0.14,
  BRL: 0.18,
  CHF: 1.12,
  SGD: 0.74,
  HKD: 0.13,
  SEK: 0.091,
  ZAR: 0.055,
  MXN: 0.056,
  TRY: 0.029,
  KRW: 0.00073,
  RUB: 0.011,
}

const FLAGS = {
  USD: "🇺🇸",
  GBP: "🇬🇧",
  EUR: "🇪🇺",
  CAD: "🇨🇦",
  AUD: "🇦🇺",
  JPY: "🇯🇵",
  INR: "🇮🇳",
  CNY: "🇨🇳",
  BRL: "🇧🇷",
  CHF: "🇨🇭",
  SGD: "🇸🇬",
  HKD: "🇭🇰",
  SEK: "🇸🇪",
  ZAR: "🇿🇦",
  MXN: "🇲🇽",
  TRY: "🇹🇷",
  KRW: "🇰🇷",
  RUB: "🇷🇺",
}

export default function InvestmentPage({ onNavigate }: InvestmentPageProps) {
  const [balance, setBalance] = useState("0.00")
  const [amount, setAmount] = useState(() => {
    // if (typeof window !== "undefined") {
    //   return localStorage.getItem("investmentAmount") || ""
    // }
    return ""
  })
  const [showCurrencyModal, setShowCurrencyModal] = useState(false)

  const [selectedCurrency, setSelectedCurrency] = useState("USD")
  const [selectedETF, setSelectedETF] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedETF") || "IVV"
    }
    return "IVV"
  })
  const [paymentMethod, setPaymentMethod] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("paymentMethod") || "card"
    }
    return "card"
  })

  const [selectedCrypto, setSelectedCrypto] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedCrypto") || ""
    }
    return ""
  })

  const [amountInUSD, setamountInUSD] = useState("0")

  const [showETFList, setShowETFList] = useState(false)
  const [showPaymentMethod, setShowPaymentMethod] = useState(false)
  const [cryptoEquivalent, setCryptoEquivalent] = useState("0.000000")

  // useEffect(() => {
  //   const fetchBalance = async () => {
  //     try {
  //       const response = await fetch("/api/user-balance")
  //       const data = await response.json()
  //       setBalance(data.balance || "0.00")
  //     } catch (error) {
  //       console.error("Failed to fetch balance:", error)
  //       setBalance("0.00")
  //     }
  //   }
  //   fetchBalance()
  // }, [])

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     localStorage.setItem("investmentAmount", amount)
  //     localStorage.setItem("selectedETF", selectedETF)
  //     localStorage.setItem("paymentMethod", paymentMethod)
  //     localStorage.setItem("selectedCrypto", selectedCrypto)
  //   }
  // }, [amount, selectedETF, paymentMethod, selectedCrypto])

  useEffect(() => {
    if (amount && selectedCurrency) {
      const rateToUSD = CURRENCY_RATES[selectedCurrency] || 1
      const usdAmount = Number.parseFloat(amount) * rateToUSD
      const crypto = (usdAmount * ETF_RATES).toFixed(6)
      setamountInUSD(usdAmount)
      setCryptoEquivalent(crypto)
    } else {
      setCryptoEquivalent("0.000000")
    }
  }, [amount, selectedETF, selectedCurrency])


  const handleKeypadPress = (value: string) => {
    if (value === "backspace") {
      setAmount((prev) => prev.slice(0, -1))
    } else if (value === ".") {
      if (!amount.includes(".")) {
        setAmount((prev) => prev + ".")
      }
    } else {
      // Prevent multiple leading zeros unless decimal follows
      if (amount === "0" && value !== ".") {
        // Overwrite 0 with next non-zero digit
        setAmount(value)
        return
      }
  
      // Only add digit if total length (excluding decimal) < 19
      const digitsOnly = amount.replace(".", "")
      if (digitsOnly.length < 19) {
        setAmount((prev) => prev + value)
      }
    }
  }


  const [invalidAmount, setInvalidAmount] = useState(false)
  const [invalidPaymentMethod, setInvalidPaymentMethod] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleContinuePayment = () => {

    // console.log(paymentMethod.length)
    // return
    if (!amount || Number.parseFloat(amount) <= 0) {
      setInvalidAmount(true)
      setTimeout(() => setInvalidAmount(false), 2000)
      return
    } else {
      setInvalidAmount(false)
    }
  
    if (paymentMethod.length < 1) {
      setInvalidPaymentMethod(true)
      setTimeout(() => setInvalidPaymentMethod(false), 2000)
      return
    } else {
      setInvalidPaymentMethod(false)
    }

    setLoading(true)
    const delay = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000

    const data = { amount, amountInUSD, selectedCurrency, selectedETF, paymentMethod, selectedCrypto }

    if (paymentMethod === "card") {
      setTimeout(() => {
        onNavigate("card", data)
      }, delay)

    } else {
      setTimeout(() => {
        onNavigate("crypto", data)
      }, delay)
    }
  }

  const getFontSize = () => {
    const totalLength = amount.length + 4 // +4 for " USD"
    if (totalLength <= 8) return "text-7xl"
    if (totalLength <= 12) return "text-5xl"
    if (totalLength <= 16) return "text-4xl"
    return "text-3xl"
  }
  
  const getCursorSize = () => {
    const totalLength = amount.length + 4 // +4 for " USD"
    if (totalLength <= 8) return "60px"
    if (totalLength <= 12) return "40px"
    if (totalLength <= 16) return "30px"
    return "20px"
  }

  const amountValue = Number.parseFloat(amount) || 0
  const isNeonBlue = amountValue > 0

  const getPaymentIcon = () => {
    if (paymentMethod === "card") return <CreditCard className="w-6 h-6 text-[#0052FF]" />
    if (selectedCrypto === "BTC") return <Bitcoin className="w-6 h-6 text-white" />
    if (selectedCrypto === "ETH") return <span className="text-gray-300 text-2xl">⟠</span>
    if (selectedCrypto === "USDC") return <CircleDollarSign className="w-6 h-6 text-gray-300" />
    return <span className="text-white text-xl">$</span> 
  }
  
  return (

      <div className="h-screen bg-black text-white flex flex-col overflow-auto">
      {/* Balance $ Buy button */}
     <div className="flex items-center justify-between mb-6" style={{marginTop: '20px', padding: '15px'}}>
       
       <Button className="p-0 m-0">
        <div className="bg-[#0E2047] h-[42px] rounded-lg px-8  border-[] border-[#0E2047]">
          <p className="text-[9px] text-[#A0A0A0] font-medium text-center mt-2">ETF Balance</p>
          <p className="pb-2 text-[10px] font-bold text-white text-center">${balance}</p>
        </div>
       </Button>

       <Button 
          onClick={() => setShowCurrencyModal(true)}
          size="lg" className=" h-[42px] gradient-button text-white font-semibold px-8 smooth-transition">
            {selectedCurrency ? FLAGS[selectedCurrency] : "🇺🇸"}
       </Button>

     </div>

      {/* Dollar Amount & Crypto Amount */}
      <div className="flex-1 mb-3 flex items-center mt-5" >
        <div className={`rounded-2xl p-6 w-full  smooth-transition ${invalidAmount ? "border-red-500 border-1" : ""}`}>
          <div
            className={`${getFontSize()}  font-semi-bold text-white flex items-baseline gap-2 smooth-transition ${isNeonBlue ? "neon-blue" : ""}`}
          >
            <span>{amount || "0"}</span>
            <div className={`h-[${getCursorSize()}]`}>
            <div className={`h-[${getCursorSize()}] w-[2px]  bg-blue-400`} style={{marginLeft: '10%'}}></div>
            </div>
            <span
              className={`font-medium smooth-transition ${ isNeonBlue ? "text-[#A0A0A0]/50" : "text-[#A0A0A0]/50"}`} style={{ opacity: parseInt(amount) > 0 ? 0.6 : 0.6 }}>
              {selectedCurrency || "USD"}
            </span>
          </div>

          <div className="mb-4" style={{paddingTop: '15px', paddingLeft: '4px'}}>
            <p className="text-gray-500 text-sm font-medium flex items-center gap-2">
              <span className="text-[#627EEA]" >⟠</span>
              {cryptoEquivalent} Units of {ETF_NAMES[selectedETF as keyof typeof ETF_NAMES]}
            </p>
        </div>

        </div>
      </div> 

      {/* Options */}
      <div className="px-4 py-4 border-b border-t border-gray-800 space-y-0.1">
        
      {/* ETF Network */}
      <div className="flex items-center justify-between bg-gray-900 rounded-full px-3 py-1.5"  style={{marginRight:'50%'}}>
        <div className="text-[12px] flex items-center gap-3">
          <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            E
          </div>
          <span className="font-medium">Network: ETF</span>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-500" />
      </div>

      {/* Buy ETF */}
      {/* <div className="space-y-3"> */}
        <div className="flex items-center justify-between">
        <button
          onClick={() => setShowETFList(true)}
          className="w-full bg-transparent rounded-md p-5 border-[] flex items-center justify-between smooth-transition"
        >
          <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full text-xs flex items-center justify-center text-white font-bold ${
            ETF_LIST.find(etf => etf.symbol === selectedETF)?.color || "bg-gray-500"}`}>
            {selectedETF || "ETF"}
          </div>
          <div className="flex flex-col items-start" >
            <div className="font-bold text-[13px]">Buy</div>
            <div className="pr-10">
                <span  className="text-gray-500 text-[11px]">
                  {selectedETF || "Choose ETF"}
                </span>
            </div>
          </div>
          </div>
          <div className="ml-auto">
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </div>
          </button>
      </div>
      <div className="w-px h-[18px] bg-gray-400 ml-12" style={{marginLeft: '10%'}}></div>
      
        {/* Pay With */}
        <div className="flex items-center justify-between">
        <button
            onClick={() => setShowPaymentMethod(true)}

            className={`w-full bg-transparent rounded-md p-5 border-[]  flex items-center justify-between smooth-transition  ${invalidPaymentMethod ? "border-red-500 border-1" : ""}`}
            >
          <div className="flex items-center gap-4">
            {/* 1 */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                selectedCrypto === "BTC" ? "bg-[#F7931A]" : "bg-blue-500"
              }`}>
              {getPaymentIcon()}
            </div>

              {/* 2 */}
              <div className="flex flex-col items-start">
                <div className="font-bold text-[13px]">Pay with</div>
                <div className="pr-10">
                  <span className="text-[11px] text-gray-500">
                    {paymentMethod === "card"
                      ? "Card"
                      : selectedCrypto
                        ? `${selectedCrypto}`
                        : "Select"}
                  </span>
                </div>
              </div>
          </div>

          <div className="text-right" style={{paddingLeft: '122px'}}>

            <div className="font-bold text-[13px]">Using</div>
            <div>
              <span className="text-[11px] text-gray-500">
                  {paymentMethod === "card"
                    ? "Alchemy Pay"
                    : selectedCrypto
                      ? `${selectedCrypto} Network`
                      : "Select"}
              </span>
            </div>

          </div>
          <ChevronRight className="w-5 h-5 text-gray-500 ml-4" />
          </button>
          </div>
    
      </div>

      {/* Numeric Keypad */}
        <div className="flex item-center justify-center mt-[5px] shrink-0 overflow-hidden">
           <div className="grid grid-cols-3 gap-4 w-[450px] h-[300px] mx-auto mt-3 ml-3 mr-3 mb-3">
  
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              onClick={() => handleKeypadPress(num)}
              // className="aspect-square text-3xl font-light text-white hover:bg-gray-900 rounded-[100px] transition"
              className="flex items-center justify-center text-2xl hover:bg-gray-900 text-white rounded-lg transition"
     >
              {num}
            </button>
          ))}
          <button 
            onClick={() => handleKeypadPress(".")}
            className="flex items-center justify-center text-2xl hover:bg-gray-900 text-white rounded-lg transition"
            >
            •
          </button>
          <button
            onClick={() => handleKeypadPress("0")}
            className="flex items-center justify-center text-2xl hover:bg-gray-900 text-white rounded-lg transition"
    >
            0
          </button>
          <button
            onClick={() => handleKeypadPress("backspace")}
            className="flex items-center justify-center text-2xl hover:bg-gray-900 text-white rounded-lg transition"
    >
            ←
          </button>
        </div>
      </div>

      {/* Continue Button */}
      <div className="px-10 pb-10 shrink-0">
        <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-black font-semibold py-4 rounded-full hover:opacity-90 transition" 
        onClick={handleContinuePayment}
        disabled={loading} >
          {loading ? "Processing..." : `Continue to Payment`}
        </button>
      </div>


    {/* Modals */}
    {showETFList && (
      <div className="smooth-transition">
        <ETFListModal
          selectedETF={selectedETF}
          onSelect={(etf) => {
            setSelectedETF(etf)
            setShowETFList(false)
          }}
          onClose={() => setShowETFList(false)}
        />
      </div>
    )}

    {showPaymentMethod && (
      <div className="smooth-transition">
        <PaymentMethodModal
          onSelect={(method, crypto) => {
            setPaymentMethod(method)
            setSelectedCrypto(crypto)
            setShowPaymentMethod(false)
          }}
          onClose={() => setShowPaymentMethod(false)}
        />
      </div>
    )}


    {/* Currency Modal */}
    {showCurrencyModal && (
        <CurrencyListModal
          selectedCurrency={selectedCurrency}
          onSelect={(code) => {
            setSelectedCurrency(code)
            setShowCurrencyModal(false)
            console.log("Selected currency:", code)
          }}
          onClose={() => setShowCurrencyModal(false)}
        />
      )}

    </div>
  )
}
