"use client"

import { DollarSign } from "lucide-react"

interface TaskCardProps {
  title: string
  description: string
  reward: string
  duration: string
  isCompleted: boolean
  onTaskClick: () => void
}

export function TaskCard({
  title,
  description,
  reward,
  duration,
  isCompleted,
  onTaskClick,
}: TaskCardProps) {
  return (
    <button
      onClick={onTaskClick}
      disabled={isCompleted}
      className="flex items-center gap-4 w-full p-4 rounded-xl bg-transparent hover:bg-neutral-900 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
    >
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
        {!isCompleted ? (
          <div className="mt-2 px-4 py-1 bg-white text-black rounded-full text-sm font-semibold">
            Start Task
          </div>
        ) : (
          <div className="mt-2 text-green-400 font-bold">Completed!</div>
        )}
      </div>
    </button>
  )
}
