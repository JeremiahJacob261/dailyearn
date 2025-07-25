"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { databaseService } from "@/lib/database";
import { authService } from "@/lib/auth";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EditProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState({ full_name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setForm({ full_name: user.full_name || "", email: user.email || "" });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);
      await databaseService.updateUserProfile(user.id, form.full_name, form.email);
      // Update localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, full_name: form.full_name, email: form.email })
      );
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      router.push("/profile");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "New password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsPasswordLoading(true);
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);
      
      await authService.updatePassword(
        user.id,
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setShowPasswordSection(false);
      
      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <MobileLayout>
      <div className="px-6 pt-8 pb-6">
        <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">Edit Profile</h1>
        
        {/* Profile Information Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          <div>
            <Label htmlFor="full_name" className="text-black dark:text-white">Full Name</Label>
            <Input
              id="full_name"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-black dark:text-white">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-2"
            />
          </div>
          <div className="flex gap-4 mt-8">
            <Button type="submit" className="bg-lime-400 hover:bg-lime-500 text-black font-semibold" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Profile"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>

        {/* Password Change Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-black dark:text-white">Change Password</h2>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPasswordSection(!showPasswordSection)}
            >
              {showPasswordSection ? "Cancel" : "Change Password"}
            </Button>
          </div>

          {showPasswordSection && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <Label htmlFor="currentPassword" className="text-black dark:text-white">Current Password</Label>
                <div className="relative mt-2">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="newPassword" className="text-black dark:text-white">New Password</Label>
                <div className="relative mt-2">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={8}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Password must be at least 8 characters long
                </p>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-black dark:text-white">Confirm New Password</Label>
                <div className="relative mt-2">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold" 
                  disabled={isPasswordLoading}
                >
                  {isPasswordLoading ? "Updating..." : "Update Password"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowPasswordSection(false);
                    setPasswordForm({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: ""
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </MobileLayout>
  );
} 