"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MobileLayout } from "@/components/mobile-layout";
import { BottomNavigation } from "@/components/bottom-navigation";
import { databaseService } from "@/lib/database";

export default function WalletPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [balance, setBalance] = useState(0);
  const [selectedAccount] = useState("demo_mail.com");
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
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const recentPayouts = [
    {
      title: "Referral Bonus",
      description: "New user signup",
      amount: "₦10.00",
      time: "2d ago",
    },
    {
      title: "Task Completion",
      description: "Watch ad and earn",
      amount: "₦2.00",
      time: "3d ago",
    },
    {
      title: "Referral Bonus",
      description: "New user signup",
      amount: "₦10.00",
      time: "1w ago",
    },
  ];

  const handlePayoutClick = () => {
    router.push("/wallet/payout");
  };

  const handleReferralsClick = () => {
    router.push("/referrals");
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
        {/* Header */}
        <div className="flex items-center justify-between px-6 md:px-8 pt-8 md:pt-12 pb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()}>
              <img
                src="/icons/arrow-left.svg"
                alt="back"
                className="w-auto h-auto"
              />
            </button>
            <h1 className="text-2xl font-semibold text-white">Wallet</h1>
          </div>
        </div>

        {/* Balance Section */}
        <div className="px-6 md:px-8 pb-6">
          <div className="bg-gradient-to-r from-lime-600 to-lime-400 rounded-2xl p-6 text-black">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-black opacity-70 text-sm">
                  Available Balance
                </p>
                <h2 className="text-4xl font-bold">
                  ₦{balance.toLocaleString()}
                </h2>
              </div>
              <div className="text-right">
                <p className="text-black opacity-70 text-sm">Account</p>
                <p className="text-black font-semibold">{userData?.email}</p>
              </div>
            </div>
            <Button
              onClick={handlePayoutClick}
              className="bg-white text-black hover:bg-stone-100 font-semibold px-6 py-3 rounded-lg"
            >
              Withdraw Funds
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 md:px-8 pb-6">
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={handleReferralsClick}
              className="bg-stone-900 hover:bg-stone-800 text-white font-semibold py-4 rounded-xl"
            >
              View Referrals
            </Button>
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-stone-900 hover:bg-stone-800 text-white font-semibold py-4 rounded-xl"
            >
              Earn More
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="px-6 md:px-8 pb-8">
          <h2 className="text-white text-xl font-semibold mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentPayouts.map((payout, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-stone-900 rounded-xl p-4"
              >
                <div className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-black text-sm font-bold">₦</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white text-lg font-semibold">
                    {payout.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {payout.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white text-lg font-semibold">
                    {payout.amount}
                  </p>
                  <p className="text-gray-400 text-sm">{payout.time}</p>
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
