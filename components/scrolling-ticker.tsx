"use client"

import { useState } from "react"

interface TickerItem {
  id: number
  initials:string,
  message: string
}

export function ScrollingTicker() {
  const [items] = useState<TickerItem[]>([
    { id: 1,initials:"G", message: "demo_mail.com payout processed" },
    { id: 2,initials:"M", message: "demo_mail.com payout processed" },
    { id: 3,initials:"K", message: "demo_mail.com payout processed" },
    { id: 4,initials:"J", message: "demo_mail.com payout processed" },
  ])

  return (
    <div className="relative overflow-hidden bg-gray-900 py-2">
      <marquee>
      <div className="flex animate-scroll whitespace-nowrap">
        {[...items, ...items].map((item, index) => (
          <div key={`${item.id}-${index}`} className="flex items-center mx-4">
            <div className="w-6 h-6 bg-red-500 justify-center text-center font-semibold rounded-full mr-2">{item.initials}</div>
            <span className="text-white text-sm">
              {item.message.split(' ').map((word, wordIndex) => (
                <span key={wordIndex} className={wordIndex === 1 ? "text-[#9BFF00]" : ""}>
                  {word}{wordIndex < item.message.split(' ').length - 1 ? ' ' : ''}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
      </marquee>
    </div>
  )
}
