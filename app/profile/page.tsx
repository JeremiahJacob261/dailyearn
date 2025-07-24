"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MobileLayout } from "@/components/mobile-layout";
import { BottomNavigation } from "@/components/bottom-navigation";
import { PasswordVerificationModal } from "@/components/password-verification-modal";
import { databaseService, UserData } from "@/lib/database";

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [totalPayouts, setTotalPayouts] = useState(0);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

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
        // Fetch stats
        const [payouts, referrals] = await Promise.all([
          databaseService.getUserPayouts(freshUserData.id),
          databaseService.getReferralStats(freshUserData.id),
        ]);
        setTotalPayouts(payouts.length);
        setTotalReferrals(referrals.totalReferrals);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    // Show password verification modal first
    setShowPasswordModal(true);
  };

  const handlePasswordVerified = () => {
    // Password verified successfully, navigate to edit page
    router.push("/profile/edit");
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/signin");
  };
  
  const handleDelete = () => {
    alert("Contact support for account deletion.");
  };

  return (
    <div className="pb-20 min-h-screen bg-black">
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
          <h1 className="text-3xl font-bold text-black dark:text-white">Profile</h1>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-400"></div>
          </div>
        ) : (
          <>
            {/* Avatar and Info */}
            <div className="flex flex-col items-center mt-4 mb-6">
              <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center mb-4">
                <span className="text-black dark:text-white text-4xl font-bold">
                  {userData?.full_name?.[0] || "?"}
                </span>
              </div>
              <h2 className="text-black dark:text-white text-2xl font-bold mb-1">
                {userData?.full_name || "-"}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                {userData?.email || "-"}
              </p>
              <button
                onClick={handleEditProfile}
                className="w-full max-w-xs flex items-center justify-center gap-2 bg-lime-400 hover:bg-lime-300 text-black font-semibold text-lg rounded-full py-3 mb-8 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H7v-3a2 2 0 01.586-1.414z" />
                </svg>
                Edit profile
              </button>
            </div>
            {/* Stats */}
            <div className="flex justify-center gap-4 mb-10">
              <div className="bg-[#181818] rounded-2xl flex flex-col items-center justify-center w-36 h-24">
                <span className="text-white text-3xl font-bold">{String(totalPayouts).padStart(2, '0')}</span>
                <span className="text-gray-400 text-base mt-1">Total payouts</span>
              </div>
              <div className="bg-[#181818] rounded-2xl flex flex-col items-center justify-center w-36 h-24">
                <span className="text-white text-3xl font-bold">{String(totalReferrals).padStart(2, '0')}</span>
                <span className="text-gray-400 text-base mt-1">Total referrals</span>
              </div>
            </div>
            {/* Actions */}
            <div className="flex flex-col items-center gap-2 mt-8">
              <button onClick={handleLogout} className="dark:text-white text-black text-lg mb-2">Logout</button>
              <button onClick={handleDelete} className="text-red-500 text-lg font-semibold">Delete account</button>
            </div>
          </>
        )}
      </MobileLayout>
      <BottomNavigation />

      {/* Password Verification Modal */}
      <PasswordVerificationModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onVerifySuccess={handlePasswordVerified}
        title="Verify Your Password"
        description="Please enter your password to edit your profile"
      />
    </div>
  );
} 