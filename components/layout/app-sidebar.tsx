"use client"

import { ArrowLeft, BarChart3, CheckSquare, FolderKanban, LayoutGrid, GitBranch } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  {
    title: "数据统计工作台",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "批次管理",
    href: "/batches",
    icon: FolderKanban,
  },
  {
    title: "审批流程管理",
    href: "/workflows",
    icon: GitBranch,
  },
  {
    title: "场景大厅",
    href: "/",
    icon: LayoutGrid,
  },
  {
    title: "审批中心",
    href: "/approvals",
    icon: CheckSquare,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/" || pathname.startsWith("/scenarios")
    }
    if (href === "/students") {
      return pathname.startsWith("/students")
    }
    if (href === "/positions") {
      return pathname.startsWith("/positions")
    }
    return pathname.startsWith(href)
  }

  return (
    <aside className="fixed left-0 top-14 bottom-0 z-40 w-56 border-r border-gray-100 bg-white">
      {/* Header with back button and title */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-100">
        <button 
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
          onClick={() => {/* No action */}}
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <span className="font-medium text-gray-800">实践场景学习平台</span>
      </div>

      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-primary/5 text-primary border-l-2 border-primary -ml-[2px] pl-[calc(0.75rem+2px)]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-gray-400 group-hover:text-gray-600")} />
              {item.title}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 p-4">
        <div className="rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-3">
          <p className="text-xs font-medium text-gray-700">版本 v2.0.1</p>
          <p className="mt-1 text-xs text-gray-500">更新日期: 2026-04-21</p>
        </div>
      </div>
    </aside>
  )
}
