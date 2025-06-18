"use client"

import { DialogFooter } from "@/components/ui/dialog"

import type React from "react"
import { useCallback, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, ImageIcon, Video, Files, Download, Heart, Trash2, X, Eye, ExternalLink, Info } from "lucide-react"
import type { FileItem } from "@/components/file-manager"

interface FilePreviewDialogProps {
  isOpen: boolean
  onClose: () => void
  file: FileItem | null
  onDownload: (file: FileItem) => void
  onToggleFavorite: (file: FileItem) => void
  onDelete: (file: FileItem) => void
}

export function FilePreviewDialog({
  isOpen,
  onClose,
  file,
  onDownload,
  onToggleFavorite,
  onDelete,
}: FilePreviewDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [previewError, setPreviewError] = useState(false)

  useEffect(() => {
    setIsDialogOpen(isOpen)
    if (!isOpen) {
      setIsImageLoaded(false)
      setPreviewError(false)
    }
  }, [isOpen])

  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      setIsDialogOpen(open)
      if (!open) {
        onClose()
      }
    },
    [onClose],
  )

  const getFileIcon = (category: string) => {
    switch (category) {
      case "document":
        return <FileText className="h-12 w-12 text-blue-600" />
      case "image":
        return <ImageIcon className="h-12 w-12 text-green-600" />
      case "video":
        return <Video className="h-12 w-12 text-red-600" />
      default:
        return <Files className="h-12 w-12 text-gray-600" />
    }
  }

  const getCategoryBadge = (category: string) => {
    const variants = {
      document: "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200",
      image: "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200",
      video: "bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-200",
      other: "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-200",
    }

    const labels = {
      document: "📄 Dokumen",
      image: "🖼️ Gambar",
      video: "🎥 Video",
      other: "📁 Lainnya",
    }

    return (
      <Badge
        variant="outline"
        className={`${variants[category as keyof typeof variants]} font-semibold text-sm px-3 py-1`}
      >
        {labels[category as keyof typeof labels]}
      </Badge>
    )
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
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleExternalPreview = useCallback(() => {
    if (file?.url) {
      window.open(file.url, "_blank")
    }
  }, [file])

  const handleDownloadClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (file) onDownload(file)
    },
    [file, onDownload],
  )

  const handleToggleFavoriteClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (file) onToggleFavorite(file)
    },
    [file, onToggleFavorite],
  )

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (file) onDelete(file)
    },
    [file, onDelete],
  )

  const handleCloseClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      onClose()
    },
    [onClose],
  )

  if (!file) return null

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl"
        onPointerDownOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="bg-gradient-to-br from-purple-400 to-pink-600 p-3 rounded-xl">
              <Eye className="h-7 w-7 text-white" />
            </div>
            Preview File
            {file.isFavorite && (
              <div className="bg-red-500 p-2 rounded-full ml-auto">
                <Heart className="h-5 w-5 text-white fill-current" />
              </div>
            )}
          </DialogTitle>
          <DialogDescription className="text-lg text-gray-600">
            Detail lengkap dan preview file yang dipilih
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          {/* Fixed Preview Container with Loading State */}
          <div
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 flex items-center justify-center relative overflow-hidden"
            style={{
              width: "100%",
              height: "400px",
              minHeight: "400px",
              maxHeight: "400px",
            }}
          >
            {file.category === "image" && file.thumbnail ? (
              <div className="w-full h-full flex items-center justify-center p-8 relative">
                {!isImageLoaded && !previewError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                  </div>
                )}
                <img
                  src={file.thumbnail || file.url}
                  alt={file.name}
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl ring-4 ring-white"
                  style={{
                    maxWidth: "calc(100% - 64px)",
                    maxHeight: "calc(100% - 64px)",
                    width: "auto",
                    height: "auto",
                  }}
                  onLoad={() => {
                    setIsImageLoaded(true)
                    setPreviewError(false)
                  }}
                  onError={() => {
                    setPreviewError(true)
                    setIsImageLoaded(false)
                  }}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleExternalPreview}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white shadow-lg z-10"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Buka Penuh
                </Button>
              </div>
            ) : file.category === "video" ? (
              <div className="w-full h-full flex items-center justify-center p-8">
                <video
                  src={file.url}
                  controls
                  className="max-w-full max-h-full rounded-2xl shadow-2xl ring-4 ring-white"
                  preload="metadata"
                  style={{
                    maxWidth: "calc(100% - 64px)",
                    maxHeight: "calc(100% - 64px)",
                    width: "auto",
                    height: "auto",
                  }}
                />
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-white/80 p-8 rounded-3xl mb-6 shadow-lg">{getFileIcon(file.category)}</div>
                <h3 className="text-2xl font-bold text-gray-700 flex-1 break-all">{file.name}</h3>
                <p className="text-gray-500 mb-6">Preview tidak tersedia untuk jenis file ini</p>
                <Button variant="outline" onClick={handleExternalPreview} className="hover-lift">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Buka di Tab Baru
                </Button>
              </div>
            )}
          </div>

          {/* File Information */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <h3 className="text-3xl font-bold text-gray-900 flex-1 break-all">{file.name}</h3>
              </div>
              <div className="flex items-center gap-3">
                {getCategoryBadge(file.category)}
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm font-semibold text-gray-600">ID: {file.id}</span>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-bold text-blue-700">Informasi File</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Ukuran File</p>
                      <p className="text-lg font-bold text-gray-900">📦 {formatFileSize(file.size)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Tipe File</p>
                      <p className="text-sm font-semibold text-gray-700">{file.mimeType || "Tidak diketahui"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-bold text-green-700">Tanggal & Waktu</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Dibuat</p>
                      <p className="text-sm font-bold text-gray-900">📅 {formatDate(file.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Dimodifikasi</p>
                      <p className="text-sm font-bold text-gray-900">🔄 {formatDate(file.modifiedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {file.url && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-bold text-gray-700">Lokasi File</span>
                </div>
                <p className="text-xs text-gray-500 font-mono bg-white px-3 py-2 rounded border break-all">
                  {file.url}
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-3 pt-8 border-t border-gray-200">
          <Button variant="outline" onClick={handleCloseClick} className="flex items-center gap-2 hover-lift">
            <X className="h-4 w-4" />
            Tutup
          </Button>
          <Button variant="outline" onClick={handleDownloadClick} className="flex items-center gap-2 hover-lift">
            <Download className="h-4 w-4" />
            Unduh
          </Button>
          <Button
            variant="outline"
            onClick={handleToggleFavoriteClick}
            className={`flex items-center gap-2 hover-lift ${
              file.isFavorite ? "text-red-600 border-red-200 hover:bg-red-50" : "hover:text-red-600"
            }`}
          >
            <Heart className={`h-4 w-4 ${file.isFavorite ? "fill-current" : ""}`} />
            {file.isFavorite ? "Hapus Favorit" : "Tambah Favorit"}
          </Button>
          <Button
            variant="outline"
            onClick={handleDeleteClick}
            className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover-lift"
          >
            <Trash2 className="h-4 w-4" />
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
