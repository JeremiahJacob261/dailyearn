"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MobileLayout } from "@/components/mobile-layout"
import { Alert } from "@/components/ui/alert"
import { authService } from "@/lib/auth"

export default function SignIn() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning', message: string } | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email.trim() || !formData.password.trim()) {
      setAlert({ type: 'error', message: 'Please fill in all fields' })
      return
    }

    setIsLoading(true)
    setAlert(null)

    try {
      await authService.signIn(formData)
      
      setAlert({ type: 'success', message: 'Successfully signed in!' })
      
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (error: any) {
      setAlert({ type: 'error', message: error.message || 'Failed to sign in' })
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
        <h1 className="text-3xl md:text-4xl font-semibold text-black dark:text-stone-400">Sign in</h1>
        <button onClick={() => router.push("/")} className="flex items-center text-gray-500 dark:text-stone-400 text-lg md:text-xl">
          Create account
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
          <Label htmlFor="email" className="text-black dark:text-stone-400 text-base font-normal">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="bg-transparent border-stone-600 border-2 rounded-xl h-14 md:h-16 text-black dark:text-stone-400 placeholder:text-gray-500 dark:placeholder:text-stone-400 focus:border-stone-400 focus:ring-0"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-black dark:text-stone-400 text-base font-normal">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="bg-transparent border-stone-600 border-2 rounded-xl h-14 md:h-16 text-black dark:text-stone-400 placeholder:text-gray-500 dark:placeholder:text-stone-400 focus:border-stone-400 focus:ring-0 pr-12"
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

        <div className="text-left">
          <button type="button" className="text-gray-500 dark:text-stone-400 text-base md:text-lg hover:text-gray-700 dark:hover:text-stone-300 transition-colors">
            Forgot password?
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

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
                Signing In...
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
