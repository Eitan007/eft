"use client"

import { useState, useEffect, useRef } from "react"
import { X, Search } from "lucide-react"

interface ETFListModalProps {
  selectedETF: string
  onSelect: (etf: string) => void
  onClose: () => void
}

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



export default function ETFListModal({ selectedETF, onSelect, onClose }: ETFListModalProps) {
  const [search, setSearch] = useState("")
  const modalRef = useRef<HTMLDivElement>(null)
  const [closing, setClosing] = useState(false)

  const handleClose = () => {
    setClosing(true)
    setTimeout(onClose, 300) // match enter duration
  }
  
  const filteredETFs = ETF_LIST.filter(
    (etf) =>
      etf.name.toLowerCase().includes(search.toLowerCase()) || etf.symbol.toLowerCase().includes(search.toLowerCase()),
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end animate-in fade-in duration-500">
      <div
        ref={modalRef}
        className={`max-w-md mx-auto w-full bg-[#0D0D0D] p-6 rounded-t-3xl animate-in slide-in-from-bottom-10 duration-300 h-[85vh] overflow-y-auto ${closing ? "animate-out slide-out-to-bottom-10" : "animate-in slide-in-from-top-10"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={handleClose} className="p-2 hover:bg-[#0E2047]/60 rounded-lg smooth-transition">
            <X className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-xl font-bold text-white">Select ETF</h2>
          <div className="w-10" />
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A0A0A0]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ETFs..."
            className="w-full bg-transparent text-white rounded-xl pl-12 pr-4 py-4 border border-[#1C1C1C] outline-none focus:border-[#0052FF]/50 smooth-transition placeholder:text-[#A0A0A0] font-medium"
          />
        </div>

        {/* ETF List */}
        <div className="space-y-2">
          {filteredETFs.map((etf) => (
            <button
              key={etf.symbol}
              onClick={() => onSelect(etf.symbol)}
              className={`w-full rounded-xl p-4 border smooth-transition flex items-center gap-4 ${
                selectedETF === etf.symbol
                  ? "border-transparent bg-[#0E2047]/50"
                  : "border-[#1C1C1C] hover:bg-transparent hover:border-[#0052FF]/60"
              }`}
            >
              <div className={`w-12 h-12 rounded-full  flex items-center justify-center text-sm ${etf.color}`}>
                {etf.symbol}
              </div>
              <div className="text-left">
                <p className="font-bold text-white">{etf.name}</p>
                <p className="text-sm text-[#A0A0A0] font-medium">{etf.symbol}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
