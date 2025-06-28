"use client";

import { CheckCircle } from "lucide-react";

interface SuccessNotificationProps {
  message: string;
  onClose?: () => void;
}

export function SuccessNotification({
  message,
  onClose,
}: SuccessNotificationProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Confetti Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="confetti-container">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: [
                  "#ff6b6b",
                  "#4ecdc4",
                  "#45b7d1",
                  "#96ceb4",
                  "#feca57",
                  "#ff9ff3",
                  "#54a0ff",
                ][Math.floor(Math.random() * 7)],
              }}
            />
          ))}
        </div>
      </div>

      {/* Notification */}
      <div className="relative z-10 mx-4 mt-8 md:mx-8">
        <div className="bg-stone-800 rounded-xl p-4 md:p-6 flex items-center gap-3 md:gap-4 shadow-2xl">
          <div className="w-10 h-[38px] bg-black rounded-[10px] flex items-center justify-center">
        <img
          src="/icons/money-wings.svg"
          alt="gift"
          className="w-auto h-auto"
        />
          </div>
          <div className="flex-1">
        <h3 className="text-white font-semibold text-base md:text-lg">
          Congratulations
        </h3>
        <p className="text-stone-300 text-sm ">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
