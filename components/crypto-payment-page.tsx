"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Copy, Check, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import QRCode from "react-qr-code"
import SubmissionSuccessModal from "./submission-success-modal"

interface CryptoPaymentPageProps {
  amount: string
  crypto: string
  onBack: () => void
}

// Example conversion rates (update with live API if needed)
const rates: Record<string, number> = {
  btc: 0.000016,     // ≈ $62,500/BTC
  eth: 0.00028,      // ≈ $3,600/ETH
  usdc: 1,           // stablecoin
};

// Determine accurate network based on crypto type
const getNetwork = (crypto: string) => {
  switch (crypto.toLowerCase()) {
    case "btc":
    case "bitcoin":
      return "Bitcoin";
    case "eth":
    case "ethereum":
      return "Ethereum";
    case "usdc":
    case "usdc (base)":
      return "Base (Ethereum L2)";
    default:
      return "Unknown Network";
  }
};

// Calculate crypto equivalent
const getCryptoEquivalent = (crypto: string, amount: string) => {
  const rate = rates[crypto.toLowerCase()] || 0;
  return (parseFloat(amount) * rate).toFixed(6);
};




export default function CryptoPaymentPage({ amount, crypto, onBack }: CryptoPaymentPageProps) {
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 mins in seconds
  const walletAddress = "0xFF103...6e2bc0B660"
  const fullAddress = "0xFF103a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e2bc0B660"
  const [showSubmissionSuccess, setShowSubmissionSuccess] = useState(false)

  let network = getNetwork(crypto);
  let cryptoEquivalent = getCryptoEquivalent(crypto, amount);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fullAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = () => {
    // simulate async payment confirmation
    setLoading(true)
    
    const delay = Math.floor(Math.random() * (7000 - 4000 + 1)) + 4000

    setTimeout(() => {
      setLoading(false)
      setShowSubmissionSuccess(true);
    }, delay)
  }

  // if (showSuccess) {
  //   return <PaymentCryptoSuccess amount={amount} onBack={onBack} /> // ✅ show success page
  // }

  return (
//  <div className="absolute inset-0 bg-[#0D0D0D] flex flex-col p-6 pb-20 overflow-auto">
 <div className="space-y-30 h-screen bg-black text-white flex flex-col overflow-auto">
{/* <div className="h-screen bg-black text-white flex flex-col overflow-auto"> */}
    {/* <div className="bg-[#0D0D0D] p-6 flex flex-col h-screen overflow-hidden"> */}
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="p-2 hover:bg-[#0E2047] rounded-lg smooth-transition">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white">{formatTime(timeLeft)}</h1>
        <div className="w-10" />
      </div>

      {/* QR Code */}
      <div className="flex flex-col items-center mb-4">
        <button
          onClick={() => setShowQR(!showQR)}
          className="w-48 h-48 rounded-2xl p-4 mb-3 flex items-center justify-center smooth-transition bg-transparent"
        >
          {showQR ? (
            <QRCode value={fullAddress} size={176} />
          ) : (
            <div className="text-center">
              <div className="w-[88px] h-[88px] mx-auto mb-2 rounded-full flex items-center justify-center">
                <QrCode className="w-22 h-22 text-[#0052FF]" />
              </div>
              <p className="text-gray-400 font-medium text-sm">Tap to show QR</p>
            </div>
          )}
        </button>
      </div>

      {/* Wallet Address */}
      <div className="mb-4">
        <label className="text-sm text-[#A0A0A0] mb-1 block">Your {crypto} address</label>

        <div className="rounded-xl p-3 border border-[#1C1C1C] flex items-center justify-between bg-transparent hover:bg-[#1C1C1C] smooth-transition">

        {/* <div className="bg-[#0E2047] rounded-xl p-3 border border-[#1C1C1C] flex items-center justify-between"> */}
          <span className="font-mono text-white text-xs">{walletAddress}</span>
          <button
            onClick={handleCopy}
            className="px-3 py-1 bg-[#0052FF] hover:bg-[#1A7FFF] text-white rounded-lg font-medium flex items-center gap-2 smooth-transition text-sm"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Coin Details */}
      <div className="bg-[#0E2047] rounded-xl p-4 border border-[#0E2047] mb-3 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-[#A0A0A0]">Coin</span>
          <span className="font-bold text-white">{crypto}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#A0A0A0]">Network</span>
          <span className="font-bold text-white">{network}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#A0A0A0]">Amount</span>
          <span className="font-bold text-white">{cryptoEquivalent} {crypto}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#A0A0A0]"> </span>
          <span className="font-bold text-[#A0A0A0]">$ {amount}</span>
        </div>
      </div>

      <div>
          <>
            <h3 className="font-bold text-white mb-2 text-sm">Payment Steps:</h3>
            <ol className="space-y-2 text-xs text-[#A0A0A0]">
              <li className="flex gap-2">
                <span className="font-bold text-white">1.</span>
                <span>Scan the QR code to initiate your {crypto} payment</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-white">2.</span>
                <span>Copy the {crypto} address below and send the required amount</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-white">3.</span>
                <span>Your transaction will be confirmed on the blockchain</span>
              </li>
              </ol>
          </>
      </div>


      {/* Note */}
      <div className="bg-[#0E2047] rounded-xl p-3 border border-transparent mb-3 bg-transparent">
        <p className="text-xs text-[#A0A0A0] text-center">
          Transactions may take a few minutes to complete. Please complete the payment within 30 minutes.
        </p>
      </div>

      {/* Submit Button */}
      <div className="px-10 ">
      <Button
        onClick={handleSubmit}
        disabled={loading}
        // className="w-full bg-[#0052FF] text-white font-semibold py-5 text-base rounded-xl smooth-transition gradient-button"
        className="text-md h-full w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-black font-semibold py-4 rounded-full hover:opacity-90 transition" 
      >
          {loading ? "Processing..." : `Submit Payment`}
      </Button>
      </div>
      {/* submission success */}
      {showSubmissionSuccess && (
      <div className="smooth-transition">
        <SubmissionSuccessModal
          onSelect={() => {}}
          onClose={() => {
            setShowSubmissionSuccess(false)
          }}
          onBackToInvestment={()=> {
            setShowSubmissionSuccess(false)
            onBack()  
          }}
        />
      </div>
    )}
    </div>
  )
}
