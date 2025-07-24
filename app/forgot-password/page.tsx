"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.requestPasswordReset(email);
      setEmailSent(true);
      toast({
        title: "Reset email sent! 📧",
        description: "Check your email for password reset instructions.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send reset email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <MobileLayout>
        <div className="px-6 pt-8 pb-6 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Check your email!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We've sent password reset instructions to <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
            The reset link will expire in 1 hour. If you don't see the email, check your spam folder.
          </p>
          
          <div className="space-y-4">
            <Button 
              onClick={() => router.push("/signin")} 
              className="w-full bg-lime-400 hover:bg-lime-500 text-black font-semibold"
            >
              Back to Sign In
            </Button>
            <Button 
              onClick={() => setEmailSent(false)} 
              variant="outline" 
              className="w-full"
            >
              Send Another Email
            </Button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="px-6 pt-8 pb-6">
        <button 
          onClick={() => router.back()}
          className="mb-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h1 className="text-3xl font-bold mb-2 text-black dark:text-white">Forgot Password?</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          No worries! Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-black dark:text-white">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="mt-2"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-lime-400 hover:bg-lime-500 text-black font-semibold" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                Sending Reset Email...
              </div>
            ) : (
              "Send Reset Email"
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Remember your password?{" "}
            <button 
              onClick={() => router.push("/signin")}
              className="text-lime-500 hover:text-lime-600 font-semibold"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </MobileLayout>
  );
} 