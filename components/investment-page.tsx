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
    if (typeof window !== "undefined") {
      return localStorage.getItem("investmentAmount") || ""
    }
    return ""
  })
  const [showCurrencyModal, setShowCurrencyModal] = useState(false)

  const [selectedCurrency, setSelectedCurrency] = useState("")
  const [selectedETF, setSelectedETF] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedETF") || "ETF_1"
    }
    return "ETF_1"
  })
  const [paymentMethod, setPaymentMethod] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("paymentMethod") || ""
    }
    return ""
  })

  const [selectedCrypto, setSelectedCrypto] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedCrypto") || ""
    }
    return ""
  })
  const [showETFList, setShowETFList] = useState(false)
  const [showPaymentMethod, setShowPaymentMethod] = useState(false)
  const [cryptoEquivalent, setCryptoEquivalent] = useState("0.000000")


  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch("/api/user-balance")
        const data = await response.json()
        setBalance(data.balance || "0.00")
      } catch (error) {
        console.error("Failed to fetch balance:", error)
        setBalance("0.00")
      }
    }
    fetchBalance()
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("investmentAmount", amount)
      localStorage.setItem("selectedETF", selectedETF)
      localStorage.setItem("paymentMethod", paymentMethod)
      localStorage.setItem("selectedCrypto", selectedCrypto)
    }
  }, [amount, selectedETF, paymentMethod, selectedCrypto])

  useEffect(() => {
    if (amount && selectedCurrency) {
      const rateToUSD = CURRENCY_RATES[selectedCurrency] || 1
      const usdAmount = Number.parseFloat(amount) * rateToUSD
      const crypto = (usdAmount * ETF_RATES).toFixed(6)
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
      // Only add digit if total length (excluding decimal) is less than 21
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

    const data = { amount, selectedETF, paymentMethod, selectedCrypto }



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
    return <span className="text-white text-xl">$</span> // default icon
  }
  

  return (

    // <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="h-screen bg-black text-white flex flex-col overflow-auto">
      {/* Balance $ Buy button */}
     <div className="flex items-center justify-between mb-6" style={{marginTop: '10px', padding: '15px'}}>
       <div className="bg-[#0E2047] h-[42px] rounded-lg px-8  border border-[#1C1C1C]">
         <p className="text-[9px] text-[#A0A0A0] font-medium text-center">ETF Balance</p>
         <p className="pb-2 text-2xs font-bold text-white text-center">${balance}</p>
       </div>
       
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

            {/* <span  className=" neon-blue">|</span> */}
            <div className={`h-[${getCursorSize()}]`}>
            <div className={`h-[${getCursorSize()}] w-[2px]  bg-blue-400`} style={{marginLeft: '10%'}}></div>
            </div>
            <span
              className={`font-medium smooth-transition ${ isNeonBlue ? "text-[#A0A0A0]/50" : "text-[#A0A0A0]/50"}`} style={{ opacity: parseInt(amount) > 0 ? 0.6 : 0.6 }}>
              {selectedCurrency || "USD"}
            </span>


            {/* <span className={`text-[#A0A0A0]/50 font-medium smooth-transition ${isNeonBlue ? "neon-blue" : ""}`}>USD</span> */}
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
      <div className="space-y-3">
          <button
          onClick={() => setShowETFList(true)}
          className="w-full bg-transparent rounded-md p-5 border border-transparent flex items-center justify-between smooth-transition"
        >
          <div className={`w-10 h-10 rounded-full text-xs flex items-center justify-center text-white font-bold ${
            ETF_LIST.find(etf => etf.symbol === selectedETF)?.color || "bg-gray-500"}`}>
            {selectedETF || "ETF"}
          </div>
          <div style={{marginLeft: '4%'}}>
            <div className="font-semibold">Buy</div>
            <div className="text-gray-500 text-[11px]">{selectedETF || "Choose ETF"}</div>
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
            // className={`w-full bg-transparent rounded-md p-5 border-[]  flex items-center justify-between smooth-transition hover:bg-gray-900 hover:border-gray-900 ${invalidPaymentMethod ? "border-red-500 border-1" : ""}`}
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
            <div>

              <div className="font-semibold">Pay with</div>
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

            <div className="font-semibold">Using</div>
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

      {/* <div className="max-h-[600px] mt-[5px] overflow-hidden" > */}
        <div className="flex item-center justify-center mt-[5px] shrink-0 overflow-hidden">
        {/* <div className="grid grid-cols-3 max-w-lg max-h-xm mx-auto"> */}
           {/* <div className="space-x-10 grid grid-cols-3 gap-3 max-w-sm mx-auto ml-12"> */}
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
      {/* <div className="px-10 pb-8 flex-1"> */}
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
























  
//   (
//     // <div className="w-full min-h-screen bg-[#0D0D0D] flex flex-col items-stretch justify-start p-6 pb-20 overflow-hidden">
// <div className="absolute inset-0 bg-[#0D0D0D] flex flex-col p-6 pb-20 h-screen overflow-x-auto">

// {/* <div className="w-screen min-h-screen bg-[#0D0D0D] flex flex-col items-stretch justify-start p-6 pb-20 overflow-hidden"> */}

//     {/* <div className="w-screen bg-[#0D0D0D] p-6 pb-20 flex flex-col h-screen overflow-hidden"> */}
//     {/* Header */}
//     <div className="flex items-center justify-between mb-6">
//       <div className="bg-[#0E2047] rounded-2xl px-6 py-3 border border-[#1C1C1C]">
//         <p className="text-sm text-[#A0A0A0] font-medium">ETF Balance</p>
//         <p className="text-2xl font-bold text-white">${balance}</p>
//       </div>
//       <Button size="lg" className="gradient-button text-white font-semibold px-8 smooth-transition">
//         BUY
//       </Button>
//     </div>

    // {/* Amount Input */}
    // <div className="mb-3 h-20 flex items-center">
    //   <div className={`rounded-2xl p-6 w-full hover:bg-[#1C1C1C]/50 smooth-transition ${invalidAmount ? "border-red-500 border-1" : ""}`}>
    //     <div
    //       className={`${getFontSize()} font-bold text-white flex items-baseline gap-2 smooth-transition ${isNeonBlue ? "neon-blue" : ""}`}
    //     >
    //       <span>{amount || "0"}</span>

    //       <span
    //         className={`font-medium smooth-transition ${ isNeonBlue ? "neon-blue" : "text-[#A0A0A0]/50"}`} style={{ opacity: parseInt(amount) > 10 ? 0.5 : 1 }}>
    //         USD
    //       </span>


    //       {/* <span className={`text-[#A0A0A0]/50 font-medium smooth-transition ${isNeonBlue ? "neon-blue" : ""}`}>USD</span> */}
    //     </div>
    //   </div>
    // </div>

    // {/* Crypto Equivalent */}
    // <div className="mb-4">
    //   <p className="text-[#666666] text-sm font-medium flex items-center gap-2">
    //     <span className="text-[#627EEA]">⟠</span>
    //     {cryptoEquivalent} Units of {ETF_NAMES[selectedETF as keyof typeof ETF_NAMES]}
    //   </p>
    // </div>

    // {/* Network Selection */}
    // <div className="mb-3">
    //   <label className="text-sm text-[#A0A0A0] mb-2 block font-medium">Network</label>
    //   <button
    //     disabled
    //     className="w-full bg-transparent rounded-xl p-3 border border-transparent flex items-center justify-between opacity-60 smooth-transition"
    //   >
    //     <div className="flex items-center gap-3">
    //       <div className="w-8 h-8 rounded-full bg-[#627EEA]/20 flex items-center justify-center">
    //         <span className="text-[#627EEA] font-bold text-sm">E</span>
    //       </div>
    //       <span className="font-medium text-white">ETF Network</span>
    //     </div>
    //   </button>
    // </div>

    // {/* ETF Selection */}
    // <div className="mb-3">
    //   <label className="text-sm text-[#A0A0A0] mb-2 block font-medium">Buy</label>
    //   <button
    //     onClick={() => setShowETFList(true)}
    //     className="w-full bg-[#0E2047]/40 rounded-xl p-3 border border-[#0E2047]/40 flex items-center justify-between smooth-transition hover:bg-[#0E2047]/60 hover:border-[#0E2047]/60"
    //   >
    //     <div className="flex items-center gap-3">
    //       <div className="w-8 h-8 rounded-full bg-[#0052FF] flex items-center justify-center">
    //         <span className="text-white font-bold text-sm">E</span>
    //       </div>
    //       <span className="font-medium text-white">{selectedETF}</span>
    //     </div>
    //     <span className="text-[#A0A0A0]">›</span>
    //   </button>
    // </div>

    // {/* Payment Method */}
    // <div className="mb-4">
    //   <label className="text-sm text-[#A0A0A0] mb-2 block font-medium ">Pay with</label>
    //   <button
    //     onClick={() => setShowPaymentMethod(true)}
    //     className={`w-full bg-[#0E2047]/40 rounded-xl p-3 border ${invalidPaymentMethod ? "border-red-500" : "border-[#0E2047]/40"} flex items-center justify-between smooth-transition hover:bg-[#0E2047]/60 hover:border-[#0E2047]/60`}
    //     // "w-full bg-[#0E2047]/40 rounded-xl p-3 border border-[#0E2047]/40 flex items-center justify-between smooth-transition hover:bg-[#0E2047]/60 hover:border-[#0E2047]/60"
    //   >
    //     <span className="font-medium text-white">
    //       {paymentMethod === "card"
    //         ? "Pay with Card"
    //         : selectedCrypto
    //           ? `Pay with ${selectedCrypto}`
    //           : "Select payment method"}
    //     </span>
    //     <span className="text-[#A0A0A0]">›</span>
    //   </button>
    // </div>

//     {/* Keypad */}
//     <div className="grid grid-cols-3 gap-2 mb-4 flex-1">
//       {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "backspace"].map((key) => (
//         <button
//           key={key}
//           onClick={() => handleKeypadPress(key)}
//           className="bg-transparent rounded-full p-2 text-sm font-normal text-white hover:bg-[#1C1C1C]/50 transition-colors border border-transparent hover:border-[#1C1C1C] active:border-[#0052FF] smooth-transition"
//         >
//           {key === "backspace" ? "←" : key}
//         </button>
//       ))}
//     </div>

//     {/* Continue Button */}
//     <Button
//       onClick={handleContinuePayment}
//       disabled={loading}

//       className="w-full bg-[#0052FF] text-white font-semibold py-5 text-base rounded-xl smooth-transition gradient-button"
//     >
//           {loading ? "Processing..." : `Continue to Payment`}
          
//     </Button>

//     {/* Modals */}
//     {showETFList && (
//       <div className="smooth-transition">
//         <ETFListModal
//           selectedETF={selectedETF}
//           onSelect={(etf) => {
//             setSelectedETF(etf)
//             setShowETFList(false)
//           }}
//           onClose={() => setShowETFList(false)}
//         />
//       </div>
//     )}

//     {showPaymentMethod && (
//       <div className="smooth-transition">
//         <PaymentMethodModal
//           onSelect={(method, crypto) => {
//             setPaymentMethod(method)
//             setSelectedCrypto(crypto)
//             setShowPaymentMethod(false)
//           }}
//           onClose={() => setShowPaymentMethod(false)}
//         />
//       </div>
//     )}
//     </div>)
  //  }

