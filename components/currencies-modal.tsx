"use client"

import { useState, useEffect, useRef } from "react"
import { X, Search } from "lucide-react"

interface CurrencyListModalProps {
  selectedCurrency: string
  onSelect: (currency: string) => void
  onClose: () => void
}

const CURRENCY_LIST = [
    { code: "USD", name: "United States Dollar", flag: "🇺🇸" },
    { code: "GBP", name: "British Pound Sterling", flag: "🇬🇧" },
    { code: "EUR", name: "Euro", flag: "🇪🇺" },
    { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
    { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
    { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
    { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
    { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
    { code: "BRL", name: "Brazilian Real", flag: "🇧🇷" },
    { code: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
    { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬" },
    { code: "HKD", name: "Hong Kong Dollar", flag: "🇭🇰" },
    { code: "SEK", name: "Swedish Krona", flag: "🇸🇪" },
    { code: "ZAR", name: "South African Rand", flag: "🇿🇦" },
    { code: "MXN", name: "Mexican Peso", flag: "🇲🇽" },
    { code: "TRY", name: "Turkish Lira", flag: "🇹🇷" },
    { code: "KRW", name: "South Korean Won", flag: "🇰🇷" },
    { code: "RUB", name: "Russian Ruble", flag: "🇷🇺" },
  ]

export default function CurrencyListModal({ selectedCurrency, onSelect, onClose }: CurrencyListModalProps) {
  const [search, setSearch] = useState("")
  const [closing, setClosing] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  const handleClose = () => {
    setClosing(true)
    setTimeout(onClose, 300)
  }

  const filteredCurrencies = CURRENCY_LIST.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) handleClose()
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end animate-in fade-in duration-500">
      <div
        ref={modalRef}
        className={`max-w-md mx-auto w-full bg-[#0D0D0D] p-6 rounded-t-3xl animate-in slide-in-from-bottom-10 duration-300 h-[85vh] overflow-y-auto ${
          closing ? "animate-out slide-out-to-bottom-10" : "animate-in slide-in-from-top-10"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={handleClose} className="p-2 hover:bg-[#0E2047]/60 rounded-lg">
            <X className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-xl font-bold text-white">Select Currency</h2>
          <div className="w-10" />
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A0A0A0]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search currencies..."
            className="w-full bg-transparent text-white rounded-xl pl-12 pr-4 py-4 border border-[#1C1C1C] outline-none focus:border-[#0052FF]/50 placeholder:text-[#A0A0A0] font-medium"
          />
        </div>

        {/* Currency List */}
        <div className="space-y-2">
          {filteredCurrencies.map((c) => (
            <button
              key={c.code}
              onClick={() => onSelect(c.code)}
              className={`w-full rounded-xl p-4 border flex items-center gap-4 ${
                selectedCurrency === c.code
                  ? "border-transparent bg-[#0E2047]/50"
                  : "border-[#1C1C1C] hover:border-[#0052FF]/60"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-[#0052FF]/20 flex items-center justify-center text-2xl">
                {c.flag}
              </div>
              <div className="text-left">
                <p className="font-bold text-white">{c.name}</p>
                <p className="text-sm text-[#A0A0A0] font-medium">{c.code}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
