"use client"

import { useState } from "react"
import { Eye, EyeOff, Lock, X } from "lucide-react"

interface PasswordVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  onVerifySuccess: () => void
  title?: string
  description?: string
}

export function PasswordVerificationModal({
  isOpen,
  onClose,
  onVerifySuccess,
  title = "Verify Your Password",
  description = "Please enter your password to continue"
}: PasswordVerificationModalProps) {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!password.trim()) {
      setError("Password is required")
      return
    }

    setIsVerifying(true)
    setError("")

    try {
      // Get user data from localStorage
      const storedUser = localStorage.getItem("user")
      if (!storedUser) {
        throw new Error("No user session found")
      }
      
      const user = JSON.parse(storedUser)
      
      // Import auth service dynamically to avoid circular imports
      const { authService } = await import("@/lib/auth")
      
      // Verify password
      await authService.verifyUserPassword(user.id, password)
      
      // Success - call the success callback
      onVerifySuccess()
      handleClose()
    } catch (error: any) {
      setError(error.message || "Invalid password")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleClose = () => {
    setPassword("")
    setError("")
    setShowPassword(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>

        {/* Title and Description */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-black dark:text-white mb-2">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isVerifying || !password.trim()}
              className="flex-1 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
