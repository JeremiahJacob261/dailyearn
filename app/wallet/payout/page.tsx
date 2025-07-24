"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MobileLayout } from "@/components/mobile-layout"
import { PayoutSuccess } from "@/components/payout-success"
import { databaseService } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"

export default function PayoutRequest() {
  const router = useRouter()
  const { toast } = useToast();
  const [showSuccess, setShowSuccess] = useState(false)
  const [availableAmount, setAvailableAmount] = useState(0)
  const [payoutAmount, setPayoutAmount] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [minWithdrawalAmount, setMinWithdrawalAmount] = useState(5000)
  const [formData, setFormData] = useState({
    fullName: "",
    accountName: "",
    accountNumber: "",
    bank: "Access Bank",
  })

  // Nigerian Banks and Mobile Money Options
  const bankOptions = [
    "Access Bank",
    "Zenith Bank", 
    "First Bank of Nigeria",
    "Guaranty Trust Bank (GTBank)",
    "United Bank for Africa (UBA)",
    "Fidelity Bank",
    "Union Bank",
    "Sterling Bank",
    "Standard Chartered Bank",
    "Citibank Nigeria",
    "Ecobank Nigeria",
    "Heritage Bank",
    "Keystone Bank",
    "Polaris Bank",
    "Providus Bank",
    "Stanbic IBTC Bank",
    "SunTrust Bank",
    "Titan Trust Bank",
    "Unity Bank",
    "Wema Bank",
    // Mobile Money Options
    "Opay",
    "PalmPay",
    "Kuda Bank",
    "Moniepoint",
    "Alat by Wema",
    "VBank",
    "Rubies Bank"
  ]

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/signin");
      return;
    }
    const user = JSON.parse(storedUser);
    setUserId(user.id);
    loadUserData(user.id);
    loadMinWithdrawalAmount();
  }, [])

  // Update payout amount when both available amount and min withdrawal are loaded
  useEffect(() => {
    if (availableAmount > 0 && minWithdrawalAmount > 0) {
      setPayoutAmount(Math.max(Math.min(availableAmount, minWithdrawalAmount), minWithdrawalAmount));
    }
  }, [availableAmount, minWithdrawalAmount])

  const loadMinWithdrawalAmount = async () => {
    try {
      const minAmount = await databaseService.getMinimumWithdrawalAmount();
      setMinWithdrawalAmount(minAmount);
      // Update payout amount if user data is already loaded
      if (availableAmount > 0) {
        setPayoutAmount(Math.max(Math.min(availableAmount, minAmount), minAmount));
      }
    } catch (error) {
      console.error("Error loading minimum withdrawal amount:", error);
      setMinWithdrawalAmount(5000); // Fallback
    }
  }

  const loadUserData = async (id: string) => {
    setIsLoading(true);
    try {
      const user = await databaseService.getUserData(id);
      if (user) {
        setAvailableAmount(user.balance);
        // Set payout amount after both user data and min amount are loaded
        if (minWithdrawalAmount > 0) {
          setPayoutAmount(Math.max(Math.min(user.balance, minWithdrawalAmount), minWithdrawalAmount));
        }
        setFormData((prev) => ({ ...prev, fullName: user.full_name }));
      }
    } catch (error) {
      toast({ title: "Failed to load user data", description: String(error), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    if (availableAmount < minWithdrawalAmount) {
      toast({ title: "Insufficient balance", description: `Minimum payout is ₦${minWithdrawalAmount.toLocaleString()}.`, variant: "destructive" });
      return;
    }
    if (payoutAmount < minWithdrawalAmount) {
      toast({ title: "Invalid payout amount", description: `Minimum payout is ₦${minWithdrawalAmount.toLocaleString()}.`, variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await databaseService.createPayoutRequest({
        userId,
        fullName: formData.fullName,
        accountName: formData.accountName,
        accountNumber: formData.accountNumber,
        bank: formData.bank,
        amount: payoutAmount,
      });
      await databaseService.deductUserBalance(userId, payoutAmount);
      setShowSuccess(true);
    } catch (error) {
      toast({ title: "Payout failed", description: String(error), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  const handleSuccessContinue = () => {
    setShowSuccess(false)
    router.push("/wallet")
  }

  if (showSuccess) {
    return <PayoutSuccess onContinue={handleSuccessContinue} />
  }

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
    <MobileLayout>
      {/* Header */}
      <div className="px-6 md:px-8 pt-8 md:pt-12 pb-6">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => router.back()}>
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">Request payout</h1>
        </div>
        <p className="text-neutral-900 dark:text-gray-400 text-base md:text-lg">Fill wisely, any mistake done cannot be changed</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 px-6 md:px-8 space-y-6 md:space-y-8">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-neutral-900 dark:text-white text-base md:text-lg font-normal">
            Full name
          </Label>
          <Input
            id="fullName"
            placeholder="Full name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="bg-transparent border-gray-600 border-2 rounded-xl h-14 md:h-16 text-neutral-900 dark:text-white placeholder:text-gray-500 focus:border-gray-400 focus:ring-0"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountName" className="text-neutral-900 dark:text-white text-base md:text-lg font-normal">
            Account name
          </Label>
          <Input
            id="accountName"
            placeholder="Account name"
            value={formData.accountName}
            onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
            className="bg-transparent border-gray-600 border-2 rounded-xl h-14 md:h-16 text-neutral-900 dark:text-white placeholder:text-gray-500 focus:border-gray-400 focus:ring-0"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountNumber" className="text-neutral-900 dark:text-white text-base md:text-lg font-normal">
            Account number
          </Label>
          <Input
            id="accountNumber"
            placeholder="Account number"
            value={formData.accountNumber}
            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
            className="bg-transparent border-gray-600 border-2 rounded-xl h-14 md:h-16 text-neutral-900 dark:text-white placeholder:text-gray-500 focus:border-gray-400 focus:ring-0"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bank" className="text-neutral-900 dark:text-white text-base md:text-lg font-normal">
            Choose bank
          </Label>
          <div className="relative">
            <select
              id="bank"
              value={formData.bank}
              onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
              className="w-full bg-transparent border-gray-600 border-2 rounded-xl h-14 md:h-16 text-neutral-900 dark:text-white px-4 focus:border-gray-400 focus:ring-0 appearance-none"
              required
            >
              {bankOptions.map((bank) => (
                <option key={bank} value={bank} className="bg-gray-800">
                  {bank}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-900 dark:text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-neutral-900 dark:text-white text-base md:text-lg font-normal">
            Amount (available for payout ₦{availableAmount.toLocaleString()})
          </Label>
          <div className="text-sm text-gray-400 mb-2">
            Minimum withdrawal amount: ₦{minWithdrawalAmount.toLocaleString()}
          </div>
          <div className="flex items-center">
            <input
              type="number"
              min={minWithdrawalAmount}
              max={availableAmount}
              value={payoutAmount}
              onChange={e => {
                let val = Number(e.target.value);
                if (val > availableAmount) val = availableAmount;
                if (val < minWithdrawalAmount) val = minWithdrawalAmount;
                setPayoutAmount(val);
              }}
              className="bg-transparent border-none outline-none text-lime-400 text-6xl md:text-7xl font-bold w-auto focus:ring-0 focus:outline-none p-0 m-0 appearance-none"
              style={{ width: `${Math.max(4, payoutAmount.toString().length)}ch` }}
              required
            />
            <span className="text-neutral-900 dark:text-gray-400 text-4xl md:text-5xl font-bold ml-2">NGN</span>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Continue Button */}
        <div className="pt-8 pb-8 md:pb-12">
          <Button
            type="submit"
            className="w-full h-14 md:h-16 bg-lime-400 hover:bg-lime-500 text-black font-semibold text-lg md:text-xl rounded-2xl"
            disabled={availableAmount < minWithdrawalAmount || isLoading}
          >
            Continue
          </Button>
        </div>
      </form>
    </MobileLayout>
  )
}
