"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"
import { useFileManager } from "@/components/file-manager"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import {
  Files,
  FileText,
  ImageIcon,
  Video,
  HardDrive,
  Heart,
  Upload,
  Search,
  TrendingUp,
  Clock,
  Star,
  Zap,
  Sparkles,
  ArrowRight,
  BarChart3,
  Activity,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const { files, getFilesByCategory, getStorageUsed, searchFiles } = useFileManager()
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")

  const storageInfo = getStorageUsed()
  const recentFiles = Array.isArray(files) ? files.slice(-5).reverse() : []

  // Search functionality
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchFiles(searchQuery);
  }, [searchQuery, searchFiles]);

  // Show notification if no results found
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() && searchResults.length === 0) {
      toast({
        title: "Tidak ada hasil",
        description: `Tidak ditemukan file yang cocok dengan "${query}"`,
        variant: "default",
      });
    }
  };

  const stats = [
    {
      title: "Total File",
      value: files.length,
      icon: Files,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      change: "+12%",
    },
    {
      title: "Dokumen",
      value: getFilesByCategory("documents").length,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      change: "+8%",
    },
    {
      title: "Gambar",
      value: getFilesByCategory("images").length,
      icon: ImageIcon,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      change: "+15%",
    },
    {
      title: "Video",
      value: getFilesByCategory("videos").length,
      icon: Video,
      color: "text-red-600",
      bgColor: "bg-gradient-to-br from-red-50 to-red-100",
      change: "+5%",
    },
  ]

  const quickActions = [
    {
      title: "Lihat Semua File",
      description: "Jelajahi semua file yang tersimpan",
      icon: Files,
      href: "/dashboard/files",
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      iconBg: "bg-blue-500",
    },
    {
      title: "Upload File",
      description: "Tambahkan file baru ke ZipFlow",
      icon: Upload,
      href: "/dashboard/files?upload=true",
      color: "text-green-600",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      iconBg: "bg-green-500",
    },
    {
      title: "Cari File",
      description: "Temukan file dengan cepat",
      icon: Search,
      href: "/dashboard/files?search=true",
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      iconBg: "bg-purple-500",
    },
    {
      title: "File Favorit",
      description: "Akses file favorit Anda",
      icon: Heart,
      href: "/dashboard/favorites",
      color: "text-rose-600",
      bgColor: "bg-gradient-to-br from-rose-50 to-rose-100",
      iconBg: "bg-rose-500",
    },
  ]

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStorageColor = () => {
    if (storageInfo.percentage < 50) return "bg-gradient-to-r from-green-400 to-green-600"
    if (storageInfo.percentage < 80) return "bg-gradient-to-r from-yellow-400 to-orange-500"
    return "bg-gradient-to-r from-red-400 to-red-600"
  }

  return (
    <div className="flex-1 p-6 space-y-8">
      {/* Search Bar di atas konten utama, mudah diakses user */}
      <div className="w-full flex justify-center mb-6">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Cari file..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-12 h-12 text-lg border-2 border-gray-200 focus:border-sky-400 transition-all duration-300 hover-glow w-full"
          />
        </div>
      </div>
      {/* Header Selamat Datang */}
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger className="hover-lift" />
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold gradient-text">Selamat datang, {user?.name || 'User'}! <span className="inline-block">👋</span> <span className="inline-block">✨</span></h1>
            <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
          </div>
          <p className="text-gray-600 text-lg flex items-center gap-2">
            <Zap className="h-4 w-4 text-sky-500" />
            Kelola file Anda dengan mudah di ZipFlow
          </p>
        </div>
      </div>
      {/* Search Results */}
      {searchQuery && searchResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Hasil Pencarian</h3>
          <div className="space-y-2">
            {searchResults.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                onClick={() => router.push(`/dashboard/files?highlight=${file.id}`)}
              >
                {file.category === "image" && file.thumbnail ? (
                  <img
                    src={file.thumbnail}
                    alt={file.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    {file.category === "document" && <FileText className="h-5 w-5 text-blue-600" />}
                    {file.category === "video" && <Video className="h-5 w-5 text-red-600" />}
                    {file.category === "image" && <ImageIcon className="h-5 w-5 text-purple-600" />}
                  </div>
                )}
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up"
        style={{ animationDelay: "0.1s" }}
      >
        {stats.map((stat, index) => (
          <Card key={stat.title} className="card-modern hover-lift border-0 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className={`${stat.bgColor} rounded-2xl p-4`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/80 p-3 rounded-xl">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                    <TrendingUp className="h-3 w-3" />
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Storage Usage */}
      <Card className="card-modern border-0 shadow-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="bg-gradient-to-br from-sky-400 to-blue-600 p-3 rounded-xl">
              <HardDrive className="h-6 w-6 text-white" />
            </div>
            Penggunaan Penyimpanan
            <div className="flex items-center gap-1 ml-auto">
              <Activity className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Real-time</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-gray-900">{formatFileSize(storageInfo.used)}</span>
                <span className="text-gray-500 ml-2">dari {formatFileSize(storageInfo.total)}</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">{storageInfo.percentage.toFixed(1)}%</span>
                <p className="text-sm text-gray-500">terpakai</p>
              </div>
            </div>
            <div className="space-y-3">
              <Progress value={storageInfo.percentage} className="h-4 bg-gray-200" />
              <div className="flex justify-between text-sm text-gray-500">
                <span>0 GB</span>
                <span className="font-semibold">Sisa: {formatFileSize(storageInfo.total - storageInfo.used)}</span>
                <span>5 GB</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card className="card-modern border-0 shadow-lg animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="bg-gradient-to-br from-purple-400 to-pink-600 p-3 rounded-xl">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              Aksi Cepat
            </CardTitle>
            <CardDescription className="text-lg">Akses fitur utama dengan cepat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Link key={action.title} href={action.href}>
                  <div
                    className={`${action.bgColor} p-6 rounded-2xl hover-lift cursor-pointer transition-all duration-300 border border-white/50`}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`${action.iconBg} p-3 rounded-xl`}>
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Files */}
        <Card className="card-modern border-0 shadow-lg animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="bg-gradient-to-br from-orange-400 to-red-600 p-3 rounded-xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
              File Terbaru
            </CardTitle>
            <CardDescription className="text-lg">File yang baru saja Anda upload</CardDescription>
          </CardHeader>
          <CardContent>
            {recentFiles.length > 0 ? (
              <div className="space-y-4">
                {recentFiles.map((file, index) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white hover-lift border border-gray-100 cursor-pointer"
                    onClick={() => router.push(`/dashboard/files?highlight=${file.id}&type=${file.category}`)}
                  >
                    <div className="flex-shrink-0">
                      {file.category === "image" && file.thumbnail ? (
                        <img
                          src={file.thumbnail || "/placeholder.svg"}
                          alt={file.name}
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                          {file.category === "document" && <FileText className="h-6 w-6 text-blue-600" />}
                          {file.category === "video" && <Video className="h-6 w-6 text-red-600" />}
                          {file.category === "other" && <Files className="h-6 w-6 text-gray-600" />}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {file.isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                      <BarChart3 className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                ))}
                <Link href="/dashboard/files">
                  <Button className="w-full mt-6 btn-primary text-white border-0 h-12 text-lg font-semibold flex items-center justify-center gap-2">
                    Lihat Semua File
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Skeleton placeholders untuk file terbaru */}
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                    <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
                <div className="text-center py-6">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Files className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum ada file</h3>
                  <p className="text-gray-500 mb-4">Upload file pertama Anda untuk memulai</p>
                  <Link href="/dashboard/files?upload=true">
                    <Button className="btn-primary text-white border-0 h-10 px-6 text-sm font-semibold flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Upload File Pertama
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
