"use client"

import { useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useFileManager } from "@/components/file-manager"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  HardDrive,
  FileText,
  ImageIcon,
  Video,
  Files,
  Trash2,
  Download,
  TrendingUp,
  PieChart,
  Sparkles,
  Zap,
  BarChart3,
  Activity,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from "lucide-react"

export default function StoragePage() {
  const { files, getFilesByCategory, getStorageUsed, deleteFile } = useFileManager()
  const [isClearing, setIsClearing] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const storageInfo = getStorageUsed()
  const documents = getFilesByCategory("documents")
  const images = getFilesByCategory("images")
  const videos = getFilesByCategory("videos")
  const others = files.filter((file) => file.category === "other")

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getCategorySize = (category: string) => {
    const categoryFiles = getFilesByCategory(category)
    return categoryFiles.reduce((total, file) => total + file.size, 0)
  }

  const getOtherSize = () => {
    return others.reduce((total, file) => total + file.size, 0)
  }

  const categoryStats = [
    {
      name: "Dokumen",
      count: documents.length,
      size: getCategorySize("documents"),
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
    },
    {
      name: "Gambar",
      count: images.length,
      size: getCategorySize("images"),
      icon: ImageIcon,
      color: "text-green-600",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      borderColor: "border-green-200",
    },
    {
      name: "Video",
      count: videos.length,
      size: getCategorySize("videos"),
      icon: Video,
      color: "text-red-600",
      bgColor: "bg-gradient-to-br from-red-50 to-red-100",
      borderColor: "border-red-200",
    },
    {
      name: "Lainnya",
      count: others.length,
      size: getOtherSize(),
      icon: Files,
      color: "text-gray-600",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100",
      borderColor: "border-gray-200",
    },
  ]

  const getStorageStatus = (percentage: number) => {
    if (percentage < 50) return { status: "Baik", color: "text-green-600", bgColor: "bg-green-100", icon: CheckCircle }
    if (percentage < 80)
      return { status: "Sedang", color: "text-yellow-600", bgColor: "bg-yellow-100", icon: AlertTriangle }
    return { status: "Penuh", color: "text-red-600", bgColor: "bg-red-100", icon: AlertTriangle }
  }

  const storageStatus = getStorageStatus(storageInfo.percentage)

  const handleClearCache = async () => {
    setIsClearing(true)

    // Simulate cache clearing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "🧹 Cache Berhasil Dibersihkan",
      description: "File cache dan data sementara telah dihapus",
      className: "notification-success text-white border-0",
    })

    setIsClearing(false)
  }

  const handleExportData = async () => {
    setIsExporting(true)

    try {
      // Create export data
      const exportData = {
        files: files.map((file) => ({
          name: file.name,
          size: file.size,
          category: file.category,
          createdAt: file.createdAt,
          isFavorite: file.isFavorite,
        })),
        summary: {
          totalFiles: files.length,
          totalSize: storageInfo.used,
          categories: categoryStats.map((cat) => ({
            name: cat.name,
            count: cat.count,
            size: cat.size,
          })),
        },
        exportDate: new Date().toISOString(),
      }

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `zipflow-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "📥 Data Berhasil Diekspor",
        description: "File backup telah diunduh ke perangkat Anda",
        className: "notification-success text-white border-0",
      })
    } catch (error) {
      toast({
        title: "❌ Gagal Mengekspor Data",
        description: "Terjadi kesalahan saat mengekspor data",
        variant: "destructive",
        className: "notification-error text-white border-0",
      })
    }

    setIsExporting(false)
  }

  const handleCleanupFiles = () => {
    // Find large files or old files for cleanup suggestions
    const largeFiles = files.filter((file) => file.size > 10 * 1024 * 1024) // Files > 10MB
    const oldFiles = files.filter((file) => {
      const fileDate = new Date(file.createdAt)
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      return fileDate < sixMonthsAgo
    })

    if (largeFiles.length === 0 && oldFiles.length === 0) {
      toast({
        title: "✨ Penyimpanan Sudah Optimal",
        description: "Tidak ada file yang perlu dibersihkan saat ini",
        className: "notification-info text-white border-0",
      })
      return
    }

    toast({
      title: "🔍 Analisis Penyimpanan",
      description: `Ditemukan ${largeFiles.length} file besar dan ${oldFiles.length} file lama yang dapat dibersihkan`,
      className: "notification-info text-white border-0",
    })
  }

  return (
    <div className="flex-1 space-y-8 p-6 bg-gradient-to-br from-slate-50 to-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="hover-lift" />
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold gradient-text">💾 Penyimpanan</h1>
              <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
            </div>
            <p className="text-gray-600 text-lg flex items-center gap-2">
              <Zap className="h-4 w-4 text-sky-500" />
              Kelola dan pantau penggunaan penyimpanan Anda
            </p>
          </div>
        </div>
      </div>

      {/* Storage Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <Card className="lg:col-span-2 card-modern border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="bg-gradient-to-br from-sky-400 to-blue-600 p-3 rounded-xl">
                <HardDrive className="h-6 w-6 text-white" />
              </div>
              Ringkasan Penyimpanan
              <div className="flex items-center gap-1 ml-auto">
                <Activity className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">Real-time</span>
              </div>
            </CardTitle>
            <CardDescription className="text-lg">Penggunaan penyimpanan saat ini</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{formatFileSize(storageInfo.used)}</p>
                  <p className="text-lg text-gray-600">dari {formatFileSize(storageInfo.total)} digunakan</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">{storageInfo.percentage.toFixed(1)}%</p>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${storageStatus.bgColor}`}>
                    <storageStatus.icon className={`w-4 h-4 ${storageStatus.color}`} />
                    <p className={`text-sm font-semibold ${storageStatus.color}`}>{storageStatus.status}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Progress value={storageInfo.percentage} className="h-4 bg-gray-200" />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>0 GB</span>
                  <span className="font-semibold">Sisa: {formatFileSize(storageInfo.total - storageInfo.used)}</span>
                  <span>5 GB</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-lg text-gray-600">Sisa penyimpanan</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatFileSize(storageInfo.total - storageInfo.used)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-modern border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="bg-gradient-to-br from-purple-400 to-pink-600 p-3 rounded-xl">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              Statistik File
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-900">{files.length}</p>
                <p className="text-lg text-gray-600">Total File</p>
              </div>

              <div className="space-y-4">
                {categoryStats.map((category) => (
                  <div
                    key={category.name}
                    className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`${category.bgColor} p-2 rounded-xl`}>
                        <category.icon className={`h-5 w-5 ${category.color}`} />
                      </div>
                      <span className="font-semibold text-gray-700">{category.name}</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{category.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Storage by Category */}
      <Card className="card-modern border-0 shadow-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="bg-gradient-to-br from-orange-400 to-red-600 p-3 rounded-xl">
              <PieChart className="h-6 w-6 text-white" />
            </div>
            Penyimpanan per Kategori
          </CardTitle>
          <CardDescription className="text-lg">Breakdown penggunaan penyimpanan berdasarkan jenis file</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryStats.map((category, index) => (
              <Card
                key={category.name}
                className={`card-modern hover-lift border ${category.borderColor} animate-scale-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className={`${category.bgColor} rounded-2xl p-4 mb-4`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-white/80 p-3 rounded-xl">
                        <category.icon className={`h-6 w-6 ${category.color}`} />
                      </div>
                      <span className="text-sm font-bold text-gray-600">{category.count} file</span>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">{category.name}</h3>
                      <p className="text-2xl font-bold text-gray-900 mb-1">{formatFileSize(category.size)}</p>
                      <p className="text-sm text-gray-500 font-semibold">
                        {storageInfo.used > 0 ? ((category.size / storageInfo.used) * 100).toFixed(1) : 0}% dari total
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Storage Actions */}
      <Card className="card-modern border-0 shadow-lg animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="bg-gradient-to-br from-green-400 to-blue-600 p-3 rounded-xl">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            Kelola Penyimpanan
          </CardTitle>
          <CardDescription className="text-lg">Tindakan untuk mengoptimalkan penggunaan penyimpanan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-4 hover-lift card-modern"
              onClick={handleCleanupFiles}
            >
              <div className="bg-gradient-to-br from-red-100 to-red-200 p-4 rounded-2xl">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
              <div className="text-center">
                <p className="font-bold text-lg text-gray-900">Bersihkan File</p>
                <p className="text-sm text-gray-600">Hapus file yang tidak diperlukan</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-4 hover-lift card-modern"
              onClick={handleExportData}
              disabled={isExporting}
            >
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-2xl">
                {isExporting ? (
                  <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
                ) : (
                  <Download className="h-8 w-8 text-blue-600" />
                )}
              </div>
              <div className="text-center">
                <p className="font-bold text-lg text-gray-900">{isExporting ? "Mengekspor..." : "Unduh Semua"}</p>
                <p className="text-sm text-gray-600">Backup file ke perangkat</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-4 hover-lift card-modern"
              onClick={handleClearCache}
              disabled={isClearing}
            >
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-4 rounded-2xl">
                {isClearing ? (
                  <RefreshCw className="h-8 w-8 text-yellow-600 animate-spin" />
                ) : (
                  <RefreshCw className="h-8 w-8 text-yellow-600" />
                )}
              </div>
              <div className="text-center">
                <p className="font-bold text-lg text-gray-900">{isClearing ? "Membersihkan..." : "Bersihkan Cache"}</p>
                <p className="text-sm text-gray-600">Hapus file sementara</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
