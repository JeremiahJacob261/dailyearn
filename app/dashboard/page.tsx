"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  CheckSquare,
  Users,
  BarChart3,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileLayout } from "@/components/mobile-layout";
import Link from "next/link";
import { BottomNavigation } from "@/components/bottom-navigation";
import { TaskCard } from "@/components/task-card";
import { databaseService, UserData, TaskData } from "@/lib/database";
import { ThemeToggle } from "@/components/theme-toggle"

export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [balance, setBalance] = useState(0);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [completedTaskIds, setCompletedTaskIds] = useState<{ [taskId: string]: boolean }>({});
  const [taskCooldowns, setTaskCooldowns] = useState<{ [taskId: string]: number }>({});

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        router.push("/signin");
        return;
      }
      const user = JSON.parse(storedUser);
      const freshUserData = await databaseService.getUserData(user.id);
      if (freshUserData) {
        setUserData(freshUserData);
        setBalance(freshUserData.balance);
        
        // Load completed tasks and cooldowns
        const completedTaskIds = await databaseService.getUserCompletedTasks(freshUserData.id);
        const completedObj = completedTaskIds.reduce((acc, taskId) => {
          acc[taskId] = true;
          return acc;
        }, {} as { [taskId: string]: boolean });
        setCompletedTaskIds(completedObj);
      }
      const dbTasks = await databaseService.getAllTasks();
      setTasks(dbTasks);
      
      // Load cooldowns for tasks
      if (freshUserData) {
        loadTaskCooldowns(freshUserData.id, dbTasks);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTaskCooldowns = async (userId: string, taskList: TaskData[]) => {
    try {
      const cooldownPromises = taskList.map(async (task) => {
        const cooldownInfo = await databaseService.getTaskCooldownInfo(userId, task.id);
        return { taskId: task.id, cooldownMinutes: cooldownInfo.timeRemaining || 0 };
      });
      
      const cooldownResults = await Promise.all(cooldownPromises);
      const cooldownObj = cooldownResults.reduce((acc, { taskId, cooldownMinutes }) => {
        acc[taskId] = cooldownMinutes;
        return acc;
      }, {} as { [taskId: string]: number });
      
      setTaskCooldowns(cooldownObj);
    } catch (error) {
      console.error("Error loading task cooldowns:", error);
    }
  };

  // Add countdown timer to update cooldowns every minute
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
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const handleTaskClick = (taskId: string) => {
    router.push(`/tasks?task=${taskId}`);
  };

  return (
    <div className="pb-20">
      <MobileLayout>
        {/* Theme Toggle at the top right */}
       
        {/* Balance Section */}
        <div className="px-6 md:px-8 pt-8 md:pt-12 pb-6">
          <div className="flex items-center justify-between">
            <button
              className="flex items-center gap-4 focus:outline-none"
              style={{ background: "none", border: "none", padding: 0, margin: 0 }}
              onClick={() => router.push("/profile")}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-black dark:text-white text-2xl md:text-3xl font-bold">
                  $
                </span>
              </div>
              <div>
                              <div>
                <p className="text-stone-400 dark:text-stone-400 text-base md:text-lg">
                  Total balance
                </p>
                <p className="text-black dark:text-white text-2xl font-semibold">
                  ₦ {balance.toLocaleString()}
                </p>
              </div>
              </div>
            </button>
            <img src="/icons/nexxt.svg" width={45} height={45} 
            className="p-2 dark:bg-inherit bg-stone-400 rounded-full" alt="Nexxt Logo"
            onClick={() => router.push("/profile")}/>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 md:px-8 pb-8">
          <div className="flex justify-around">
            <button
              onClick={() => router.push("/tasks")}
              className="flex flex-col items-center gap-2"
            >
              <div
                style={{
                  width: "61px",
                  height: "61px",
                  padding: "10px",
                  margin: "10px",
                }}
                className=" bg-stone-800 rounded-full flex items-center justify-center"
              >
                <img src="/icons/task-edit-02.svg" width={24} height={24} />
              </div>
              <span className="text-black dark:text-white text-sm md:text-base">Tasks</span>
            </button>
            <button
              onClick={() => router.push("/referrals")}
              className="flex flex-col items-center gap-2"
            >
              <div
                style={{
                  width: "61px",
                  height: "61px",
                  padding: "10px",
                  margin: "10px",
                }}
                className=" bg-stone-800 rounded-full flex items-center justify-center"
              >
                <img src="/icons/_referral.svg" width={24} height={24} />
              </div>
              <span className="text-stone-900 dark:text-stone-100 text-sm md:text-base">Referrals</span>
            </button>
            <button className="flex flex-col items-center gap-2">
              <div
                style={{
                  width: "61px",
                  height: "61px",
                  padding: "10px",
                  margin: "10px",
                }}
                className=" bg-stone-800 rounded-full flex items-center justify-center"
              >
                <img src="/icons/table.svg" width={24} height={24} />
              </div>
              <span className="text-black dark:text-white text-sm md:text-base">Table</span>
            </button>
          </div>
        </div>

        {/* Referral Card */}
        <div className="px-6 md:px-8 pb-8">
          <div className="bg-gray-200 dark:bg-stone-800 rounded-2xl p-6 md:p-8 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-black dark:text-white text-xl md:text-2xl font-bold mb-2">
                  Referral code = free money!
                </h3>
                <p className="text-gray-600 dark:text-stone-300 text-base md:text-lg mb-6">
                  Share your referral code and start with extra cash in your
                  wallet!
                </p>
                <Link href="/referrals">
                  <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-stone-100 hover:scale-105 rounded-full px-6 py-2">
                    How it works
                  </Button>
                </Link>
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
              src="/icons/gift.svg"
              alt="gift"
              className="absolute bottom-0 right-0 w-auto h-auto"
            />
          </div>
        </div>

        {/* Your Tasks */}
        <div className="px-6 pb-8 space-y-5">
          <h2 className="text-black dark:text-white text-2xl font-semibold leading-[150%]">
            Your tasks
          </h2>
          {isLoading ? (
            <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
          ) : tasks.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">No tasks available.</div>
          ) : (
            <div className="space-y-6">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  title={task.title}
                  description={task.description}
                  reward={`₦${task.reward.toFixed(2)}`}
                  duration={task.duration}
                  isCompleted={!!completedTaskIds[task.id]}
                  cooldownMinutes={taskCooldowns[task.id] || 0}
                  onTaskClick={() => handleTaskClick(task.id)}
                />
              ))}
            </div>
          )}
        </div>
      </MobileLayout>
      <BottomNavigation />
    </div>
  );
}