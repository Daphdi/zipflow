"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useFileManager } from "@/components/file-manager"
import { Progress } from "@/components/ui/progress"
import {
  Cloud,
  Zap,
  LayoutDashboard,
  Files,
  FileText,
  ImageIcon,
  Video,
  HardDrive,
  Heart,
  Sparkles,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Files",
    url: "/dashboard/files",
    icon: Files,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Penyimpanan",
    url: "/dashboard/storage",
    icon: HardDrive,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    title: "Favorit",
    url: "/dashboard/favorites",
    icon: Heart,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
  },
]

export function AppSidebar() {
  const { getStorageUsed } = useFileManager()
  const pathname = usePathname()
  const { state } = useSidebar()

  const storageInfo = getStorageUsed()

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Sidebar className="border-r border-gray-200/50 bg-gradient-to-b from-slate-50 to-white">
      <SidebarHeader className="border-b border-gray-200/50 p-6 bg-gradient-to-r from-sky-50 to-blue-50">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl p-3 animate-pulse-glow">
            <Cloud className="h-8 w-8 text-white" />
          </div>
          <div className="flex items-center gap-1">
            <Zap className="h-5 w-5 text-yellow-500 animate-bounce" />
            <Sparkles className="h-4 w-4 text-sky-500 animate-pulse" />
          </div>
          {state === "expanded" && <span className="text-2xl font-bold gradient-text">ZipFlow</span>}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Menu Utama
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} className="hover-lift">
                    <Link
                      href={item.url}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300"
                    >
                      <div className={`${item.bgColor} p-2 rounded-lg transition-all duration-300`}>
                        <item.icon className={`h-5 w-5 ${item.color}`} />
                      </div>
                      <span className="font-semibold text-gray-700">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Storage Info */}
        {state === "expanded" && (
          <div className="mt-8 p-4 bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl border border-sky-200/50">
            <div className="flex items-center gap-2 mb-3">
              <HardDrive className="h-4 w-4 text-sky-600" />
              <span className="text-sm font-bold text-gray-700">Penyimpanan</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>{formatFileSize(storageInfo.used)}</span>
                <span>{formatFileSize(storageInfo.total)}</span>
              </div>
              <Progress value={storageInfo.percentage} className="h-2 bg-gray-200" />
              <p className="text-xs text-gray-500 text-center">{storageInfo.percentage.toFixed(1)}% terpakai</p>
            </div>
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200/50 p-4 bg-gradient-to-r from-gray-50 to-slate-50">
        <div className="text-center">
          <p className="text-xs text-gray-500 font-medium">© 2025 ZipFlow</p>
          <p className="text-xs text-gray-400">Made with ❤️</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
