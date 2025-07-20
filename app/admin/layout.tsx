import { SidebarNav } from "@/components/admin/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Bell, Search, Settings, User } from "lucide-react"
import { Input } from "@/components/ui/input"

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
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <User className="w-4 h-4" />
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