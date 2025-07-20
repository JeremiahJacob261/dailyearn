"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  CreditCard,
  ChevronRight 
} from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
  }[]
}

const iconMap = {
  "Dashboard": LayoutDashboard,
  "Tasks": CheckSquare,
  "Users": Users,
  "Payouts": CreditCard,
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        "flex space-x-2 md:flex-col md:space-x-0 md:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => {
        const Icon = iconMap[item.title as keyof typeof iconMap]
        const isActive = pathname === item.href
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-500/10"
                : "text-muted-foreground hover:text-foreground hover:bg-accent",
              "justify-start"
            )}
          >
            {Icon && (
              <Icon className={cn(
                "w-4 h-4 transition-colors",
                isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground"
              )} />
            )}
            <span>{item.title}</span>
            {isActive && (
              <ChevronRight className="w-4 h-4 ml-auto text-white/80" />
            )}
          </Link>
        )
      })}
    </nav>
  )
} 