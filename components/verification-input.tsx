"use client"

import { useState, useRef, type KeyboardEvent } from "react"

interface VerificationInputProps {
  length: number
  onComplete: (code: string) => void
}

export function VerificationInput({ length, onComplete }: VerificationInputProps) {
  const [values, setValues] = useState<string[]>(new Array(length).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newValues = [...values]
    newValues[index] = value
    setValues(newValues)

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newValues.every((v) => v !== "")) {
      onComplete(newValues.join(""))
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  return (
    <div className="flex gap-4 justify-center">
      {values.map((value, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="w-16 h-16 md:w-20 md:h-20 bg-transparent border-2 border-stone-600 rounded-xl text-center text-2xl md:text-3xl font-semibold text-white focus:border-stone-400 focus:outline-none"
        />
      ))}
    </div>
  )
}
