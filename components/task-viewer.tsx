"use client"

import { useState, useEffect } from "react"
import { X, Clock, ExternalLink } from "lucide-react"
import { TaskData } from "@/lib/database"

interface TaskViewerProps {
  task: TaskData
  onComplete: () => void
  onClose: () => void
}

export function TaskViewer({ task, onComplete, onClose }: TaskViewerProps) {
  const [timer, setTimer] = useState(10)
  const [linkOpened, setLinkOpened] = useState(false)

  useEffect(() => {
    // Open the task link in a new tab when component mounts
    if (task.link && !linkOpened) {
      window.open(task.link, '_blank', 'noopener,noreferrer')
      setLinkOpened(true)
    }
  }, [task.link, linkOpened])

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

  const handleRetryLink = () => {
    if (task.link) {
      window.open(task.link, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
      {/* Main content card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Task info */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {task.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {task.description}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Link opened in new tab. Complete the task and return here.
          </p>
        </div>

        {/* Timer display */}
        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6 text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {timer > 0 ? `${timer} seconds` : "Time's up!"}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {timer > 0 ? (
              "You'll receive your reward automatically"
            ) : (
              <span className="text-green-600 dark:text-green-400 font-semibold">
                Reward Granted! ₦{task.reward.toFixed(2)}
              </span>
            )}
          </p>
        </div>

        {/* Retry link button */}
        <button
          onClick={handleRetryLink}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <ExternalLink size={20} />
          Open Link Again
        </button>
      </div>
    </div>
  )
} 