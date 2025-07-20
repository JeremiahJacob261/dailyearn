"use client"

import { useState, useEffect } from "react"
import { X, Clock } from "lucide-react"
import { TaskData } from "@/lib/database"

interface TaskViewerProps {
  task: TaskData
  onComplete: () => void
  onClose: () => void
}

export function TaskViewer({ task, onComplete, onClose }: TaskViewerProps) {
  const [timer, setTimer] = useState(10)

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else {
      // When timer reaches 0, call onComplete
      onComplete()
    }
  }, [timer, onComplete])

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <iframe
        src={task.link}
        className="w-full h-full border-0"
        title={task.title}
        // sandbox attribute can enhance security but may break some ads. Use with caution.
        // sandbox="allow-scripts allow-same-origin"
      />
      {/* Header with timer and close button */}
      <div className="absolute top-0 left-0 right-0 p-4 pt-12 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
        <div className="bg-black/50 text-white rounded-full px-4 py-2 flex items-center gap-2">
          <Clock size={20} />
          {timer > 0 ? (
            <span>Reward in {timer} seconds</span>
          ) : (
            <span>Reward Granted!</span>
          )}
        </div>

        <button
          onClick={onClose}
          className="z-10 text-white bg-black/50 rounded-full p-2 hover:bg-black/70"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  )
} 