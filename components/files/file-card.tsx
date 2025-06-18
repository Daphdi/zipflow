"use client"

import type React from "react"
import { useCallback, useState } from "react"
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
import { Eye, MoreVertical, Download, Heart, Trash2, FileText, ImageIcon, Video, FilesIcon, MusicIcon, Loader2 } from "lucide-react"
import type { FileItem } from "@/components/file-manager"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface FileCardProps {
  file: FileItem
  onPreview: (file: FileItem, event?: React.MouseEvent) => void
  onDownload: (file: FileItem) => void
  onToggleFavorite: (file: FileItem) => void
  onDelete: (file: FileItem) => void
  index: number
  disabled?: boolean
}

export function FileCard({
  file,
  onPreview,
  onDownload,
  onToggleFavorite,
  onDelete,
  index,
  disabled = false,
}: FileCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

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

  const getFileIcon = () => {
    if (file.thumbnail && file.mimeType?.startsWith('image/')) {
      return (
        <div className="relative w-12 h-12 rounded-lg overflow-hidden">
          <Image
            src={file.thumbnail}
            alt={file.name}
            fill
            sizes="48px"
            className="object-cover"
            unoptimized
          />
        </div>
      )
    }

    switch (file.mimeType?.split('/')[0]) {
      case 'image':
        return <ImageIcon className="w-12 h-12 text-blue-500" />
      case 'video':
        return <Video className="w-12 h-12 text-purple-500" />
      case 'audio':
        return <MusicIcon className="w-12 h-12 text-green-500" />
      default:
        return <FilesIcon className="w-12 h-12 text-gray-500" />
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

  // Robust event handlers with useCallback and proper error handling
  const handlePreviewClick = useCallback(
    (event: React.MouseEvent) => {
      if (disabled) return

      console.log(`Preview clicked for file: ${file.name}`)

      // Use standard event methods with fallbacks
      try {
        event.preventDefault()
        event.stopPropagation()
      } catch (error) {
        console.warn("Event handling warning:", error)
      }

      onPreview(file, event)
    },
    [disabled, file, onPreview],
  )

  const handleDropdownClick = useCallback(
    (event: React.MouseEvent) => {
      if (disabled) return

      console.log("Dropdown clicked")

      try {
        event.preventDefault()
        event.stopPropagation()
      } catch (error) {
        console.warn("Event handling warning:", error)
      }
    },
    [disabled],
  )

  const handleMenuAction = useCallback(
    (action: () => void, actionName: string) => {
      return (event: React.MouseEvent) => {
        if (disabled) return

        console.log(`Menu action: ${actionName} for file: ${file.name}`)

        try {
          event.preventDefault()
          event.stopPropagation()
        } catch (error) {
          console.warn("Event handling warning:", error)
        }

        action()
      }
    },
    [disabled, file.name],
  )

  const handleCardClick = useCallback(
    (event: React.MouseEvent) => {
      // Only handle card click if it's not on interactive elements
      const target = event.target as HTMLElement
      const isInteractive = target.closest(
        'button, [role="button"], a, input, select, textarea, [data-radix-dropdown-trigger]',
      )

      if (!isInteractive && !disabled) {
        handlePreviewClick(event)
      }
    },
    [disabled, handlePreviewClick],
  )

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isDeleting) return

    setIsDeleting(true)
    try {
      await onDelete(file)
      toast({
        title: "File Deleted",
        description: `${file.name} has been moved to trash`,
      })
    } catch (error) {
      console.error('Delete error:', error)
      toast({
        title: "Delete Failed",
        description: "Failed to delete the file",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card
      className={`group card-modern border-0 shadow-lg overflow-hidden animate-scale-in transition-all duration-200 ${
        disabled ? "opacity-50 pointer-events-none" : "hover-lift cursor-pointer"
      }`}
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        <div className="relative">
          {/* File Preview with fixed dimensions */}
          <div
            className="bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden relative"
            style={{
              width: "100%",
              height: "200px",
              minHeight: "200px",
              maxHeight: "200px",
            }}
          >
            {file.category === "image" && file.thumbnail ? (
              <div className="w-full h-full relative">
                <img
                  src={file.thumbnail || "/placeholder.svg"}
                  alt={file.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                  onError={(e) => {
                    const target = e.currentTarget
                    target.style.display = "none"
                    target.nextElementSibling?.classList.remove("hidden")
                  }}
                />
                <div className="hidden w-full h-full flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="bg-white/80 p-4 rounded-2xl mb-4 w-fit mx-auto">{getFileIcon()}</div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                      {file.name.split(".").pop()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-6 w-full h-full flex flex-col items-center justify-center">
                <div className="bg-white/80 p-4 rounded-2xl mb-4 w-fit">{getFileIcon()}</div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{file.name.split(".").pop()}</p>
              </div>
            )}

            {/* Favorite Badge */}
            {file.isFavorite && (
              <div className="absolute top-3 left-3">
                <div className="bg-red-500 p-2 rounded-full shadow-lg">
                  <Heart className="h-4 w-4 text-white fill-current" />
                </div>
              </div>
            )}
          </div>

          {/* File Info & Actions */}
          <div className="p-6 space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 truncate text-lg mb-2" title={file.name}>
                {file.name}
              </h3>
              {getCategoryBadge(file.category)}
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="text-sm text-gray-500 space-y-1">
                <p className="font-semibold">📦 {formatFileSize(file.size)}</p>
                <p>📅 {formatDate(file.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-10 w-10 bg-white/90 hover:bg-white shadow-lg"
                  onClick={handlePreviewClick}
                  disabled={disabled}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-10 w-10 bg-white/90 hover:bg-white shadow-lg"
                      onClick={handleDropdownClick}
                      disabled={disabled}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="card-modern">
                    <DropdownMenuItem
                      onClick={handleMenuAction(() => onPreview(file), "preview")}
                      className="hover-lift"
                    >
                      <Eye className="h-4 w-4 mr-3" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleMenuAction(() => onDownload(file), "download")}
                      className="hover-lift"
                    >
                      <Download className="h-4 w-4 mr-3" />
                      Unduh
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleMenuAction(() => onToggleFavorite(file), "favorite")}
                      className="hover-lift"
                    >
                      <Heart className={`h-4 w-4 mr-3 ${file.isFavorite ? "fill-current text-red-500" : ""}`} />
                      {file.isFavorite ? "Hapus dari Favorit" : "Tambah ke Favorit"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-red-600 hover-lift"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-3" />
                      )}
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
