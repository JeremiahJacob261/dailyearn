"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MobileLayout } from "@/components/mobile-layout";
import { BottomNavigation } from "@/components/bottom-navigation";
import { ScrollingTicker } from "@/components/scrolling-ticker";
import { CopyNotification } from "@/components/copy-notification";
import { databaseService } from "@/lib/database";

export default function Referrals() {
  const router = useRouter();
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [userReferrals, setUserReferrals] = useState<any[]>([]);
  const [topReferrers, setTopReferrers] = useState<any[]>([]);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    totalEarnings: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
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
      }

      // Fetch user's referrals
      const referrals = await databaseService.getUserReferrals(user.id);
      setUserReferrals(referrals);

      // Fetch referral stats
      const stats = await databaseService.getReferralStats(user.id);
      setReferralStats(stats);

      // Fetch top referrers for spotlight
      const topRefs = await databaseService.getTopReferrers(5);
      setTopReferrers(topRefs);
    } catch (error) {
      console.error("Error loading referral data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyReferralCode = () => {
    if (userData?.referral_code) {
      navigator.clipboard.writeText(userData.referral_code);
      setShowCopyNotification(true);
      setTimeout(() => setShowCopyNotification(false), 3000);
    }
  };

  const getAvatarColor = (index: number) => {
    const colors = [
      "bg-orange-500",
      "bg-yellow-500",
      "bg-green-500",
      "bg-red-500",
      "bg-blue-500",
    ];
    return colors[index % colors.length];
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
                className="w-auto h-auto"
              />
            </button>
            <h1 className="text-2xl font-semibold text-white">Referrals</h1>
          </div>
          <div
            onClick={copyReferralCode}
            className="flex items-center gap-2 rounded-xl bg-[#1C250D] bg-opacity-50 px-3 py-2 cursor-pointer hover:scale-105 transition-transform"
          >
            <img
              src="/icons/clips.svg"
              alt="copy"
              className="w-4 h-4"
            />
            <span className="text-[#9BFF00] text-sm font-medium">
              Copy code
            </span>
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-6 md:px-8 pb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-stone-900 rounded-xl p-4 text-center">
              <h3 className="text-white text-2xl font-bold">
                {referralStats.totalReferrals}
              </h3>
              <p className="text-stone-400 text-sm">Total Referrals</p>
            </div>
            <div className="bg-stone-900 rounded-xl p-4 text-center">
              <h3 className="text-white text-2xl font-bold">
                ₦{referralStats.totalEarnings.toLocaleString()}
              </h3>
              <p className="text-stone-400 text-sm">Total Earned</p>
            </div>
          </div>
        </div>

        {/* Referral Code Section */}
        <div className="px-6 md:px-8 pb-6">
          <div className="bg-gradient-to-r from-lime-600 to-lime-400 rounded-2xl p-6 text-black">
            <h2 className="text-xl font-bold mb-2">Your Referral Code</h2>
            <p className="text-3xl font-mono font-bold mb-3">
              {userData?.referral_code || "Loading..."}
            </p>
            <p className="text-sm opacity-80 mb-4">
              Share this code and earn ₦10 for each successful signup!
            </p>
            <Button
              onClick={copyReferralCode}
              className="bg-white text-black hover:bg-stone-100 font-semibold px-6 py-2 rounded-lg"
            >
              Copy & Share
            </Button>
          </div>
        </div>

        {/* Scrolling Ticker */}
        <ScrollingTicker />

        {/* Spotlight Section */}
        {topReferrers.length > 0 && (
          <div className="px-6 md:px-8 py-6">
            <div className="flex items-center gap-2 mb-6">
              <img src="/icons/fire.svg" width={23} height={23} alt="fire" />
              <h2 className="text-white text-xl font-semibold">Spotlight</h2>
            </div>

            <div className="flex flex-col items-center text-center">
              <div
                className={`w-20 h-20 md:w-24 md:h-24 ${getAvatarColor(0)} rounded-full flex items-center justify-center mb-4`}
              >
                <span className="text-white text-3xl md:text-4xl font-semibold">
                  {topReferrers[0].referrer.full_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="text-white text-xl md:text-2xl font-semibold mb-2">
                {topReferrers[0].referrer.full_name}
              </h3>
              <p className="text-gray-400 text-base md:text-lg">
                {topReferrers[0].count} referrals, ₦
                {topReferrers[0].earnings.toLocaleString()} earned
              </p>
            </div>
          </div>
        )}

        {/* Your Referrals */}
        <div className="px-6 md:px-8 pb-8">
          <h2 className="text-white text-2xl md:text-3xl font-semibold mb-6">
            Your referrals
          </h2>

          {userReferrals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-stone-400 text-lg">No referrals yet</p>
              <p className="text-stone-500 text-sm mt-2">
                Start sharing your referral code to earn ₦10 per signup!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {userReferrals.map((referral, index) => (
                <div key={referral.id} className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 md:w-14 md:h-14 ${getAvatarColor(
                      index
                    )} rounded-full flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-white text-lg md:text-xl font-semibold">
                      {referral.referred_user.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white text-lg md:text-xl font-semibold">
                      {referral.referred_user.full_name}
                    </h3>
                    <p className="text-gray-400 text-sm md:text-base">
                      {referral.referred_user.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-lg font-semibold">
                      ₦{parseFloat(referral.reward_amount).toLocaleString()}
                    </p>
                    <p className="text-gray-400 text-sm md:text-base">
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
