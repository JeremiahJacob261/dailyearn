"use client";

import { useRouter, usePathname } from "next/navigation";
import { Home, CheckSquare, Users, Wallet } from "lucide-react";

export function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { icon: 'home', label: "Home", path: "/dashboard" },
    { icon: 'tasks', label: "Tasks", path: "/tasks" },
    { icon: 'referral', label: "Referrals", path: "/referrals" },
    { icon: 'wallet', label: "Wallet", path: "/wallet" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black">
      <div className="max-w-md mx-auto md:max-w-lg lg:max-w-xl">
        <div className="flex justify-around items-center py-2 pb-safe">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
                <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`flex flex-col items-center py-2.5 px-4 gap-2.5 ${
                  isActive ? "text-white" : "text-stone-500"
                }`}
                >
                <img
                  src={`/icons/${isActive ? item?.icon : "_"+item?.icon}.svg`}
                  width={24}
                  height={24}
                  alt="bottomnave"
                />
                <span className="text-sm">{item.label}</span>
                </button>
            );
          })}
        </div>
        {/* Home Indicator - only show on mobile */}
        <div className="flex justify-center pb-2 md:hidden">
          <div className="w-32 h-1 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
