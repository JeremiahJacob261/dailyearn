"use client"

import { Copy } from "lucide-react"

interface CopyNotificationProps {
  isVisible: boolean
  onClose: () => void
}

export function CopyNotification({ isVisible, onClose }: CopyNotificationProps) {
  if (!isVisible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
    <div className="relative z-10 mx-4 mt-8 md:mx-8">
        <div className="bg-stone-800 rounded-xl p-4 md:p-6 flex items-center gap-3 md:gap-4 shadow-2xl" onClick={onClose}>
          <div className="w-10 h-[38px] bg-black rounded-[10px] flex items-center justify-center">
        <img
          src="/icons/clipboard.svg"
          alt="gift"
          className="w-auto h-auto"
        />
          </div>
          <div className="flex-1">
        <h3 className="text-white font-semibold text-base md:text-lg">
          Referral code copied!
        </h3>
        <p className="text-stone-300 text-sm ">You have copied your referral code. Share with friends to earn money</p>
          </div>
        </div>
      </div>
      </div>
  )
}
