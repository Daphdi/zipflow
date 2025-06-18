"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Download,
  Star,
  Trash2,
  Calendar,
  HardDrive,
  FileType,
  StarIcon,
  ArrowLeft,
  Eye,
  ExternalLink,
  Clock,
  User,
  Shield,
} from "lucide-react"
import { deleteFile, toggleFavorite } from "@/lib/files"
import { showToast } from "@/lib/toast"
import type { FileItem } from "@/lib/types"

interface FileDetailModalProps {
  file: FileItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onFileChange: () => void
}

export default function FileDetailModal({ file, open, onOpenChange, onFileChange }: FileDetailModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isFavoriting, setIsFavoriting] = useState(false)

  if (!file) return null

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteFile(file.id)
      showToast("File berhasil dihapus", "success")
      onFileChange()
      onOpenChange(false)
    } catch (error) {
      showToast("Gagal menghapus file", "error")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleFavorite = async () => {
    setIsFavoriting(true)
    try {
      const result = await toggleFavorite(file.id)
      showToast(result.isFavorite ? "Ditambahkan ke favorit" : "Dihapus dari favorit", "success")
      onFileChange()
    } catch (error) {
      showToast("Gagal mengubah status favorit", "error")
    } finally {
      setIsFavoriting(false)
    }
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = file.url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast("File sedang didownload", "success")
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getFileTypeLabel = (type: string) => {
    if (type.startsWith("image/")) return "Gambar"
    if (type.startsWith("video/")) return "Video"
    if (type.startsWith("audio/")) return "Audio"
    if (type.includes("pdf")) return "PDF"
    if (type.includes("doc")) return "Dokumen"
    if (type.includes("sheet")) return "Spreadsheet"
    if (type.includes("presentation")) return "Presentasi"
    return "File"
  }

  const getFileTypeColor = (type: string) => {
    if (type.startsWith("image/")) return "bg-blue-500/20 text-blue-300 border-blue-400/40"
    if (type.startsWith("video/")) return "bg-red-500/20 text-red-300 border-red-400/40"
    if (type.startsWith("audio/")) return "bg-yellow-500/20 text-yellow-300 border-yellow-400/40"
    if (type.includes("pdf")) return "bg-red-500/20 text-red-300 border-red-400/40"
    if (type.includes("doc")) return "bg-blue-500/20 text-blue-300 border-blue-400/40"
    return "bg-gray-500/20 text-gray-300 border-gray-400/40"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-800/95 to-slate-900/95 border border-slate-600/50 text-white backdrop-blur-xl">
        {/* Enhanced Header */}
        <DialogHeader className="pb-6 border-b border-slate-700/50">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-2xl font-bold text-white truncate pr-4 mb-3">{file.name}</DialogTitle>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge className={`${getFileTypeColor(file.type)} border font-medium px-3 py-1`}>
                    <FileType className="h-3 w-3 mr-2" />
                    {getFileTypeLabel(file.type)}
                  </Badge>
                  {file.isFavorite && (
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/40 font-medium px-3 py-1">
                      <StarIcon className="h-3 w-3 mr-2 fill-current" />
                      Favorit
                    </Badge>
                  )}
                  <Badge className="bg-slate-600/30 text-slate-300 border-slate-500/40 font-medium px-3 py-1">
                    <Shield className="h-3 w-3 mr-2" />
                    Pribadi
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-8 pt-2">
          {/* Enhanced File Preview */}
          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
              {file.type.startsWith("image/") ? (
                <div className="relative w-full h-full group">
                  <Image
                    src={file.url || "/placeholder.svg"}
                    alt={file.name}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full relative">
                  <div className="text-center">
                    <div className="text-8xl mb-6 animate-pulse">
                      {file.type.startsWith("video/")
                        ? "🎥"
                        : file.type.startsWith("audio/")
                          ? "🎵"
                          : file.type.includes("pdf")
                            ? "📄"
                            : file.type.includes("doc")
                              ? "📝"
                              : "📁"}
                    </div>
                    <p className="text-slate-400 text-lg font-medium">Preview tidak tersedia</p>
                    <p className="text-slate-500 text-sm mt-2">Klik download untuk membuka file</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced File Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* File Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Eye className="h-5 w-5 text-blue-300" />
                </div>
                <h3 className="text-xl font-bold text-white">Detail File</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-800/40 rounded-xl border border-slate-700/30 hover:bg-slate-800/60 transition-colors">
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    <HardDrive className="h-5 w-5 text-slate-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-400 font-medium">Ukuran File</p>
                    <p className="font-bold text-white text-lg">{formatFileSize(file.size)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-800/40 rounded-xl border border-slate-700/30 hover:bg-slate-800/60 transition-colors">
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    <Calendar className="h-5 w-5 text-slate-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-400 font-medium">Tanggal Upload</p>
                    <p className="font-bold text-white">{formatDate(file.uploadedAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-800/40 rounded-xl border border-slate-700/30 hover:bg-slate-800/60 transition-colors">
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    <FileType className="h-5 w-5 text-slate-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-400 font-medium">Tipe File</p>
                    <p className="font-bold text-white">{file.type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-800/40 rounded-xl border border-slate-700/30 hover:bg-slate-800/60 transition-colors">
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    <User className="h-5 w-5 text-slate-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-400 font-medium">Pemilik</p>
                    <p className="font-bold text-white">Anda</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Actions */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <ExternalLink className="h-5 w-5 text-purple-300" />
                </div>
                <h3 className="text-xl font-bold text-white">Aksi File</h3>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleDownload}
                  className="w-full justify-start bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25 rounded-xl py-3 font-semibold transition-all duration-300 hover:scale-[1.02]"
                >
                  <Download className="h-5 w-5 mr-3" />
                  Download File
                </Button>

                <Button
                  onClick={handleToggleFavorite}
                  disabled={isFavoriting}
                  className={`w-full justify-start ${
                    file.isFavorite
                      ? "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-amber-500/25"
                      : "bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 shadow-slate-500/25"
                  } text-white shadow-lg rounded-xl py-3 font-semibold transition-all duration-300 hover:scale-[1.02]`}
                >
                  <Star className={`h-5 w-5 mr-3 ${file.isFavorite ? "fill-current" : ""}`} />
                  {isFavoriting ? "Memproses..." : file.isFavorite ? "Hapus dari Favorit" : "Tambah ke Favorit"}
                </Button>
              </div>

              {/* File Stats */}
              <div className="mt-8 p-4 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/30">
                <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Statistik File
                </h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-white">1</div>
                    <div className="text-xs text-slate-400">Kali didownload</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">0</div>
                    <div className="text-xs text-slate-400">Kali dibagikan</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-slate-700/50" />

          {/* Enhanced Danger Zone */}
          <div className="space-y-4 p-6 bg-gradient-to-br from-red-900/20 to-red-800/10 rounded-xl border border-red-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Trash2 className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-400">Zona Berbahaya</h3>
                <p className="text-sm text-red-300/80">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-500/25 rounded-xl py-3 font-semibold transition-all duration-300 hover:scale-[1.02]"
            >
              <Trash2 className="h-5 w-5 mr-3" />
              {isDeleting ? "Menghapus..." : "Hapus File Permanen"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
