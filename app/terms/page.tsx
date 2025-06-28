"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MobileLayout } from "@/components/mobile-layout"

export default function Terms() {
  const router = useRouter()

  const handleAgree = () => {
    router.push("/dashboard")
  }

  return (
    <MobileLayout>
      {/* Header */}
      <div className="px-6 md:px-8 pt-8 md:pt-12 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold">Do you agree?</h1>
      </div>

      {/* Terms Content */}
      <div className="flex-1 px-6 md:px-8 pb-8 md:pb-12 overflow-y-auto">
        <div className="space-y-6 md:space-y-8 text-stone-400 text-base md:text-lg leading-relaxed">
          <p>
            By creating an account, you confirm that you are at least 18 years old (or meet the minimum age requirement
            in your country), and you agree to our Terms of Use and Privacy Policy.
          </p>

          <p>
            You understand that this app allows users to earn rewards by watching sponsored video advertisements, and
            that earnings are subject to our rules, ad availability, and anti-fraud systems. We reserve the right to
            suspend, restrict, or terminate accounts that violate these terms, including but not limited to misuse,
            automated viewing, or any form of fraudulent activity.
          </p>

          <p>
            Your personal data, including your email and device information, may be collected and used in accordance
            with our Privacy Policy to personalize your experience, display relevant ads, and process payments.
          </p>

          <p>
            By continuing, you acknowledge that you have read, understood, and agreed to be bound by these terms, and
            consent to receive relevant updates or promotional messages from us.
          </p>
        </div>
      </div>

      {/* Agree Button */}
      <div className="p-6 md:p-8 pb-8 md:pb-12">
        <Button
          onClick={handleAgree}
          className="w-full h-14 md:h-16 bg-lime-400 hover:bg-lime-500 text-black font-semibold text-lg md:text-xl rounded-2xl"
        >
          I agree
        </Button>
      </div>
    </MobileLayout>
  )
}
