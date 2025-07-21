"use client"

import { Check } from "lucide-react"

interface PasswordRequirementsProps {
  password: string
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const requirements = [
    { label: "Exactly 6 digits", test: password.length === 6 && /^\d{6}$/.test(password) },
  ]

  return (
    <div className="bg-stone-800 rounded-xl p-4 md:p-6 space-y-3 md:space-y-4">
      {requirements.map((req, index) => (
        <div key={index} className="flex items-center gap-3 md:gap-4">
          <Check className={`w-5 h-5 md:w-6 md:h-6 ${req.test ? "text-green-400" : "text-stone-500"}`} />
          <span className={`text-base md:text-lg ${req.test ? "text-white" : "text-stone-400"}`}>{req.label}</span>
        </div>
      ))}
    </div>
  )
}
