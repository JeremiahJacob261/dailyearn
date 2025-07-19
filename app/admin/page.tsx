"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { databaseService } from "@/lib/database"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    payouts: 0,
    earnings: 0,
    tasks: 0,
    loading: true,
  })

  useEffect(() => {
    async function fetchStats() {
      setStats(s => ({ ...s, loading: true }))
      // Fetch all users
      const users = await databaseService.getAllUsers()
      // Fetch all tasks
      const tasks = await databaseService.getAllTasks()
      // Fetch all payouts
      const { data: payouts, error: payoutErr } = await databaseService.supabase
        .from('dailyearn_payouts')
        .select('*')
      // Calculate total earnings (sum of all user balances)
      const earnings = users.reduce((sum, u) => sum + (u.balance || 0), 0)
      setStats({
        users: users.length,
        payouts: payouts ? payouts.length : 0,
        earnings,
        tasks: tasks.length,
        loading: false,
      })
    }
    fetchStats()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <nav className="space-x-4 mb-8">
        <Link href="/admin/tasks" className="text-blue-500 underline">Tasks</Link>
        <Link href="/admin/users" className="text-blue-500 underline">Users</Link>
        <Link href="/admin/payouts" className="text-blue-500 underline">Payouts</Link>
      </nav>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold">{stats.loading ? '...' : stats.users}</div>
          <div className="text-gray-600 mt-2">Total Users</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold">{stats.loading ? '...' : stats.tasks}</div>
          <div className="text-gray-600 mt-2">Total Tasks</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold">{stats.loading ? '...' : stats.payouts}</div>
          <div className="text-gray-600 mt-2">Total Payouts</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold">{stats.loading ? '...' : `₦${stats.earnings.toFixed(2)}`}</div>
          <div className="text-gray-600 mt-2">Total Earnings</div>
        </div>
      </div>
      <div>
        <p>Welcome to the admin dashboard. Use the links above to manage tasks, users, and payouts.</p>
      </div>
    </div>
  )
} 