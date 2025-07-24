"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { databaseService } from "@/lib/database";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [fullNameHint, setFullNameHint] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      // Find user by email
      const { data, error: dbError } = await databaseService
        .getUserByEmail(email);
      if (dbError || !data) {
        setError("No user found with that email.");
        setIsLoading(false);
        return;
      }
      // Show hint: first 2 and last 2 chars, rest as _
      const name = data.full_name;
      if (name.length < 4) {
        setFullNameHint(name[0] + "_".repeat(name.length - 2) + name[name.length - 1]);
      } else {
        setFullNameHint(name.slice(0, 2) + "_".repeat(name.length - 4) + name.slice(-2));
      }
      setStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFullNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      // Validate full name
      const { data, error: dbError } = await databaseService.getUserByEmail(email);
      if (dbError || !data) {
        setError("No user found with that email.");
        setIsLoading(false);
        return;
      }
      if (data.full_name.trim().toLowerCase() !== fullName.trim().toLowerCase()) {
        setError("Full name does not match our records.");
        setIsLoading(false);
        return;
      }
      // Placeholder: send reset email or show reset form
      alert("Password reset link would be sent to your email (placeholder).");
      router.push("/signin");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MobileLayout>
      <div className="px-6 pt-8 pb-6">
        <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">Forgot Password</h1>
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-black dark:text-white">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="mt-2"
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button type="submit" className="bg-lime-400 hover:bg-lime-500 text-black font-semibold" disabled={isLoading}>
              {isLoading ? "Checking..." : "Next"}
            </Button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleFullNameSubmit} className="space-y-6">
            <div>
              <Label htmlFor="fullName" className="text-black dark:text-white">Complete your full name</Label>
              <div className="mb-2 text-gray-500 dark:text-gray-400 text-sm">Hint: {fullNameHint}</div>
              <Input
                id="fullName"
                name="fullName"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                className="mt-2"
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button type="submit" className="bg-lime-400 hover:bg-lime-500 text-black font-semibold" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Reset Password"}
            </Button>
          </form>
        )}
      </div>
    </MobileLayout>
  );
} 