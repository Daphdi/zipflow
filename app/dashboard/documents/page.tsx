"use client"

import { useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useFileManager } from "@/components/file-manager"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  FileText,
  MoreVertical,
  Download,
  Trash2,
  Heart,
  Eye,
  Filter,
  Sparkles,
  Zap,
  Grid3X3,
  List,
  SortAsc,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DocumentsPage() {
  const { getFilesByCategory, deleteFile, toggleFavorite, searchFiles } = useFileManager()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const { toast } = useToast()

  const documents = getFilesByCategory("documents")
  const filteredDocuments = searchQuery
    ? searchFiles(searchQuery).filter((file) => file.category === "document")
    : documents

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleDownload = (file: any) => {
    if (file.url) {
      const link = document.createElement("a")
      link.href = file.url
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "📥 Dokumen Diunduh",
        description: `${file.name} berhasil diunduh`,
        className: "notification-success text-white border-0",
      })
    }
  }

  const handlePreview = (file: any) => {
    if (file.url) {
      window.open(file.url, "_blank")
    }
  }

  const handleDelete = (file: any) => {
    deleteFile(file.id)
    toast({
      title: "🗑️ Dokumen Dihapus",
      description: `${file.name} telah dihapus`,
      className: "notification-info text-white border-0",
    })
  }

  const handleToggleFavorite = (file: any) => {
    toggleFavorite(file.id)
    const isFavorite = !file.isFavorite
    toast({
      title: isFavorite ? "❤️ Ditambahkan ke Favorit" : "💔 Dihapus dari Favorit",
      description: `${file.name} ${isFavorite ? "ditambahkan ke" : "dihapus dari"} favorit`,
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
              <h1 className="text-4xl font-bold gradient-text">📄 Dokumen</h1>
              <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
            </div>
            <p className="text-gray-600 text-lg flex items-center gap-2">
              <Zap className="h-4 w-4 text-sky-500" />
              Semua dokumen dan file teks Anda
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="hover-lift h-12 w-12"
          >
            {viewMode === "grid" ? <List className="h-5 w-5" /> : <Grid3X3 className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="🔍 Cari dokumen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-lg border-2 border-gray-200 focus:border-sky-400 transition-all duration-300 hover-glow"
          />
        </div>
        <Button variant="outline" className="h-12 px-6 hover-lift flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filter
        </Button>
        <Button variant="outline" className="h-12 px-6 hover-lift flex items-center gap-2">
          <SortAsc className="h-5 w-5" />
          Urutkan
        </Button>
      </div>

      {/* Document Count */}
      <div className="flex items-center justify-between animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <p className="text-lg text-gray-600 font-semibold flex items-center gap-2">
          📊 {filteredDocuments.length} dokumen ditemukan
        </p>
      </div>

      {/* Documents List */}
      {filteredDocuments.length > 0 ? (
        <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          {viewMode === "list" ? (
            <div className="space-y-3">
              {filteredDocuments.map((file, index) => (
                <Card
                  key={file.id}
                  className="card-modern hover-lift border-0 shadow-lg animate-scale-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                          <FileText className="h-8 w-8 text-blue-600" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-gray-900 truncate text-lg">{file.name}</h3>
                          {file.isFavorite && <Heart className="h-5 w-5 text-red-500 fill-current flex-shrink-0" />}
                        </div>
                        <div className="flex items-center gap-6">
                          <Badge
                            variant="outline"
                            className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200 font-semibold"
                          >
                            📄 Dokumen
                          </Badge>
                          <span className="text-sm text-gray-500 font-semibold">📦 {formatFileSize(file.size)}</span>
                          <span className="text-sm text-gray-500">📅 {formatDate(file.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="hover-lift"
                          onClick={() => handlePreview(file)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="outline" className="hover-lift">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="card-modern">
                            <DropdownMenuItem onClick={() => handlePreview(file)} className="hover-lift">
                              <Eye className="h-4 w-4 mr-3" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload(file)} className="hover-lift">
                              <Download className="h-4 w-4 mr-3" />
                              Unduh
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleFavorite(file)} className="hover-lift">
                              <Heart className={`h-4 w-4 mr-3 ${file.isFavorite ? "fill-current text-red-500" : ""}`} />
                              {file.isFavorite ? "Hapus dari Favorit" : "Tambah ke Favorit"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(file)} className="text-red-600 hover-lift">
                              <Trash2 className="h-4 w-4 mr-3" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="file-grid">
              {filteredDocuments.map((file, index) => (
                <Card
                  key={file.id}
                  className="group card-modern hover-lift border-0 shadow-lg overflow-hidden"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="aspect-square bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                        <div className="text-center p-6">
                          <div className="bg-white/80 p-4 rounded-2xl mb-4 mx-auto w-fit">
                            <FileText className="h-12 w-12 text-blue-600" />
                          </div>
                          <p className="text-sm font-bold text-blue-600 uppercase tracking-wider">
                            {file.name.split(".").pop()}
                          </p>
                        </div>
                      </div>

                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-10 w-10 bg-white/90 hover:bg-white shadow-lg"
                            onClick={() => handlePreview(file)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="icon"
                                variant="secondary"
                                className="h-10 w-10 bg-white/90 hover:bg-white shadow-lg"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="card-modern">
                              <DropdownMenuItem onClick={() => handlePreview(file)} className="hover-lift">
                                <Eye className="h-4 w-4 mr-3" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownload(file)} className="hover-lift">
                                <Download className="h-4 w-4 mr-3" />
                                Unduh
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleFavorite(file)} className="hover-lift">
                                <Heart
                                  className={`h-4 w-4 mr-3 ${file.isFavorite ? "fill-current text-red-500" : ""}`}
                                />
                                {file.isFavorite ? "Hapus dari Favorit" : "Tambah ke Favorit"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDelete(file)} className="text-red-600 hover-lift">
                                <Trash2 className="h-4 w-4 mr-3" />
                                Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {file.isFavorite && (
                        <div className="absolute top-3 left-3">
                          <div className="bg-red-500 p-2 rounded-full shadow-lg">
                            <Heart className="h-4 w-4 text-white fill-current" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="font-bold text-gray-900 truncate text-lg mb-2" title={file.name}>
                          {file.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200 font-semibold"
                        >
                          📄 Dokumen
                        </Badge>
                      </div>

                      <div className="text-sm text-gray-500 space-y-1">
                        <p className="font-semibold">📦 {formatFileSize(file.size)}</p>
                        <p>📅 {formatDate(file.createdAt)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-full p-8 w-32 h-32 mx-auto mb-8 flex items-center justify-center animate-float">
            <FileText className="h-16 w-16 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {searchQuery ? "🔍 Tidak ada dokumen yang ditemukan" : "📄 Belum ada dokumen"}
          </h3>
          <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
            {searchQuery
              ? `Tidak ada dokumen yang cocok dengan "${searchQuery}"`
              : "Upload dokumen pertama Anda untuk memulai"}
          </p>
        </div>
      )}
    </div>
  )
}
