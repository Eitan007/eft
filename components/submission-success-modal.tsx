"use client"

import { useState, useEffect, useRef } from "react"
import { CheckCircle } from "lucide-react"

interface SubmissionSuccessModalProps {
  onSelect: (method: string) => void
  onClose: () => void
  onBackToInvestment: () => void
}


  export default function SubmissionSuccessModal({ onSelect, onClose, onBackToInvestment }: SubmissionSuccessModalProps) {
  const [showSubmissionSuccess, setShowSubmissionSuccess] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        if (showSubmissionSuccess) {
        //   setShowSubmissionSuccess(false)
        } else {
        //   onClose()
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose, showSubmissionSuccess])

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end animate-in fade-in duration-250">
      <div
        ref={modalRef}
        className="max-w-md mx-auto w-full bg-[#0D0D0D] p-6 rounded-t-3xl animate-in slide-in-from-bottom-10 duration-250 max-h-96 overflow-y-auto"
      >
        <div className="flex flex-col items-center justify-center mb-6 space-y-3">
          {/* <CheckCircle className="w-16 h-16 text-green-500" /> */}
          <div className="w-16 h-16 border-4 border-t-transparent border-green-500 rounded-full animate-spin"></div>
          <h2 className="text-2xl font-bold text-white">Payment Processing</h2>
        </div>

        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-gray-400 text-sm text-center">
          Please wait
          </p>
          <button
            onClick={onBackToInvestment}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-black font-semibold py-4 rounded-full hover:opacity-90 transition"
          >
            Back to Home Page
          </button>
        </div>
      </div>
    </div>
  )}
//     <div className="fixed inset-0 bg-black/50 z-50 flex items-end animate-in fade-in duration-250">
//     <div
//         ref={modalRef}
//         className="max-w-md mx-auto w-full bg-[#0D0D0D] p-6 rounded-t-3xl animate-in slide-in-from-bottom-10 duration-250 max-h-96 overflow-y-auto"
//         >
//         <div className="flex items-center justify-center mb-6">
            
//             <h2 className="text-2xl ml-8 font-bold text-white">Submission Successful</h2>
//             <div className="w-10" />
//         </div>

//         {/* ✅ Add this section */}
//         <div className="flex flex-col items-center justify-center space-y-4">
//             <p className="text-gray-400 text-sm text-center">
//             Your payment was successful.
//             </p>
//             <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-black font-semibold py-4 rounded-full hover:opacity-90 transition"
             
//             onClick={onBackToInvestment}
//             // className="w-full bg-[#0052FF] text-white font-semibold py-3 rounded-xl hover:bg-[#1A7FFF] transition"
//             >
//             Back to Investment Page
//             </button>
//         </div>
//     </div>
//     </div>
//   )
// }
