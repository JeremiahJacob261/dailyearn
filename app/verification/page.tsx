"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MobileLayout } from "@/components/mobile-layout"
import { VerificationInput } from "@/components/verification-input"

export default function Verification() {
  const router = useRouter()
  const [verificationCode, setVerificationCode] = useState("")

  const handleCodeComplete = (code: string) => {
    setVerificationCode(code)
  }

  const handleContinue = () => {
    if (verificationCode.length === 5) {
      router.push("/terms")
    }
  }

  return (
    <MobileLayout>
      {/* Header */}
      <div className="px-6 md:px-8 pt-8 md:pt-12 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white">Verification code</h1>
      </div>

      {/* Subtitle */}
      <div className="px-6 md:px-8 pb-12 md:pb-16">
        <p className="text-gray-500 dark:text-stone-400 text-base md:text-lg leading-relaxed">
          We've sent a verification code to demomail.com. You will receive an e-mail within the next minute.
        </p>
      </div>

      {/* Verification Input */}
      <div className="px-6 md:px-8 pb-12 md:pb-16">
        <div className="space-y-6 md:space-y-8">
          <Label className="text-black dark:text-white text-base md:text-lg font-normal">Verification code</Label>
          <VerificationInput length={5} onComplete={handleCodeComplete} />
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Continue Button */}
      <div className="p-6 md:p-8 pb-8 md:pb-12">
        <Button
          onClick={handleContinue}
          disabled={verificationCode.length !== 5}
          className="w-full h-14 md:h-16 bg-lime-400 hover:bg-lime-500 text-black font-semibold text-lg md:text-xl rounded-2xl disabled:opacity-50"
        >
          Continue
        </Button>
      </div>
    </MobileLayout>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>
}