"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, RefreshCw, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MobileLayout } from "@/components/mobile-layout"
import { BottomNavigation } from "@/components/bottom-navigation"
import { TaskCard } from "@/components/task-card"
import { SuccessNotification } from "@/components/success-notification"

export default function Tasks() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showSuccess, setShowSuccess] = useState(false)
  const [completedTask, setCompletedTask] = useState<string | null>(null)

  const tasks = [
    { id: 1, title: "Task 1", description: "Watch ad and earn", reward: "₦2.00", duration: "10 seconds" },
    { id: 2, title: "Task 2", description: "Watch ad and earn", reward: "₦2.00", duration: "10 seconds" },
    { id: 3, title: "Task 3", description: "Watch ad and earn", reward: "₦2.00", duration: "10 seconds" },
    { id: 4, title: "Task 4", description: "Watch ad and earn", reward: "₦2.00", duration: "10 seconds" },
  ]

  useEffect(() => {
    const taskId = searchParams.get("task")
    if (taskId) {
      // Simulate task completion
      setTimeout(() => {
        setCompletedTask("₦2.00")
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 5000)
      }, 1000)
    }
  }, [searchParams])

  const handleTaskClick = (taskId: number) => {
    // Simulate starting a task
    setCompletedTask("₦2.00")
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 5000)
  }

  return (
    <div className="pb-20">
      {showSuccess && (
        <SuccessNotification
          message={`You have successfully earned ${completedTask} for this task`}
          onClose={() => setShowSuccess(false)}
        />
      )}

      <MobileLayout>
        {/* Header */}
        <div className="flex items-center gap-4 px-6 md:px-8 pt-8 md:pt-12 pb-6">
          <button onClick={() => router.back()}>
             <img
              src="/icons/arrow-left.svg"
              alt="gift"
              className="w-auto h-auto"
            />
          </button>
            <h1 className="text-2xl font-semibold text-white">Earn money</h1>
        </div>

        {/* Complete Tasks Card */}
        <div className="px-6 md:px-8 pb-8">
          <div className="bg-stone-800 rounded-2xl p-6 md:p-8 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-white text-xl md:text-2xl font-semibold mb-2">Complete tasks to earn</h3>
                <p className="text-stone-300 text-base md:text-lg mb-6">
                  Ensure you complete all tasks to be eligible for earnings and withdrawals!
                </p>
                <Button className="bg-white text-black hover:bg-stone-100 hover:scale-105 rounded-full px-6 py-2">Earn money</Button>
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
              alt="gift"
              className="absolute bottom-0 right-0 w-auto h-auto"
            />
          </div>
        </div>

        {/* Your Tasks */}
        <div className="px-6 md:px-8 pb-8">
          <h2 className="text-white text-2xl md:text-3xl font-semibold mb-6">Your tasks</h2>
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                reward={task.reward}
                duration={task.duration}
                onTaskClick={handleTaskClick}
              />
            ))}
          </div>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </div>
  )
}
