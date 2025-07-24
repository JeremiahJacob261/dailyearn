"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, RefreshCw, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MobileLayout } from "@/components/mobile-layout"
import { BottomNavigation } from "@/components/bottom-navigation"
import { TaskCard } from "@/components/task-card"
import { SuccessNotification } from "@/components/success-notification"
import { databaseService, TaskData } from "@/lib/database"
import { TaskViewer } from "@/components/task-viewer" // Import the new component

export default function Tasks() {
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastReward, setLastReward] = useState<string | null>(null)
  const [tasks, setTasks] = useState<TaskData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  const [activeTask, setActiveTask] = useState<TaskData | null>(null)
  const [completedTaskIds, setCompletedTaskIds] = useState<{ [taskId: string]: boolean }>({})
  const [taskCooldowns, setTaskCooldowns] = useState<{ [taskId: string]: number }>({})

  useEffect(() => {
    // Get current user from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setUserId(user.id)
    }
    loadTasks()
  }, [])

  useEffect(() => {
    // Load completed tasks when userId is available
    if (userId) {
      loadCompletedTasks()
      loadTaskCooldowns()
    }
  }, [userId])

  const loadTasks = async () => {
    try {
      setIsLoading(true)
      const dbTasks = await databaseService.getAllTasks()
      setTasks(dbTasks)
    } catch (error) {
      console.error("Error loading tasks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadCompletedTasks = async () => {
    if (!userId) return
    try {
      const completedTaskIds = await databaseService.getUserCompletedTasks(userId)
      const completedObj = completedTaskIds.reduce((acc, taskId) => {
        acc[taskId] = true
        return acc
      }, {} as { [taskId: string]: boolean })
      setCompletedTaskIds(completedObj)
    } catch (error) {
      console.error("Error loading completed tasks:", error)
    }
  }

  const loadTaskCooldowns = async () => {
    if (!userId) return
    try {
      const cooldownPromises = tasks.map(async (task) => {
        const cooldownInfo = await databaseService.getTaskCooldownInfo(userId, task.id)
        return { taskId: task.id, cooldownMinutes: cooldownInfo.timeRemaining || 0 }
      })
      
      const cooldownResults = await Promise.all(cooldownPromises)
      const cooldownObj = cooldownResults.reduce((acc, { taskId, cooldownMinutes }) => {
        acc[taskId] = cooldownMinutes
        return acc
      }, {} as { [taskId: string]: number })
      
      setTaskCooldowns(cooldownObj)
    } catch (error) {
      console.error("Error loading task cooldowns:", error)
    }
  }

  useEffect(() => {
    // Reload cooldowns when tasks are loaded
    if (userId && tasks.length > 0) {
      loadTaskCooldowns()
    }
  }, [userId, tasks])

  // Add countdown timer to update cooldowns every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTaskCooldowns(prev => {
        const updated = { ...prev }
        let hasChanges = false
        Object.keys(updated).forEach(taskId => {
          if (updated[taskId] > 0) {
            updated[taskId] = Math.max(0, updated[taskId] - 1)
            hasChanges = true
          }
        })
        return hasChanges ? updated : prev
      })
    }, 1000) // Update every second

    return () => clearInterval(interval)
  }, [])

  const handleTaskStart = async (task: TaskData) => {
    if (!userId) return
    
    // Check if task is on cooldown
    const cooldownInfo = await databaseService.getTaskCooldownInfo(userId, task.id)
    if (!cooldownInfo.canComplete) {
      alert(`Please wait ${cooldownInfo.timeRemaining} minutes before attempting this task again.`)
      return
    }
    
    setActiveTask(task)
  }

  const handleTaskComplete = async () => {
    if (!activeTask || !userId) return

    try {
      // Use the new completeTask method that handles balance increment and transaction logging
      await databaseService.completeTask(userId, activeTask.id, activeTask.reward)
      
      // Mark task as completed on frontend and update cooldown
      setCompletedTaskIds(prev => ({ ...prev, [activeTask.id]: true }))
      
      // Get dynamic cooldown time from settings
      const cooldownSeconds = await databaseService.getCooldownSeconds()
      setTaskCooldowns(prev => ({ ...prev, [activeTask.id]: cooldownSeconds }))
      
      setLastReward(`₦${activeTask.reward.toFixed(2)}`)
      setShowSuccess(true)

      // Close the viewer and show success message
      setActiveTask(null)
      setTimeout(() => setShowSuccess(false), 5000)
      
      // Reload data to get fresh state
      loadCompletedTasks()
      loadTaskCooldowns()
    } catch (error) {
      console.error("Error completing task:", error)
      // Show specific error message
      if (error instanceof Error && error.message.includes('completed recently')) {
        alert("You have completed this task recently. Please wait before trying again.")
        loadTaskCooldowns() // Refresh cooldown info
      } else {
        alert("Failed to complete task. Please try again.")
      }
      setActiveTask(null)
    }
  }

  const handleViewerClose = () => {
    setActiveTask(null)
  }

  return (
    <div className="pb-20">
      {activeTask && (
        <TaskViewer
          task={activeTask}
          onComplete={handleTaskComplete}
          onClose={handleViewerClose}
        />
      )}

      {showSuccess && (
        <SuccessNotification
          message={`You have successfully earned ${lastReward} for this task!`}
          onClose={() => setShowSuccess(false)}
        />
      )}

      <MobileLayout>
        {/* Header */}
        <div className="flex items-center gap-4 px-6 md:px-8 pt-8 md:pt-12 pb-6">
          <button onClick={() => router.back()}>
            <img
              src="/icons/arrow-left.svg"
              alt="Back"
              className="w-auto h-auto bg-stone-600 p-2 rounded-full hover:bg-stone-700 transition-colors"
            />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Earn money</h1>
        </div>

        {/* Complete Tasks Card */}
        <div className="px-6 md:px-8 pb-8">
          <div className="bg-stone-800 rounded-2xl p-6 md:p-8 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-white text-xl md:text-2xl font-semibold mb-2">
                  Complete tasks to earn
                </h3>
                <p className="text-stone-300 text-base md:text-lg mb-6">
                  Ensure you complete all tasks to be eligible for earnings and withdrawals!
                </p>
                <Button className="bg-white text-black hover:bg-stone-100 hover:scale-105 rounded-full px-6 py-2">
                  Earn money
                </Button>
              </div>
              <div className="ml-4">
                <img
                  src="/icons/loading.svg"
                  width={24}
                  height={24}
                  alt="dollar"
                />
              </div>
            </div>
            <img
              src="/icons/stickes.svg"
              alt="decoration"
              className="absolute bottom-0 right-0 w-auto h-auto"
            />
          </div>
        </div>

        {/* Your Tasks */}
        <div className="px-6 md:px-8 pb-8">
          <h2 className="dark:text-white text-stone-900 text-2xl md:text-3xl font-semibold mb-6">Your tasks</h2>
          {isLoading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : tasks.length === 0 ? (
            <div className="text-center text-gray-400">No tasks available.</div>
          ) : (
            <div className="space-y-4">
              {tasks.map(task => (
                <TaskCard
                  key={task.id}
                  title={task.title}
                  description={task.description}
                  reward={`₦${task.reward.toFixed(2)}`}
                  duration={task.duration}
                  isCompleted={!!completedTaskIds[task.id]}
                  cooldownMinutes={taskCooldowns[task.id] || 0}
                  onTaskClick={() => handleTaskStart(task)}
                />
              ))}
            </div>
          )}
        </div>
      </MobileLayout>
      <BottomNavigation />
    </div>
  )
}
