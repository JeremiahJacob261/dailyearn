"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileLayout } from "@/components/mobile-layout";
import { BottomNavigation } from "@/components/bottom-navigation";
import { ScrollingTicker } from "@/components/scrolling-ticker";
import { CopyNotification } from "@/components/copy-notification";

export default function Referrals() {
  const router = useRouter();
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [referralCode] = useState("REF123456");

  const spotlightUser = {
    name: "Danny walter",
    avatar: "D",
    referrals: 20,
    payout: 100000,
    color: "bg-red-500",
  };

  const userReferrals = [
    {
      id: 1,
      name: "Alex Graham",
      email: "demomail.com",
      amount: 10000,
      time: "2 weeks ago",
      color: "bg-orange-500",
    },
    {
      id: 2,
      name: "Alex Graham",
      email: "demomail.com",
      amount: 10000,
      time: "2 weeks ago",
      color: "bg-yellow-500",
    },
    {
      id: 3,
      name: "Alex Graham",
      email: "demomail.com",
      amount: 10000,
      time: "2 weeks ago",
      color: "bg-green-500",
    },
    {
      id: 4,
      name: "Alex Graham",
      email: "demomail.com",
      amount: 10000,
      time: "2 weeks ago",
      color: "bg-red-500",
    },
  ];

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setShowCopyNotification(true);
    setTimeout(() => setShowCopyNotification(false), 3000);
  };

  return (
    <div className="pb-20">
      <CopyNotification
        isVisible={showCopyNotification}
        onClose={() => setShowCopyNotification(false)}
      />

      <MobileLayout>
        {/* Header */}
        <div className="flex items-center justify-between px-6 md:px-8 pt-8 md:pt-12 pb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()}>
              <img
                src="/icons/arrow-left.svg"
                alt="gift"
                className="w-auto h-auto"
              />
            </button>
            <h1 className="text-2xl font-semibold text-white">Referrals</h1>
          </div>
            <div onClick={copyReferralCode} className="flex items-center gap-5 rounded-sm bg-[#1C250D] bg-opacity-50 px-2 py-2 cursor-pointer hover:scale-105">
              <img
                src="/icons/clips.svg"
                alt="gift"
                className="w-auto h-auto"
              />
              <span className="text-[#9BFF00] text-sm font-medium">Copy referral code</span>
            </div>
        </div>

        {/* Scrolling Ticker */}
        <ScrollingTicker />

        {/* Spotlight Section */}
        <div className="px-6 md:px-8 py-6">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="w-6 h-6 text-orange-500" />
            <h2 className="text-white text-xl md:text-2xl font-bold">
              Spotlight
            </h2>
          </div>

          <div className="flex flex-col items-center text-center">
            <div
              className={`w-20 h-20 md:w-24 md:h-24 ${spotlightUser.color} rounded-full flex items-center justify-center mb-4`}
            >
              <span className="text-white text-3xl md:text-4xl font-bold">
                {spotlightUser.avatar}
              </span>
            </div>
            <h3 className="text-white text-xl md:text-2xl font-bold mb-2">
              {spotlightUser.name}
            </h3>
            <p className="text-gray-400 text-base md:text-lg">
              {spotlightUser.referrals} referrals, ₦
              {spotlightUser.payout.toLocaleString()} payout
            </p>
          </div>
        </div>

        {/* Your Referrals */}
        <div className="px-6 md:px-8 pb-8">
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-6">
            Your referrals
          </h2>
          <div className="space-y-4">
            {userReferrals.map((referral) => (
              <div key={referral.id} className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 md:w-14 md:h-14 ${referral.color} rounded-full flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-white text-lg md:text-xl font-bold">
                    D
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white text-lg md:text-xl font-semibold">
                    {referral.name}
                  </h3>
                  <p className="text-gray-400 text-sm md:text-base">
                    {referral.email}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white text-lg md:text-xl font-semibold">
                    ₦{referral.amount.toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-sm md:text-base">
                    {referral.time}
                  </p>
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
