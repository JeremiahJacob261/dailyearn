"use client"

import { Button } from "@/components/ui/button"

interface PayoutSuccessProps {
  onContinue: () => void
}

export function PayoutSuccess({ onContinue }: PayoutSuccessProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      {/* Confetti Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="confetti-container">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3", "#54a0ff"][
                  Math.floor(Math.random() * 7)
                ],
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* 3D Dollar Signs */}
        <div className="flex gap-4 mb-12">
         <img src="/icons/payout-jpy.png"/>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-semibold mb-6">Payout request success</h1>
        <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-12 max-w-md">
          Your payout request have been received and you will get payout within 3 business days.
        </p>

        <Button
          onClick={onContinue}
          className="w-full max-w-sm h-14 md:h-16 bg-lime-400 hover:bg-lime-500 text-black font-semibold text-lg md:text-xl rounded-2xl"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
