"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MobileLayout } from "@/components/mobile-layout"
import { PasswordRequirements } from "@/components/password-requirements"
import { Alert } from "@/components/ui/alert"
import { authService } from "@/lib/auth"

export default function CreateAccount() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isValidatingReferral, setIsValidatingReferral] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning', message: string } | null>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    referralId: "",
    password: "",
    confirmPassword: "",
  })

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setAlert({ type: 'error', message: 'Full name is required' })
      return false
    }
    
    if (!formData.email.trim()) {
      setAlert({ type: 'error', message: 'Email is required' })
      return false
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setAlert({ type: 'error', message: 'Please enter a valid email address' })
      return false
    }
    
    if (formData.password.length !== 6) {
      setAlert({ type: 'error', message: 'Password must be exactly 6 digits' })
      return false
    }
    
    if (!/^\d{6}$/.test(formData.password)) {
      setAlert({ type: 'error', message: 'Password must contain only 6 digits' })
      return false
    }
    
    if (formData.password !== formData.confirmPassword) {
      setAlert({ type: 'error', message: 'Passwords do not match' })
      return false
    }
    
    return true
  }

  const handleReferralValidation = async (referralCode: string) => {
    if (!referralCode.trim()) return

    setIsValidatingReferral(true)
    try {
      await authService.validateReferralCode(referralCode)
      setAlert({ type: 'success', message: 'Valid referral code!' })
    } catch (error: any) {
      setAlert({ type: 'error', message: error.message || 'Invalid referral code' })
    } finally {
      setIsValidatingReferral(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setAlert(null)

    try {
      const result = await authService.signUp({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        referralId: formData.referralId || undefined,
      })

      // Store signup data for verification
      localStorage.setItem("signupData", JSON.stringify({
        ...formData,
        userId: result.user.id,
        verificationCode: result.verificationCode
      }))
      
      setAlert({ type: 'success', message: 'Account created successfully!' })
      
      setTimeout(() => {
        router.push("/terms")
      }, 1500)
    } catch (error: any) {
      setAlert({ type: 'error', message: error.message || 'Failed to create account' })
    } finally {
      setIsLoading(false)
    }
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
      <div className="flex justify-between items-center px-6 md:px-8 pt-8 md:pt-12 pb-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-black dark:text-white">Create account</h1>
        <button onClick={() => router.push("/signin")} className="flex items-center text-gray-500 dark:text-stone-400 text-lg md:text-xl">
          Sign in
          <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      </div>

      {/* Subtitle */}
      <div className="px-6 md:px-8 pb-8 md:pb-10">
        <p className="text-gray-500 dark:text-stone-400 text-base md:text-lg leading-relaxed">
          We value your time — and we pay for it. Secure and easy setup. Start earning instantly.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 px-6 md:px-8 space-y-6 md:space-y-8">
        <div className="space-y-2">
          <Label htmlFor="fullname" className="text-black dark:text-white text-base font-normal">
            Full name
          </Label>
          <Input
            id="fullname"
            placeholder="Full name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="bg-transparent border-stone-600 border-2 rounded-xl h-14 md:h-16 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-stone-400 focus:border-stone-400 focus:ring-0"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-black dark:text-white text-base font-normal">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="bg-transparent border-stone-600 border-2 rounded-xl h-14 md:h-16 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-stone-400 focus:border-stone-400 focus:ring-0"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="referral" className="text-white text-base font-normal">
            Referral ID (Optional)
          </Label>
          <div className="relative">
            <Input
              id="referral"
              placeholder="Referral ID"
              value={formData.referralId}
              onChange={(e) => setFormData({ ...formData, referralId: e.target.value })}
              onBlur={(e) => handleReferralValidation(e.target.value)}
              className="bg-transparent border-stone-600 border-2 rounded-xl h-14 md:h-16 text-white placeholder:text-stone-500 focus:border-stone-400 focus:ring-0"
              disabled={isLoading}
            />
            {isValidatingReferral && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-black dark:text-white text-base font-normal">
            Password (6 digits)
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="6-digit password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="bg-transparent border-stone-600 border-2 rounded-xl h-14 md:h-16 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-stone-400 focus:border-stone-400 focus:ring-0 pr-12"
              maxLength={6}
              pattern="[0-9]{6}"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-stone-400"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {formData.password && <PasswordRequirements password={formData.password} />}

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-black dark:text-white text-base font-normal">
            Confirm password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm 6-digit password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="bg-transparent border-stone-600 border-2 rounded-xl h-14 md:h-16 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-stone-400 focus:border-stone-400 focus:ring-0 pr-12"
              maxLength={6}
              pattern="[0-9]{6}"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-stone-400"
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Continue Button */}
        <div className="pt-8 pb-8 md:pb-12">
          <Button
            type="submit"
            className="w-full h-14 md:h-16 bg-lime-400 hover:bg-lime-500 text-black font-semibold text-lg md:text-xl rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </div>
      </form>
    </MobileLayout>
  )
}
