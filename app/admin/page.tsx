"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { databaseService } from "@/lib/database"
import { supabase } from "@/lib/supabase"
import { 
  Users, 
  CheckSquare, 
  CreditCard, 
  TrendingUp,
  ArrowUpRight,
  Calendar,
  Eye,
  Plus,
  Activity,
  DollarSign
} from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    payouts: 0,
    earnings: 0,
    tasks: 0,
    pendingPayouts: 0,
    verifiedUsers: 0,
    loading: true,
  })

  useEffect(() => {
    async function fetchStats() {
      setStats(s => ({ ...s, loading: true }))
      try {
        const users = await databaseService.getAllUsers()
        const tasks = await databaseService.getAllTasks()
        const { data: payouts } = await supabase
          .from('dailyearn_payouts')
          .select('*')
        const pendingPayouts = payouts?.filter(p => p.status === 'pending').length || 0
        const verifiedUsers = users.filter(u => u.email_verified).length
        const earnings = users.reduce((sum, u) => sum + (u.balance || 0), 0)
        
        setStats({
          users: users.length,
          payouts: payouts ? payouts.length : 0,
          earnings,
          tasks: tasks.length,
          pendingPayouts,
          verifiedUsers,
          loading: false,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
        setStats(s => ({ ...s, loading: false }))
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Total Users",
      value: stats.users,
      icon: Users,
      change: `${stats.verifiedUsers} verified`,
      changeType: "positive",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Tasks",
      value: stats.tasks,
      icon: CheckSquare,
      change: "Available to users",
      changeType: "neutral",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Total Payouts",
      value: stats.payouts,
      icon: CreditCard,
      change: `${stats.pendingPayouts} pending`,
      changeType: stats.pendingPayouts > 0 ? "warning" : "positive",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Total Balance",
      value: `₦${stats.earnings.toLocaleString()}`,
      icon: DollarSign,
      change: "User balances",
      changeType: "positive",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 days
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Eye className="w-4 h-4 mr-2" />
            View Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="bg-white border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.loading ? (
                        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                      ) : (
                        stat.value
                      )}
                    </p>
                    <div className="flex items-center mt-2">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          stat.changeType === 'positive' ? 'bg-green-100 text-green-700' :
                          stat.changeType === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {stat.changeType === 'positive' && <ArrowUpRight className="w-3 h-3 mr-1" />}
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Action Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/tasks">
              <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create New Task
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="outline" className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50">
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
            </Link>
            <Link href="/admin/payouts">
              <Button variant="outline" className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50">
                <CreditCard className="w-4 h-4 mr-2" />
                Process Payouts
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New user registered</p>
                <p className="text-xs text-gray-600">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Task completed</p>
                <p className="text-xs text-gray-600">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Payout processed</p>
                <p className="text-xs text-gray-600">10 minutes ago</p>
              </div>
            </div>
            {stats.pendingPayouts > 0 && (
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {stats.pendingPayouts} pending payout{stats.pendingPayouts > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-gray-600">Requires attention</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Platform Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{stats.verifiedUsers}</p>
              <p className="text-sm text-gray-600">Verified Users</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{stats.users - stats.verifiedUsers}</p>
              <p className="text-sm text-gray-600">Unverified Users</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{stats.pendingPayouts}</p>
              <p className="text-sm text-gray-600">Pending Payouts</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{stats.payouts - stats.pendingPayouts}</p>
              <p className="text-sm text-gray-600">Completed Payouts</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 