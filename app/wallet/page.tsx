"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Wallet, ArrowUpRight, ArrowDownLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MobileLayout } from "@/components/mobile-layout"
import { BottomNavigation } from "@/components/bottom-navigation"

export default function WalletPage() {
  const router = useRouter()
  const [balance] = useState(2000)
  const [transactions] = useState([
    { id: 1, type: "earned", amount: 2, description: "Task 1 completed", date: "Today, 2:30 PM" },
    { id: 2, type: "earned", amount: 2, description: "Task 2 completed", date: "Today, 1:15 PM" },
    { id: 3, type: "referral", amount: 10, description: "Referral bonus", date: "Yesterday, 4:20 PM" },
    { id: 4, type: "earned", amount: 2, description: "Task 3 completed", date: "Yesterday, 3:45 PM" },
  ])

  return (
    <div className="pb-20">
      <MobileLayout>
        {/* Header */}
        <div className="flex items-center gap-4 px-6 md:px-8 pt-8 md:pt-12 pb-6">
          <button onClick={() => router.back()}>
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Wallet</h1>
        </div>

        {/* Balance Card */}
        <div className="px-6 md:px-8 pb-8">
          <div className="bg-gradient-to-r from-lime-400 to-green-500 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="w-6 h-6 text-black" />
              <span className="text-black/80 text-base md:text-lg">Total Balance</span>
            </div>
            <p className="text-black text-4xl md:text-5xl font-bold mb-6">₦{balance.toLocaleString()}</p>
            <div className="flex gap-3">
              <Button className="bg-black text-white hover:bg-stone-800 rounded-xl flex-1">
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Withdraw
              </Button>
              <Button className="bg-white/20 text-black hover:bg-white/30 rounded-xl flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Add Funds
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="px-6 md:px-8 pb-8">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-stone-800 rounded-xl p-4 text-center">
              <p className="text-stone-400 text-sm mb-1">Today</p>
              <p className="text-white text-xl font-bold">₦4</p>
            </div>
            <div className="bg-stone-800 rounded-xl p-4 text-center">
              <p className="text-stone-400 text-sm mb-1">This Week</p>
              <p className="text-white text-xl font-bold">₦24</p>
            </div>
            <div className="bg-stone-800 rounded-xl p-4 text-center">
              <p className="text-stone-400 text-sm mb-1">This Month</p>
              <p className="text-white text-xl font-bold">₦156</p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="px-6 md:px-8 pb-8">
          <h3 className="text-white text-xl md:text-2xl font-bold mb-6">Recent Transactions</h3>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center gap-4 p-4 bg-stone-800 rounded-xl">
                <div className="w-12 h-12 bg-lime-400 rounded-full flex items-center justify-center">
                  {transaction.type === "earned" ? (
                    <ArrowDownLeft className="w-6 h-6 text-black" />
                  ) : (
                    <Plus className="w-6 h-6 text-black" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">{transaction.description}</h4>
                  <p className="text-stone-400 text-sm">{transaction.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-lime-400 font-bold">+₦{transaction.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </div>
  )
}
