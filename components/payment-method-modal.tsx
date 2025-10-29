"use client"

import { useState, useEffect, useRef } from "react"
import { X, CreditCard, Bitcoin } from "lucide-react"

interface PaymentMethodModalProps {
  onSelect: (method: string, crypto?: string) => void
  onClose: () => void
}

const CRYPTO_OPTIONS = [
  { name: "Ethereum", symbol: "ETH", icon: "⟠" },
  { name: "Bitcoin", symbol: "BTC", icon: "₿" },
  { name: "USDC (Base)", symbol: "USDC", icon: "💵" },
]

export default function PaymentMethodModal({ onSelect, onClose }: PaymentMethodModalProps) {
  const [showCryptoOptions, setShowCryptoOptions] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        if (showCryptoOptions) {
          setShowCryptoOptions(false)
        } else {
          onClose()
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose, showCryptoOptions])

  if (showCryptoOptions) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end animate-in fade-in duration-250">
        <div
          ref={modalRef}
          className="max-w-md mx-auto w-full bg-[#0D0D0D] p-6 rounded-t-3xl animate-in slide-in-from-bottom-10 duration-250 max-h-96 overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setShowCryptoOptions(false)}
              className="p-2 hover:bg-[#0E2047]/60 rounded-lg smooth-transition"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <h2 className="text-xl font-bold text-white">Select Crypto</h2>
            <div className="w-10" />
          </div>

          <div className="space-y-2">
            {CRYPTO_OPTIONS.map((crypto) => (
              <button
                key={crypto.symbol}
                onClick={() => onSelect("crypto", crypto.symbol)}
                className="w-full bg-[#0E2047]/50 rounded-xl p-4 border border-[#0E2047] smooth-transition hover:bg-[#0E2047]/60 hover:border-[#0052FF]/60 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-[#0052FF]/20 flex items-center justify-center text-2xl">
                  {crypto.icon}
                </div>
                <div className="text-left">
                  <p className="font-bold text-white">{crypto.name}</p>
                  <p className="text-sm text-[#A0A0A0] font-medium">{crypto.symbol}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end animate-in fade-in duration-250">
{/* <div className="absolute inset-0 bg-[#0D0D0D] flex flex-col p-6 pb-20 overflow-hidden"> */}

      <div
        ref={modalRef}
        className="max-w-md mx-auto w-full bg-[#0D0D0D] p-6 rounded-t-3xl animate-in slide-in-from-bottom-10 duration-250 max-h-96 overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="p-2 hover:bg-[#0E2047]/60 rounded-lg smooth-transition">
            <X className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-xl font-bold text-white">Payment Method</h2>
          <div className="w-10" />
        </div>

        <div className="space-y-2">
          <button
            onClick={() => onSelect("card")}
            className="w-full bg-[#0E2047]/50 rounded-xl p-4 border border-[#0E2047] smooth-transition hover:bg-[#0E2047]/60 hover:border-[#0052FF]/60 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-[#0052FF]/20 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-[#0052FF]" />
            </div>
            <p className="font-bold text-white">Pay with Card</p>
          </button>

          <button
            onClick={() => setShowCryptoOptions(true)}
            className="w-full bg-[#0E2047]/50 rounded-xl p-4 border border-[#0E2047] smooth-transition hover:bg-[#0E2047]/60 hover:border-[#0052FF]/60 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-[#0052FF]/20 flex items-center justify-center">
              <Bitcoin className="w-6 h-6 text-[#0052FF]" />
            </div>
            <p className="font-bold text-white">Pay with Crypto</p>
          </button>
        </div>
      </div>
    </div>
  )
}
