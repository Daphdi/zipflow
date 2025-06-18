"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession, signOut } from "next-auth/react"
import { User, Settings, LogOut, ChevronDown, Bell, Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"

export function TopNav() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
      {/* Search Bar Dihapus */}
      {/* <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari file, dokumen, atau gambar..."
            className="pl-10 bg-white/50 border-gray-200 focus:border-sky-400 transition-all duration-300"
          />
        </div>
      </div> */}

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative hover-lift">
          <Bell className="h-5 w-5 text-gray-600" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">3</span>
          </div>
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 hover-lift p-2 rounded-xl">
              <Avatar className="h-10 w-10 ring-2 ring-sky-200">
                <AvatarImage src={user?.image || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-br from-sky-400 to-blue-600 text-white font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 card-modern">
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user?.image || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-br from-sky-400 to-blue-600 text-white font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
            <DropdownMenuItem asChild className="hover-lift">
              <Link href="/dashboard/profile" className="flex items-center gap-3 p-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-medium">Profil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="hover-lift">
              <Link href="/dashboard/settings" className="flex items-center gap-3 p-3">
                <div className="bg-gray-50 p-2 rounded-lg">
                  <Settings className="h-4 w-4 text-gray-600" />
                </div>
                <span className="font-medium">Pengaturan</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/login' })} className="text-red-600 hover-lift p-3">
              <div className="bg-red-50 p-2 rounded-lg">
                <LogOut className="h-4 w-4 text-red-600" />
              </div>
              <span className="font-medium">Keluar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
