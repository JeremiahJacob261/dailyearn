"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MobileLayout } from "@/components/mobile-layout"

export default function SignIn() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle sign in logic here
    console.log("Sign in:", formData)
  }

  return (
    <MobileLayout>
      {/* Header */}
      <div className="flex justify-between items-center px-6 md:px-8 pt-8 md:pt-12 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold">Sign in</h1>
        <button onClick={() => router.push("/")} className="flex items-center text-stone-400 text-lg md:text-xl">
          Create account
          <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      </div>

      {/* Subtitle */}
      <div className="px-6 md:px-8 pb-8 md:pb-10">
        <p className="text-stone-400 text-base md:text-lg leading-relaxed">
          We value your time — and we pay for it. Secure and easy setup. Start earning instantly.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 px-6 md:px-8 space-y-6 md:space-y-8">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white text-base font-normal">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="bg-transparent border-stone-600 border-2 rounded-xl h-14 md:h-16 text-white placeholder:text-stone-500 focus:border-stone-400 focus:ring-0"
            required
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
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="bg-transparent border-stone-600 border-2 rounded-xl h-14 md:h-16 text-white placeholder:text-stone-500 focus:border-stone-400 focus:ring-0 pr-12"
              required
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

        <div className="text-left">
          <button type="button" className="text-stone-400 text-base md:text-lg">
            Forgot password?
          </button>
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
