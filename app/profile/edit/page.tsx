"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { databaseService } from "@/lib/database";

export default function EditProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({ full_name: "", email: "" });
  const [isLoading, setIsLoading] = useState(false);

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
      router.push("/profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MobileLayout>
      <div className="px-6 pt-8 pb-6">
        <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              {isLoading ? "Saving..." : "Save"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </MobileLayout>
  );
} 