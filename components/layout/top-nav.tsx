"use client"

import { Bell, ChevronDown, Home, LayoutGrid, Settings, User } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function TopNav() {
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }))
    }
    updateTime()
    const timer = setInterval(updateTime, 60000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-gray-100 bg-white px-6">
      {/* Left section: Logo and nav */}
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <LayoutGrid className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-gray-800">场景化数智教学服务平台</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 hover:bg-gray-50">
            <Home className="mr-1.5 h-4 w-4" />
            门户首页
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 hover:bg-gray-50">
            <LayoutGrid className="mr-1.5 h-4 w-4" />
            我的服务台
          </Button>
          <Button variant="ghost" size="sm" className="text-primary bg-primary/5 hover:bg-primary/10">
            <Settings className="mr-1.5 h-4 w-4" />
            应用服务中心
          </Button>
        </nav>
      </div>

      {/* Right section: Time and user */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">{currentTime}</span>
        
        <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-gray-700">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            3
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 text-gray-600 hover:text-gray-800">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <span>管理员</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem>个人中心</DropdownMenuItem>
            <DropdownMenuItem>账号设置</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">退出登录</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
