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
  DollarSign,
  RefreshCw
} from "lucide-react"

// Utility function to format relative time
function formatRelativeTime(timestamp: string): string {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)
  
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  
  return time.toLocaleDateString()
}

interface ActivityItem {
  id: string
  type: 'user_registered' | 'task_completed' | 'payout_processed' | 'payout_requested'
  message: string
  timestamp: string
  user?: string
  color: string
  bgColor: string
}

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
  
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [activityLoading, setActivityLoading] = useState(true)

  const refreshData = async () => {
    await Promise.all([fetchStats(), fetchRecentActivity()])
  }
  
  const fetchStats = async () => {
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
  
  const fetchRecentActivity = async () => {
    setActivityLoading(true)
    try {
      const activities: ActivityItem[] = []
      
      // Get recent users (last 7 days)
      const { data: recentUsers } = await supabase
        .from('dailyearn_users')
        .select('full_name, created_at')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (recentUsers) {
        recentUsers.forEach(user => {
          activities.push({
            id: `user_${user.created_at}`,
            type: 'user_registered',
            message: `${user.full_name} joined the platform`,
            timestamp: user.created_at,
            user: user.full_name,
            color: 'bg-green-500',
            bgColor: 'bg-green-50 border-green-100'
          })
        })
      }
      
      // Get recent payouts (last 7 days)
      const { data: recentPayouts } = await supabase
        .from('dailyearn_payouts')
        .select(`
          *,
          user:dailyearn_users!user_id(full_name)
        `)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (recentPayouts) {
        recentPayouts.forEach(payout => {
          const user = payout.user as any
          if (payout.status === 'completed') {
            activities.push({
              id: `payout_completed_${payout.id}`,
              type: 'payout_processed',
              message: `Payout of ₦${payout.amount.toLocaleString()} processed for ${user?.full_name || 'User'}`,
              timestamp: payout.processed_at || payout.created_at,
              user: user?.full_name,
              color: 'bg-purple-500',
              bgColor: 'bg-purple-50 border-purple-100'
            })
          } else if (payout.status === 'pending') {
            activities.push({
              id: `payout_requested_${payout.id}`,
              type: 'payout_requested',
              message: `New payout request of ₦${payout.amount.toLocaleString()} from ${user?.full_name || 'User'}`,
              timestamp: payout.created_at,
              user: user?.full_name,
              color: 'bg-yellow-500',
              bgColor: 'bg-yellow-50 border-yellow-200'
            })
          }
        })
      }
      
      // Sort activities by timestamp (most recent first)
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      
      setRecentActivity(activities.slice(0, 5))
    } catch (error) {
      console.error('Error fetching recent activity:', error)
    } finally {
      setActivityLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    fetchRecentActivity()
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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData}
            disabled={stats.loading || activityLoading}
            className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${stats.loading || activityLoading ? 'animate-spin' : ''}`} />
            Refresh
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
            {activityLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No recent activity</p>
                <p className="text-sm text-gray-500">Activity will appear here as users interact with the platform</p>
              </div>
            ) : (
              recentActivity.map((activity) => (
                <div key={activity.id} className={`flex items-center space-x-3 p-3 ${activity.bgColor} rounded-lg border`}>
                  <div className={`w-2 h-2 ${activity.color} rounded-full`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-600">
                      {formatRelativeTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
            
            {/* Show pending payouts warning if any */}
            {stats.pendingPayouts > 0 && (
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200 mt-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {stats.pendingPayouts} pending payout{stats.pendingPayouts > 1 ? 's' : ''} require attention
                  </p>
                  <p className="text-xs text-gray-600">Review and process pending payments</p>
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