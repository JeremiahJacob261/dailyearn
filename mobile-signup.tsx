"use client"

import { useState } from "react"
import { Eye, EyeOff, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Component() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-6 pt-3 pb-2 text-white font-semibold">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-white rounded-full"></div>
            <div className="w-1 h-3 bg-white rounded-full"></div>
            <div className="w-1 h-3 bg-white/60 rounded-full"></div>
            <div className="w-1 h-3 bg-white/60 rounded-full"></div>
          </div>
          <div className="ml-1">
            <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
              <path
                d="M1 5.5C1 5.5 3.5 1 7.5 1S14 5.5 14 5.5s-2.5 4.5-6.5 4.5S1 5.5 1 5.5z"
                stroke="white"
                strokeWidth="1"
                fill="none"
              />
              <path d="M7.5 7.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="white" />
            </svg>
          </div>
          <div className="w-6 h-3 border border-white rounded-sm ml-1">
            <div className="w-full h-full bg-white rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center px-6 pt-6 pb-4">
        <h1 className="text-3xl font-bold">Create account</h1>
        <button className="flex items-center text-stone-400 text-lg">
          Sign in
          <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      </div>

      {/* Subtitle */}
      <div className="px-6 pb-8">
        <p className="text-stone-400 text-base leading-relaxed">
          We value your time — and we pay for it. Secure and easy setup. Start earning instantly.
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fullname" className="text-white text-base font-normal">
            Full name
          </Label>
          <Input
            id="fullname"
            placeholder="Full name"
            className="bg-transparent border-stone-600 border-2 rounded-xl h-14 text-white placeholder:text-stone-500 focus:border-stone-400 focus:ring-0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-white text-base font-normal">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Email address"
            className="bg-transparent border-stone-600 border-2 rounded-xl h-14 text-white placeholder:text-stone-500 focus:border-stone-400 focus:ring-0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="referral" className="text-white text-base font-normal">
            Referral ID (Optional)
          </Label>
          <Input
            id="referral"
            placeholder="Referral ID"
            className="bg-transparent border-stone-600 border-2 rounded-xl h-14 text-white placeholder:text-stone-500 focus:border-stone-400 focus:ring-0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-white text-base font-normal">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="bg-transparent border-stone-600 border-2 rounded-xl h-14 text-white placeholder:text-stone-500 focus:border-stone-400 focus:ring-0 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-white text-base font-normal">
            Confirm password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              className="bg-transparent border-stone-600 border-2 rounded-xl h-14 text-white placeholder:text-stone-500 focus:border-stone-400 focus:ring-0 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="p-6 pb-8">
        <Button className="w-full h-14 bg-lime-400 hover:bg-lime-500 text-black font-semibold text-lg rounded-2xl">
          Continue
        </Button>
      </div>

      {/* Home Indicator */}
      <div className="flex justify-center pb-2">
        <div className="w-32 h-1 bg-white rounded-full"></div>
      </div>
    </div>
  )
}
