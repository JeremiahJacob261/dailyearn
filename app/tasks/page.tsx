"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, RefreshCw, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MobileLayout } from "@/components/mobile-layout"
import { BottomNavigation } from "@/components/bottom-navigation"
import { TaskCard } from "@/components/task-card"
import { SuccessNotification } from "@/components/success-notification"
import { databaseService, TaskData } from "@/lib/database";

export default function Tasks() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showSuccess, setShowSuccess] = useState(false)
  const [completedTask, setCompletedTask] = useState<string | null>(null)
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New state for active/completed/timer
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [taskTimers, setTaskTimers] = useState<{ [taskId: string]: number }>({});
  const [completedTaskIds, setCompletedTaskIds] = useState<{ [taskId: string]: boolean }>({});

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const dbTasks = await databaseService.getAllTasks();
      setTasks(dbTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Timer effect
  useEffect(() => {
    if (!activeTaskId) return;
    if (taskTimers[activeTaskId] === 0) return;
    if (taskTimers[activeTaskId] === undefined) return;
    const interval = setInterval(() => {
      setTaskTimers((prev) => ({
        ...prev,
        [activeTaskId]: Math.max(0, (prev[activeTaskId] || 0) - 1),
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTaskId, taskTimers]);

  // Start Task handler
  const handleStartTask = (task: TaskData) => {
    setActiveTaskId(task.id);
    setTaskTimers((prev) => ({ ...prev, [task.id]: 10 })); // 10s timer
    window.open(task.link, '_blank');
  };

  // Complete Task handler
  const handleCompleteTask = async (task: TaskData) => {
    // TODO: Call backend API to mark as complete and increment balance
    setCompletedTaskIds((prev) => ({ ...prev, [task.id]: true }));
    setCompletedTask(`₦${task.reward.toFixed(2)}`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
    setActiveTaskId(null);
  };

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
          {isLoading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : tasks.length === 0 ? (
            <div className="text-center text-gray-400">No tasks available.</div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task, idx) => (
                <TaskCard
                  key={task.id}
                  id={idx}
                  title={task.title}
                  description={task.description}
                  reward={`₦${task.reward.toFixed(2)}`}
                  duration={task.duration}
                  link={task.link}
                  isActive={activeTaskId === task.id}
                  isCompleted={!!completedTaskIds[task.id]}
                  timer={taskTimers[task.id] || 0}
                  onStart={() => handleStartTask(task)}
                  onComplete={() => handleCompleteTask(task)}
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
