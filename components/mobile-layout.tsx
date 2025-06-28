"use client"

import type { ReactNode } from "react"

interface MobileLayoutProps {
  children: ReactNode
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col max-w-md mx-auto md:max-w-lg lg:max-w-xl">
      {/* Content */}
      <div className="flex-1 flex flex-col">{children}</div>

      {/* Home Indicator - only show on mobile */}
      <div className="flex justify-center pb-2 md:hidden">
        <div className="w-32 h-1 bg-white rounded-full"></div>
      </div>
    </div>
  )
}
