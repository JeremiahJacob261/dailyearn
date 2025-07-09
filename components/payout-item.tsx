"use client"

import { DollarSign } from "lucide-react"

interface PayoutItemProps {
  title: string
  description: string
  amount: string
  time: string
}

export function PayoutItem({ title, description, amount, time }: PayoutItemProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 md:w-16 md:h-16 bg-lime-400 rounded-2xl flex items-center justify-center flex-shrink-0">
        <img src="/icons/dollar-bag.svg" width={28}  height={28}/>
      </div>
      <div className="flex-1">
        <h3 className="text-white text-lg md:text-xl font-semibold">{title}</h3>
        <p className="text-gray-400 text-sm md:text-base">{description}</p>
      </div>
      <div className="text-right">
        <p className="text-white text-lg md:text-xl font-semibold">{amount}</p>
        <p className="text-gray-400 text-sm md:text-base">{time}</p>
      </div>
    </div>
  )
}
