"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MobileLayout } from "@/components/mobile-layout";
import { BottomNavigation } from "@/components/bottom-navigation";
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
          <div className="flex justify-between items-center">
            <div>
              <p className="text-stone-400 text-lg">Your balance</p>
              <h1 className="text-white text-4xl md:text-5xl font-bold">
                ₦{balance.toLocaleString()}
              </h1>
            </div>
            <div className="text-right">
              <p className="text-stone-400 text-sm">Welcome back,</p>
              <p className="text-white text-lg font-semibold">
                {userData?.full_name || "User"}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 md:px-8 pb-6">
          <div className="grid grid-cols-2 gap-4">
            <Link href="/wallet">
              <Button className="w-full bg-lime-400 hover:bg-lime-500 text-black font-semibold py-4 rounded-xl">
                Withdraw
              </Button>
            </Link>
            <Link href="/referrals">
              <Button className="w-full bg-stone-800 hover:bg-stone-700 text-white font-semibold py-4 rounded-xl">
                Referrals ({referralStats.totalReferrals})
              </Button>
            </Link>
          </div>
        </div>

        {/* Referral Stats */}
        <div className="px-6 md:px-8 pb-6">
          <div className="bg-gradient-to-r from-lime-600 to-lime-400 rounded-2xl p-6 text-black">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold">Referral Earnings</h2>
                <p className="text-lg">
                  ₦{referralStats.totalEarnings.toLocaleString()}
                </p>
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
            <div className="flex justify-between items-center">
              <div>
                <p className="text-black opacity-80 mb-2">
                  Share your referral code and earn ₦10 for each signup!
                </p>
                <p className="text-sm font-medium">
                  Your code: {userData?.referral_code}
                </p>
              </div>
              <Link href="/referrals">
                <Button className="bg-white text-black hover:bg-stone-100 hover:scale-105 rounded-full px-6 py-2">
                  Share
                </Button>
              </Link>
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
