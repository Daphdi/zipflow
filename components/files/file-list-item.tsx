"use client"

import type React from "react"

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
import { Eye, MoreVertical, Download, Heart, Trash2, FileText, ImageIcon, Video, FilesIcon } from "lucide-react"
import type { FileItem } from "@/components/file-manager"
import { useCallback } from "react"

interface FileListItemProps {
  file: FileItem
  onPreview: (file: FileItem) => void
  onDownload: (file: FileItem) => void
  onToggleFavorite: (file: FileItem) => void
  onDelete: (file: FileItem) => void
  index: number
}

export function FileListItem({ file, onPreview, onDownload, onToggleFavorite, onDelete, index }: FileListItemProps) {
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

  const getFileIcon = (category: string) => {
    switch (category) {
      case "document":
        return <FileText className="h-6 w-6 text-blue-600" />
      case "image":
        return <ImageIcon className="h-6 w-6 text-green-600" />
      case "video":
        return <Video className="h-6 w-6 text-red-600" />
      default:
        return <FilesIcon className="h-6 w-6 text-gray-600" />
    }
  }

  const getCategoryBadge = (category: string) => {
    const badgeVariants = {
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
      <Badge variant="outline" className={`${badgeVariants[category as keyof typeof badgeVariants]} font-semibold`}>
        {labels[category as keyof typeof labels]}
      </Badge>
    )
  }

  // Add proper event handling for list items
  const handlePreviewClick = useCallback(
    (event: React.MouseEvent) => {
      console.log(`Preview clicked for file: ${file.name}`)

      try {
        event.preventDefault()
        event.stopPropagation()
      } catch (error) {
        console.warn("Event handling warning:", error)
      }

      onPreview(file)
    },
    [file, onPreview],
  )

  return (
    <Card
      className="card-modern hover-lift border-0 shadow-lg animate-scale-in"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <CardContent className="p-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              {file.category === "image" && file.thumbnail ? (
                <img
                  src={file.thumbnail || "/placeholder.svg"}
                  alt={file.name}
                  className="w-16 h-16 rounded-xl object-cover ring-2 ring-gray-200"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                  {getFileIcon(file.category)}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-bold text-gray-900 truncate text-lg">{file.name}</h3>
                {file.isFavorite && <Heart className="h-5 w-5 text-red-500 fill-current flex-shrink-0" />}
              </div>
              <div className="flex items-center gap-6">
                {getCategoryBadge(file.category)}
                <span className="text-sm text-gray-500 font-semibold">📦 {formatFileSize(file.size)}</span>
                <span className="text-sm text-gray-500">📅 {formatDate(file.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 mt-2">
            <Button size="icon" variant="outline" className="hover-lift" onClick={handlePreviewClick}>
              <Eye className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="hover-lift">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="card-modern">
                <DropdownMenuItem onClick={() => onPreview(file)} className="hover-lift">
                  <Eye className="h-4 w-4 mr-3" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownload(file)} className="hover-lift">
                  <Download className="h-4 w-4 mr-3" />
                  Unduh
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleFavorite(file)} className="hover-lift">
                  <Heart className={`h-4 w-4 mr-3 ${file.isFavorite ? "fill-current text-red-500" : ""}`} />
                  {file.isFavorite ? "Hapus dari Favorit" : "Tambah ke Favorit"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete(file)} className="text-red-600 hover-lift">
                  <Trash2 className="h-4 w-4 mr-3" />
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
