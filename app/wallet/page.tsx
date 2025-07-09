"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  Banknote,
  Users,
  History,
  CheckCircle,
} from "lucide-react";
import { MobileLayout } from "@/components/mobile-layout";
import { PayoutItem } from "@/components/payout-item"
import { BottomNavigation } from "@/components/bottom-navigation";
import { ScrollingTicker } from "@/components/scrolling-ticker";

export default function WalletPage() {
  const router = useRouter();
  const [balance] = useState(5000);
  const [selectedAccount] = useState("demo_mail.com");

  const recentPayouts = [
    {
      title: "Payout 1",
      description: "Watch ad and earn",
      amount: "₦10,000.00",
      time: "4d ago",
    },
    {
      title: "Payout 1",
      description: "Watch ad and earn",
      amount: "₦10,000.00",
      time: "4d ago",
    },
    {
      title: "Payout 1",
      description: "Watch ad and earn",
      amount: "₦10,000.00",
      time: "4d ago",
    },
  ];

  const handlePayoutClick = () => {
    router.push("/wallet/payout");
  };

  const handleReferralsClick = () => {
    router.push("/referrals");
  };

  const handleHistoryClick = () => {
    // Handle history navigation
  };

  return (
    <div className="pb-20">
      <MobileLayout>
        {/* Header */}
        <div className="flex items-center gap-4 px-6 md:px-8 pt-8 md:pt-12 pb-4">
          <button onClick={() => router.back()}>
              <img
                src="/icons/arrow-left.svg"
                alt="gift"
                width={24}
                height={24}
              />
          </button>
          <h1 className="text-2xl md:text-3xl font-semibold text-white">Wallet</h1>
        </div>

        {/* Scrolling Ticker */}
        <ScrollingTicker />

        {/* Account Selector */}
        <div className="px-6 md:px-8 py-6 flex justify-center">
          <button className="flex items-center gap-3 bg-gray-800 rounded-full px-6 py-3">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">O</span>
            </div>
            <span className="text-white text-lg font-medium">
              {selectedAccount}
            </span>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Balance Display */}
        <div className="px-6 md:px-8 pb-8 text-center">
          <h2 className="text-white text-6xl md:text-7xl font-semibold">
            ₦{balance.toLocaleString()}
          </h2>
        </div>

        {/* Action Buttons */}
        {/* Quick Actions */}
        <div className="px-6 md:px-8 pb-8">
          <div className="flex justify-around">
            <button
              onClick={() => router.push("/wallet/payout")}
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
                <img src="/icons/money-bag.svg" width={24} height={24} />
              </div>
              <span className="text-white text-sm md:text-base">Payout</span>
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
                <img src="/icons/history.svg" width={24} height={24} />
              </div>
              <span className="text-white text-sm md:text-base">History</span>
            </button>
          </div>
        </div>

        {/* Payout Available Card */}
        <div className="px-6 md:px-8 pb-8">
          <div className="bg-green-900/30 border border-green-700 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-700 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-300" />
              </div>
              <div>
                <h3 className="text-white text-lg md:text-xl font-semibold mb-1">
                  Payout available
                </h3>
                <p className="text-gray-300 text-sm md:text-base">
                  You can now request for payout on your account
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Payouts */}
        <div className="px-6 md:px-8 pb-8">
          <h3 className="text-white text-2xl md:text-3xl font-semibold mb-6">
            Recent payouts
          </h3>
          <div className="space-y-6">
            {recentPayouts.map((payout, index) => (
              <PayoutItem
                key={index}
                title={payout.title}
                description={payout.description}
                amount={payout.amount}
                time={payout.time}
              />
            ))}
          </div>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </div>
  );
}
