"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MobileLayout } from "@/components/mobile-layout"
import { VerificationInput } from "@/components/verification-input"
import { Alert } from "@/components/ui/alert"
import { authService } from "@/lib/auth"

export default function Verification() {
  const router = useRouter()
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning', message: string } | null>(null)

  const handleCodeComplete = (code: string) => {
    setVerificationCode(code)
  }

  const handleContinue = async () => {

        router.push("/dashboard")
    // if (verificationCode.length !== 5) {
    //   setAlert({ type: 'error', message: 'Please enter the complete verification code' })
    //   return
    // }

    // setIsLoading(true)
    // setAlert(null)

    // try {
    //   await authService.verifyEmail(verificationCode)
      
    //   setAlert({ type: 'success', message: 'Email verified successfully!' })
      
    //   setTimeout(() => {
    //     router.push("/dashboard")
    //   }, 1500)
    // } catch (error: any) {
    //   setAlert({ type: 'error', message: error.message || 'Failed to verify email' })
    // } finally {
    //   setIsLoading(false)
    // }
  }

  return (
    <MobileLayout>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Header */}
      <div className="px-6 md:px-8 pt-8 md:pt-12 pb-6">
        <h1 className="text-3xl md:text-4xl font-semibold">Verification code</h1>
      </div>

      {/* Subtitle */}
      <div className="px-6 md:px-8 pb-12 md:pb-16">
        <p className="text-stone-400 text-base md:text-lg leading-relaxed">
          We've sent a verification code to your email. You will receive an e-mail within the next minute.
        </p>
      </div>

      {/* Verification Input */}
      <div className="px-6 md:px-8 pb-8">
        <VerificationInput onCodeComplete={handleCodeComplete} disabled={isLoading} />
      </div>

      {/* Continue Button */}
      <div className="px-6 md:px-8 pt-8 pb-8 md:pb-12">
        <Button
          onClick={handleContinue}
          className="w-full h-14 md:h-16 bg-lime-400 hover:bg-lime-500 text-black font-semibold text-lg md:text-xl rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          disabled={isLoading || verificationCode.length !== 5}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            'Continue'
          )}
        </Button>
      </div>
    </MobileLayout>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>
}
