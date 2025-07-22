"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MobileLayout } from "@/components/mobile-layout";
import { ScrollingTicker } from "@/components/scrolling-ticker";
import { BottomNavigation } from "@/components/bottom-navigation";
import { databaseService } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";

export default function WalletPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [userData, setUserData] = useState<any>(null);
  const [balance, setBalance] = useState(0);
  const [recentPayouts, setRecentPayouts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (userData?.id) {
      loadRecentPayouts(userData.id);
    }
  }, [userData]);

  const loadUserData = async () => {
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
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecentPayouts = async (userId: string) => {
    try {
      const payouts = await databaseService.getUserPayouts(userId);
      setRecentPayouts(payouts);
    } catch (error) {
      toast({
        title: "Failed to load payouts",
        description: String(error),
        variant: "destructive",
      });
    }
  };

  const handlePayoutClick = () => {
    if (balance >= 5000) router.push("/wallet/payout");
  };

  const handleReferralsClick = () => {
    router.push("/referrals");
  };

  const handleHistoryClick = () => {
    // You can route to a history page if available
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
    <div className="min-h-screen bg-black pb-20">
      <MobileLayout>
        {/* Header */}
        <div className="flex items-center gap-4 px-6 pt-8 pb-4">
          <button onClick={() => router.back()}>
            <img
              src="/icons/arrow-left.svg"
              alt="back"
              className="w-auto h-auto bg-stone-600 p-2 rounded-full hover:bg-stone-700 transition-colors"
            />
          </button>
          <h1 className="text-3xl font-bold text-black dark:text-stone-400">Wallet</h1>
        </div>

        {/* Notification Ticker (optional, as in images) */}
        <div className="w-full overflow-x-auto bg-stone-500 dark:bg-[#181818] py-2 flex items-center px-4 gap-4">
          <div className="flex animate-scroll-x whitespace-nowrap gap-8 w-max">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#ff2d55] rounded-full flex items-center justify-center text-black dark:text-stone-400 font-bold">
                Q
              </div>
              <span className="text-black dark:text-stone-400 text-sm">
                demo....mail.com
                <span className="text-[#9BFF00]">.  payout .</span>processed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#ffcc00] rounded-full flex items-center justify-center text-black dark:text-stone-400 font-bold">
                K
              </div>
              <span className="text-black dark:text-stone-400 text-sm">demo....mail.com
                <span className="text-[#9BFF00]">. payout . </span>processed
              </span>
            </div>
          </div>
        </div>

        {/* Account Selector and Balance */}
        <div className="flex flex-col items-center mt-8 mb-6">
          <div className="bg-[#222] rounded-full px-6 py-2 flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-[#ffcc00] rounded-full flex items-center justify-center text-black dark:text-stone-400 font-bold">
              o
            </div>
            <span className="text-white dark:text-stone-400 text-base font-semibold">
              {userData?.email?.replace(/(.{4}).*(@.*)/, "$1....$2")}
            </span>
            <svg
              className="w-4 h-4 text-black dark:text-stone-400 opacity-60"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <div className="text-black dark:text-stone-400 text-6xl font-bold tracking-tight mb-2">
            ₦{balance.toLocaleString()}
          </div>
        </div>

        {/* Action Icons Row */}
        <div className="flex justify-center gap-10 mb-6">
          <div className="flex flex-col items-center">
            <button
              onClick={handlePayoutClick}
              disabled={balance < 5000}
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
                balance < 5000
                  ? "bg-[#222] opacity-50"
                  : "bg-[#222] hover:bg-[#333]"
              }`}
            >
              <img
                src="/icons/money-bag.svg"
                alt="Payout"
                className="w-8 h-8"
              />
            </button>
            <span className="text-black dark:text-stone-400 text-sm">Payout</span>
          </div>
          <div className="flex flex-col items-center">
            <button
              onClick={handleReferralsClick}
              className="w-16 h-16 rounded-full flex items-center justify-center mb-2 bg-[#222] hover:bg-[#333]"
            >
              <img
                src="/icons/_referral.svg"
                alt="Referrals"
                className="w-8 h-8"
              />
            </button>
            <span className="text-black dark:text-stone-400 text-sm">Referrals</span>
          </div>
          <div className="flex flex-col items-center">
            <button
              onClick={handleHistoryClick}
              className="w-16 h-16 rounded-full flex items-center justify-center mb-2 bg-[#222] hover:bg-[#333]"
            >
              <img src="/icons/history.svg" alt="History" className="w-8 h-8" />
            </button>
            <span className="text-black dark:text-stone-400 text-sm">History</span>
          </div>
        </div>

        {/* Payout unavailable warning */}
        {balance < 5000 && (
          <div className="bg-yellow-900 bg-opacity-80 border-l-4 border-yellow-400 text-yellow-200 px-4 py-3 mb-6 rounded flex items-center gap-3">
            <svg className="w-6 h-6 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
            <div>
              <span className="font-semibold">Payout unavailable</span><br />
              <span>You have not reached the payout threshold of ₦5000</span>
            </div>
          </div>
        )}

        {/* Empty state for payouts */}
        {recentPayouts.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[220px] w-full">
            <div className="text-black dark:text-stone-400 text-2xl md:text-3xl font-bold text-center mb-6">
              You do not have any<br />payouts currently
            </div>
            <button
              onClick={() => router.push("/tasks")}
              className="mt-2 px-8 py-3 rounded-full dark:bg-white bg-black text-white dark:text-black text-lg font-semibold shadow hover:scale-105 transition-all"
            >
              Perform tasks
            </button>
          </div>
        )}

        {/* Recent payouts */}
        <div className="px-6">
          <h2 className="text-black dark:text-stone-400 text-xl font-semibold mb-4">
            Recent payouts
          </h2>
          <div className="space-y-4">
            {recentPayouts.length === 0 ? (
              <p className="text-gray-400">No payouts yet.</p>
            ) : (
              recentPayouts.map((payout, index) => (
                <div
                  key={payout.id || index}
                  className="flex items-center gap-4 bg-[#181818] rounded-xl p-4"
                >
                  <div className="w-12 h-12 bg-lime-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <img
                      src="icons/dollar-bag.svg"
                      alt="Payout"
                      className="w-7 h-7"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white dark:text-stone-400 text-lg font-semibold">
                      Payout 1
                    </h3>
                    <p className="text-gray-400 text-sm">Watch ad and earn</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white dark:text-stone-400 text-lg font-semibold">
                      ₦{Number(payout.amount).toLocaleString()}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(payout.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </div>
  );
}
