"use client";

import { useState, useEffect } from "react";
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
import { databaseService } from "@/lib/database";

export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [balance, setBalance] = useState(0);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    totalEarnings: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        router.push("/signin");
        return;
      }

      const user = JSON.parse(storedUser);

      // Fetch fresh user data
      const freshUserData = await databaseService.getUserData(user.id);
      if (freshUserData) {
        setUserData(freshUserData);
        setBalance(freshUserData.balance);

        // Update localStorage with fresh data
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: freshUserData.id,
            email: freshUserData.email,
            fullName: freshUserData.full_name,
            referralCode: freshUserData.referral_code,
            balance: freshUserData.balance,
          })
        );
      }

      // Fetch referral stats
      const stats = await databaseService.getReferralStats(user.id);
      setReferralStats(stats);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-400"></div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <div className="pb-20">
      <MobileLayout>
        {/* Balance Section */}
        <div className="px-6 md:px-8 pt-8 md:pt-12 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl md:text-3xl font-bold">
                  {userData?.full_name?.charAt(0).toUpperCase() || "U"}
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
              <span className="text-white text-sm md:text-base">
                Referrals ({referralStats.totalReferrals})
              </span>
            </button>
            <button
              onClick={() => router.push("/wallet")}
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
                <img src="/icons/table.svg" width={24} height={24} />
              </div>
              <span className="text-white text-sm md:text-base">Wallet</span>
            </button>
          </div>
        </div>

        {/* Referral Card */}
        <div className="px-6 md:px-8 pb-8">
          <div className="bg-stone-800 rounded-2xl p-6 md:p-8 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-white text-xl md:text-2xl font-bold mb-2">
                  Referral code = free money!
                </h3>
                <p className="text-stone-300 text-base md:text-lg mb-2">
                  Share your referral code and start with extra cash in your
                  wallet!
                </p>
                <p className="text-lime-400 text-sm font-medium mb-4">
                  Your code: {userData?.referral_code}
                </p>
                <Link href="/referrals">
                  <Button className="bg-lime-400 hover:bg-lime-500 text-black font-semibold rounded-full px-6 py-3">
                    Share your code
                  </Button>
                </Link>
              </div>
              <div className="ml-4">
                <img
                  src="/icons/gift.svg"
                  width={40}
                  height={40}
                  alt="gift"
                />
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <ChevronRight className="text-stone-600" size={24} />
            </div>
          </div>
        </div>

        {/* Your Tasks */}
        <div className="px-6 pb-8 space-y-5">
          <h2 className="text-white text-2xl font-semibold leading-[150%]">
            Your tasks
          </h2>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleTaskClick(task.id)}
                className="bg-stone-900 rounded-xl p-4 cursor-pointer hover:bg-stone-800 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="text-white text-lg font-semibold mb-1">
                      {task.title}
                    </h3>
                    <p className="text-stone-400 text-sm mb-2">
                      {task.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-lime-400 font-medium">
                        {task.reward}
                      </span>
                      <span className="text-stone-400">{task.duration}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <img
                      src="/icons/arrow-right.svg"
                      width={20}
                      height={20}
                      alt="arrow"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </div>
  );
}
