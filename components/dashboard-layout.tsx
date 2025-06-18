"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Upload,
  Files,
  FileText,
  ImageIcon,
  Video,
  HardDrive,
  Star,
  LogOut,
  User,
  Settings,
  Command,
  Menu,
  X,
} from "lucide-react"
import { logout } from "@/lib/auth"
import { showToast } from "@/lib/toast"
import { UploadDialog } from "@/components/upload-dialog"
import SearchModal from "@/components/search-modal"
import { Sidebar, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
  user: any
  currentPath: string
  onFileUpload?: () => void
}

export default function DashboardLayout({ children, user, currentPath, onFileUpload }: DashboardLayoutProps) {
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    showToast("Berhasil keluar. Sampai jumpa!", "success")
    router.push("/")
  }

  const handleUploadSuccess = () => {
    setShowUploadDialog(false)
    if (onFileUpload) {
      onFileUpload()
    }
  }

  // Keyboard shortcut untuk search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setShowSearchModal(true)
      }
      if (e.key === "Escape") {
        setShowSearchModal(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const sidebarItems = [
    {
      icon: Files,
      label: "Semua File",
      href: "/dashboard/files",
      active: pathname === "/dashboard/files",
      gradient: "from-sky-400 to-cyan-500",
    },
    {
      icon: FileText,
      label: "Documents",
      href: "/dashboard/documents",
      active: pathname === "/dashboard/documents",
      gradient: "from-sky-500 to-emerald-500",
    },
    {
      icon: ImageIcon,
      label: "Images",
      href: "/dashboard/images",
      active: pathname === "/dashboard/images",
      gradient: "from-sky-400 to-blue-500",
    },
    {
      icon: Video,
      label: "Videos",
      href: "/dashboard/videos",
      active: pathname === "/dashboard/videos",
      gradient: "from-sky-600 to-indigo-600",
    },
    {
      icon: HardDrive,
      label: "Penyimpanan",
      href: "/dashboard/storage",
      active: pathname === "/dashboard/storage",
      gradient: "from-sky-500 to-violet-500",
    },
    {
      icon: Star,
      label: "Favorit",
      href: "/dashboard/favorites",
      active: pathname === "/dashboard/favorites",
      gradient: "from-sky-400 to-amber-500",
    },
  ]

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-900 to-blue-900">
        {/* Header */}
        <header className="bg-slate-800/80 backdrop-blur-xl border-b border-sky-500/30 px-6 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="lg:hidden text-slate-300 hover:text-white hover:bg-slate-700" />

              <div className="hidden lg:flex items-center space-x-2">
                <div className="text-2xl font-bold bg-gradient-to-r from-sky-300 to-blue-300 bg-clip-text text-transparent">
                  CloudDrive
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex items-center space-x-2 text-sm text-slate-400">
                {currentPath.split(" > ").map((path, index, array) => (
                  <span key={index} className="flex items-center">
                    <span className={index === array.length - 1 ? "text-sky-300 font-medium" : ""}>{path}</span>
                    {index < array.length - 1 && <span className="mx-2 text-slate-600">{">"}</span>}
                  </span>
                ))}
              </nav>

              <Button
                onClick={() => setShowUploadDialog(true)}
                className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-lg shadow-sky-500/25 glow-sky"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-sky-500/30">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder-user.jpg" alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-sky-500 to-blue-600 text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-3">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-white">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-slate-300">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem asChild className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer">
                    <Link href="/dashboard/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer">
                    <Link href="/dashboard/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Pengaturan</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <Sidebar className="bg-slate-800/50 backdrop-blur-xl border-r border-sky-500/30">
            <div className="p-6">
              <div className="lg:hidden mb-6">
                <div className="text-2xl font-bold bg-gradient-to-r from-sky-300 to-blue-300 bg-clip-text text-transparent">
                  CloudDrive
                </div>
              </div>

              {/* Quick Search Button */}
              <Button
                variant="outline"
                onClick={() => setShowSearchModal(true)}
                className="w-full mb-6 justify-start bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-600/50 hover:text-white"
              >
                <Search className="h-4 w-4 mr-3" />
                Cari file...
                <kbd className="ml-auto px-2 py-1 bg-slate-600/50 rounded text-xs border border-slate-500">⌘K</kbd>
              </Button>

              <nav className="space-y-2">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`group flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          item.active
                            ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-sky-500/25 glow-sky`
                            : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 ${item.active ? "text-white" : "text-slate-400 group-hover:text-white"}`}
                        />
                        <span>{item.label}</span>
                        {item.active && <div className="ml-auto w-2 h-2 bg-white rounded-full opacity-75 animate-pulse" />}
                      </Link>
                    )
                  })}
              </nav>

              {/* Storage Indicator */}
              <div className="mt-8 p-4 bg-slate-700/30 rounded-xl border border-sky-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <HardDrive className="h-4 w-4 text-sky-400" />
                  <span className="text-sm font-medium text-slate-200">Penyimpanan</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>2.1 GB dari 15 GB</span>
                    <span>14%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div className="bg-gradient-to-r from-sky-500 to-blue-500 h-2 rounded-full w-[14%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </Sidebar>

          {/* Main Content */}
          <main className="flex-1 p-6 lg:p-8 min-h-[calc(100vh-73px)]">{children}</main>
        </div>

        {/* Modals */}
        <UploadDialog 
          isOpen={showUploadDialog} 
          onClose={() => setShowUploadDialog(false)} 
          selectedFiles={[]}
          onAddMoreFiles={() => {}}
          onUploadComplete={handleUploadSuccess} 
        />
        <SearchModal open={showSearchModal} onOpenChange={setShowSearchModal} />
      </div>
    </SidebarProvider>
  )
}
