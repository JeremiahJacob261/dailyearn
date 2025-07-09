"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MobileLayout } from "@/components/mobile-layout"
import { PayoutSuccess } from "@/components/payout-success"

export default function PayoutRequest() {
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)
  const [availableAmount] = useState(5000)
  const [payoutAmount, setPayoutAmount] = useState("4500")
  const [formData, setFormData] = useState({
    fullName: "",
    accountName: "",
    accountNumber: "",
    bank: "Opay",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuccess(true)
  }

  const handleSuccessContinue = () => {
    setShowSuccess(false)
    router.push("/wallet")
  }

  if (showSuccess) {
    return <PayoutSuccess onContinue={handleSuccessContinue} />
  }

  return (
    <MobileLayout>
      {/* Header */}
      <div className="px-6 md:px-8 pt-8 md:pt-12 pb-6">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => router.back()}>
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Request payout</h1>
        </div>
        <p className="text-gray-400 text-base md:text-lg">Fill wisely, any mistake done cannot be changed</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 px-6 md:px-8 space-y-6 md:space-y-8">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-white text-base md:text-lg font-normal">
            Full name
          </Label>
          <Input
            id="fullName"
            placeholder="Full name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="bg-transparent border-gray-600 border-2 rounded-xl h-14 md:h-16 text-white placeholder:text-gray-500 focus:border-gray-400 focus:ring-0"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountName" className="text-white text-base md:text-lg font-normal">
            Account name
          </Label>
          <Input
            id="accountName"
            placeholder="Account name"
            value={formData.accountName}
            onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
            className="bg-transparent border-gray-600 border-2 rounded-xl h-14 md:h-16 text-white placeholder:text-gray-500 focus:border-gray-400 focus:ring-0"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountNumber" className="text-white text-base md:text-lg font-normal">
            Account number
          </Label>
          <Input
            id="accountNumber"
            placeholder="Account number"
            value={formData.accountNumber}
            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
            className="bg-transparent border-gray-600 border-2 rounded-xl h-14 md:h-16 text-white placeholder:text-gray-500 focus:border-gray-400 focus:ring-0"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bank" className="text-white text-base md:text-lg font-normal">
            Choose bank
          </Label>
          <div className="relative">
            <select
              id="bank"
              value={formData.bank}
              onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
              className="w-full bg-transparent border-gray-600 border-2 rounded-xl h-14 md:h-16 text-white px-4 focus:border-gray-400 focus:ring-0 appearance-none"
              required
            >
              <option value="Opay" className="bg-gray-800">
                Opay
              </option>
              <option value="GTBank" className="bg-gray-800">
                GTBank
              </option>
              <option value="Access Bank" className="bg-gray-800">
                Access Bank
              </option>
              <option value="First Bank" className="bg-gray-800">
                First Bank
              </option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-white text-base md:text-lg font-normal">
            Amount (available for payout ₦{availableAmount.toLocaleString()})
          </Label>
          <div className="flex items-center">
            <span className="text-lime-400 text-6xl md:text-7xl font-bold">{payoutAmount}</span>
            <span className="text-gray-400 text-4xl md:text-5xl font-bold ml-2">NGN</span>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Continue Button */}
        <div className="pt-8 pb-8 md:pb-12">
          <Button
            type="submit"
            className="w-full h-14 md:h-16 bg-lime-400 hover:bg-lime-500 text-black font-semibold text-lg md:text-xl rounded-2xl"
          >
            Continue
          </Button>
        </div>
      </form>
    </MobileLayout>
  )
}
