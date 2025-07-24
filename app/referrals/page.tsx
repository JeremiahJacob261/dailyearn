"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Flame } from "lucide-react";
import { MobileLayout } from "@/components/mobile-layout";
import { BottomNavigation } from "@/components/bottom-navigation";
import { ScrollingTicker } from "@/components/scrolling-ticker";
import { CopyNotification } from "@/components/copy-notification";
import { databaseService, ReferralData, UserData } from "@/lib/database";

export default function Referrals() {
  const router = useRouter();
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [referralCode, setReferralCode] = useState<string>("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [referrals, setReferrals] = useState<ReferralData[]>([]);
  const [stats, setStats] = useState<{ totalReferrals: number; totalEarnings: number }>({ totalReferrals: 0, totalEarnings: 0 });
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
      const freshUserData = await databaseService.getUserData(user.id);
      if (freshUserData) {
        setUserData(freshUserData);
        setReferralCode(freshUserData.referral_code);
        // Fetch referrals and stats
        const [userReferrals, userStats] = await Promise.all([
          databaseService.getUserReferrals(freshUserData.id),
          databaseService.getReferralStats(freshUserData.id),
        ]);
        setReferrals(userReferrals);
        setStats(userStats);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyReferralCode = () => {
    if (!referralCode) return;
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
                alt="back"
                className="w-auto h-auto bg-stone-600 p-2 rounded-full hover:bg-stone-700 transition-colors"
              />
            </button>
            <h1 className="text-2xl font-semibold text-black dark:text-white">Referrals</h1>
          </div>
          <div onClick={copyReferralCode} className="flex items-center gap-5 rounded-sm bg-[#1C250D] bg-opacity-50 px-2 py-2 cursor-pointer hover:scale-105">
            <img
              src="/icons/clips.svg"
              alt="copy"
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
            <h2 className="text-black dark:text-white text-xl md:text-2xl font-bold">Spotlight</h2>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className={`w-20 h-20 md:w-24 md:h-24 bg-red-500 rounded-full flex items-center justify-center mb-4`}>
              <span className="text-black dark:text-white text-3xl md:text-4xl font-bold">
                {userData?.full_name?.[0] || "?"}
              </span>
            </div>
            <h3 className="text-black dark:text-white text-xl md:text-2xl font-bold mb-2">
              {userData?.full_name || "-"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg">
              {stats.totalReferrals} referrals, ₦{stats.totalEarnings.toLocaleString()} payout<br/>
              ₦50 per referral
            </p>
          </div>
        </div>
        {/* Your Referrals */}
        <div className="px-6 md:px-8 pb-8">
          <h2 className="dark:text-white text-stone-700 text-2xl md:text-3xl font-bold mb-6">Your referrals</h2>
          {isLoading ? (
            <div className="text-center dark:text-gray-400 text-gray-950">Loading...</div>
          ) : referrals.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[220px] w-full">
              <div className="text-stone-700 dark:text-stone-100 text-2xl md:text-3xl font-bold text-center mb-6">
                You do not have any<br />referrals currently
              </div>
              <button
                onClick={copyReferralCode}
                className="mt-2 px-8 py-3 rounded-full bg-white text-black text-lg font-semibold shadow hover:scale-105 transition-all"
              >
                Copy code
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {referrals.map((referral) => (
                <div key={referral.id} className="flex items-center gap-4">
                  <div className={`w-12 h-12 md:w-14 md:h-14 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0`}>
                    <span className="text-black dark:text-white text-lg md:text-xl font-bold">
                      {referral.referred_user?.full_name?.[0] || "?"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-black dark:text-white text-lg md:text-xl font-semibold">
                      {referral.referred_user?.full_name || "-"}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
                      {referral.referred_user?.email || "-"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-black dark:text-white text-lg md:text-xl font-semibold">
                      ₦{referral.reward_amount.toLocaleString()}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
                      {new Date(referral.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </MobileLayout>
      <BottomNavigation />
    </div>
  );
}