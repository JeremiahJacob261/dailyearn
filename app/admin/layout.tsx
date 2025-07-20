'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { SidebarNav } from "@/components/admin/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Bell, Search, Settings, User, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"
import { adminAuthService } from '@/lib/auth'

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
  },
  {
    title: "Tasks",
    href: "/admin/tasks",
  },
  {
    title: "Users",
    href: "/admin/users",
  },
  {
    title: "Payouts",
    href: "/admin/payouts",
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: SettingsLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [adminSession, setAdminSession] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = () => {
      const isLoginPage = pathname === '/admin/login'
      
      if (isLoginPage) {
        setIsLoading(false)
        return
      }

      const authenticated = adminAuthService.isAuthenticated()
      if (!authenticated) {
        router.push('/admin/login')
        return
      }

      const session = adminAuthService.getSession()
      setAdminSession(session)
      setIsAuthenticated(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [pathname, router])

  const handleLogout = async () => {
    await adminAuthService.signOut()
    router.push('/admin/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If on login page, render without layout
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // If not authenticated and not on login page, this shouldn't happen due to redirect
  if (!isAuthenticated) {
    return null
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Mobile Header */}
      <div className="md:hidden bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <h1 className="text-lg font-semibold text-foreground">Admin Panel</h1>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        {/* Top Header */}
        <header className="bg-background border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">AE</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">AdseEarn Admin</h1>
                  <p className="text-sm text-muted-foreground">Manage your platform</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-64 bg-muted/50 border-input focus:border-ring"
                />
              </div>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Bell className="w-4 h-4" />
              </Button>
              <ThemeToggle />
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Settings className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{adminSession?.username}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-background border-r border-border min-h-[calc(100vh-73px)]">
            <div className="p-6">
              <nav className="space-y-2">
                <SidebarNav items={sidebarNavItems} />
              </nav>
            </div>
          </aside>

          {/* Content Area */}
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="p-4">
          <Card className="p-4 mb-4">
            <SidebarNav items={sidebarNavItems} />
          </Card>
          {children}
        </div>
      </div>
    </div>
  )
} 