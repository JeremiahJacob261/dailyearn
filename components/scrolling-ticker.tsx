"use client"

import { useState } from "react"

interface TickerItem {
  id: number
  message: string
}

export function ScrollingTicker() {
  const [items] = useState<TickerItem[]>([
    { id: 1, message: "demo_mail.com payout processed" },
    { id: 2, message: "demo_mail.com payout processed" },
    { id: 3, message: "demo_mail.com payout processed" },
    { id: 4, message: "demo_mail.com payout processed" },
  ])

  return (
    <div className="relative overflow-hidden bg-gray-900 py-2">
      <div className="flex animate-scroll whitespace-nowrap">
        {[...items, ...items].map((item, index) => (
          <div key={`${item.id}-${index}`} className="flex items-center mx-4">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            <span className="text-gray-300 text-sm">{item.message}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
