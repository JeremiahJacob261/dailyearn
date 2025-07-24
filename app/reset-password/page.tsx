"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
      validateToken(tokenParam);
    } else {
      setIsValidatingToken(false);
      toast({
        title: "Invalid Reset Link",
        description: "No reset token found in the URL",
        variant: "destructive",
      });
    }
  }, [searchParams, toast]);

  const validateToken = async (tokenToValidate: string) => {
    try {
      const result = await authService.validateResetToken(tokenToValidate);
      setTokenValid(result.valid);
      if (!result.valid) {
        toast({
          title: "Invalid or Expired Link",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      setTokenValid(false);
      toast({
        title: "Error",
        description: "Failed to validate reset token",
        variant: "destructive",
      });
    } finally {
      setIsValidatingToken(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    if (!token) {
      toast({
        title: "Invalid reset token",
        description: "No valid reset token found",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword(token, password);
      setPasswordReset(true);
      toast({
        title: "Password reset successful! 🎉",
        description: "You can now sign in with your new password",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reset password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidatingToken) {
    return (
      <MobileLayout>
        <div className="px-6 pt-8 pb-6 text-center">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Validating Reset Link...</h1>
          <p className="text-gray-600 dark:text-gray-400">Please wait while we verify your reset token.</p>
        </div>
      </MobileLayout>
    );
  }

  if (!tokenValid) {
    return (
      <MobileLayout>
        <div className="px-6 pt-8 pb-6 text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Invalid Reset Link</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          
          <div className="space-y-4">
            <Button 
              onClick={() => router.push("/forgot-password")} 
              className="w-full bg-lime-400 hover:bg-lime-500 text-black font-semibold"
            >
              Request New Reset Link
            </Button>
            <Button 
              onClick={() => router.push("/signin")} 
              variant="outline" 
              className="w-full"
            >
              Back to Sign In
            </Button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (passwordReset) {
    return (
      <MobileLayout>
        <div className="px-6 pt-8 pb-6 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Password Reset Complete!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Your password has been successfully updated. You can now sign in with your new password.
          </p>
          
          <Button 
            onClick={() => router.push("/signin")} 
            className="w-full bg-lime-400 hover:bg-lime-500 text-black font-semibold"
          >
            Sign In Now
          </Button>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="px-6 pt-8 pb-6">
        <button 
          onClick={() => router.push("/signin")}
          className="mb-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Sign In
        </button>

        <h1 className="text-3xl font-bold mb-2 text-black dark:text-white">Reset Password</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Create a new secure password for your DailyEarn account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="password" className="text-black dark:text-white">New Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
              className="mt-2"
            />
            <p className="text-sm text-gray-500 mt-1">Must be at least 8 characters long</p>
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-black dark:text-white">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              className="mt-2"
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="text-blue-800 dark:text-blue-300 font-medium mb-2">💡 Tips for a strong password:</h4>
            <ul className="text-blue-700 dark:text-blue-400 text-sm space-y-1">
              <li>• Use at least 8 characters</li>
              <li>• Include uppercase and lowercase letters</li>
              <li>• Add numbers and special characters</li>
              <li>• Avoid using personal information</li>
            </ul>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-lime-400 hover:bg-lime-500 text-black font-semibold" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                Resetting Password...
              </div>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </div>
    </MobileLayout>
  );
}

function LoadingFallback() {
  return (
    <MobileLayout>
      <div className="px-6 pt-8 pb-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </MobileLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
