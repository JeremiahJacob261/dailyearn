"use client";

import { useState } from "react";
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

export default function Dashboard() {
  const router = useRouter();
  const [balance] = useState(2000);

  const tasks = [
    {
      id: 1,
      title: "Task 1",
      description: "Watch ad and earn",
      reward: "₦2.00",
      duration: "10 seconds",
    },
    {
      id: 2,
      title: "Task 2",
      description: "Watch ad and earn",
      reward: "₦2.00",
      duration: "10 seconds",
    },
    {
      id: 3,
      title: "Task 3",
      description: "Watch ad and earn",
      reward: "₦2.00",
      duration: "10 seconds",
    },
  ];

  const handleTaskClick = (taskId: number) => {
    router.push(`/tasks?task=${taskId}`);
  };

  return (
    <div className="pb-20">
      <MobileLayout>
        {/* Balance Section */}
        <div className="px-6 md:px-8 pt-8 md:pt-12 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl md:text-3xl font-semibold">
                  0
                </span>
              </div>
              <div>
                <p className="text-stone-400 text-base md:text-lg">
                  Total balance
                </p>
                <p className="text-white text-2xl font-semibold">
                  ₦ {balance.toLocaleString()}
                </p>
              </div>
            </div>
            <img src="/icons/nexxt.svg" width={24} height={24} />
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
              <span className="text-white text-sm md:text-base">Tasks</span>
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
              <span className="text-white text-sm md:text-base">Referrals</span>
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
              <span className="text-white text-sm md:text-base">Table</span>
            </button>
          </div>
        </div>

        {/* Referral Card */}
        <div className="px-6 md:px-8 pb-8">
          <div className="bg-stone-800 rounded-2xl p-6 md:p-8 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-white text-xl md:text-2xl font-semibold mb-2">
                  Referral code = free money!
                </h3>
                <p className="text-stone-300 text-base md:text-lg mb-6">
                  Share your referral code and start with extra cash in your
                  wallet!
                </p>
                <Link href="/referrals">
                  <Button className="bg-white text-black hover:bg-stone-100 hover:scale-105 rounded-full px-6 py-2">
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
          <h2 className="text-white text-2xl font-semibold leading-[150%]">
            Your tasks
          </h2>
          <div className="space-y-6">
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
  );
}
