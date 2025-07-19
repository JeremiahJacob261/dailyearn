"use client"

import { DollarSign } from "lucide-react"

interface TaskCardProps {
  id: number
  title: string
  description: string
  reward: string
  duration: string
  link: string
  isActive: boolean
  isCompleted: boolean
  timer: number
  onStart: () => void
  onComplete: () => void
}

export function TaskCard({
  title,
  description,
  reward,
  duration,
  link,
  isActive,
  isCompleted,
  timer,
  onStart,
  onComplete,
}: TaskCardProps) {
  return (
    <div className="flex items-center gap-4 w-full p-4 rounded-xl bg-transparent hover:bg-neutral-900 transition-colors">
      <div className="w-16 h-16 bg-lime-400 rounded-2xl flex items-center justify-center">
        <img src="/icons/dolar-coin.svg" width={28} height={28} alt="dollar" />
      </div>
      <div className="flex-1 text-left">
        <h3 className="text-white text-lg md:text-xl font-semibold">{title}</h3>
        <p className="text-stone-400 text-base md:text-lg">{description}</p>
      </div>
      <div className="text-right">
        <p className="text-white text-lg font-medium">{reward}</p>
        <p className="text-stone-400 text-sm md:text-base">{duration}</p>
        {/* Action Buttons */}
        {!isCompleted && !isActive && (
          <button
            className="mt-2 px-4 py-1 bg-white text-black rounded-full text-sm font-semibold hover:bg-stone-100"
            onClick={onStart}
          >
            Start Task
          </button>
        )}
        {isActive && timer > 0 && (
          <div className="mt-2 text-lime-400 font-bold">Wait {timer}s...</div>
        )}
        {isActive && timer === 0 && !isCompleted && (
          <button
            className="mt-2 px-4 py-1 bg-lime-400 text-black rounded-full text-sm font-semibold hover:bg-lime-300"
            onClick={onComplete}
          >
            Complete Task
          </button>
        )}
        {isCompleted && (
          <div className="mt-2 text-green-400 font-bold">Completed!</div>
        )}
      </div>
    </div>
  )
}
