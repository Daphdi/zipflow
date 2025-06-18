"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Download, Trash2, Star, Eye, FileText, File, Video, Music, StarIcon } from "lucide-react"
import { deleteFile, toggleFavorite } from "@/lib/files"
import { showToast } from "@/lib/toast"
import FileDetailModal from "@/components/file-detail-modal"
import type { FileItem } from "@/lib/types"

interface FileGridProps {
  files: FileItem[]
  onFileChange: () => void
  viewMode?: "grid" | "list"
}

export default function FileGrid({ files, onFileChange, viewMode = "grid" }: FileGridProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [favoritingId, setFavoritingId] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const handleDelete = async (fileId: string) => {
    setDeletingId(fileId)
    try {
      await deleteFile(fileId)
      showToast("File berhasil dihapus", "success")
      onFileChange()
    } catch (error) {
      showToast("Gagal menghapus file", "error")
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleFavorite = async (fileId: string) => {
    setFavoritingId(fileId)
    try {
      const result = await toggleFavorite(fileId)
      showToast(result.isFavorite ? "Ditambahkan ke favorit" : "Dihapus dari favorit", "success")
      onFileChange()
    } catch (error) {
      showToast("Gagal mengubah status favorit", "error")
    } finally {
      setFavoritingId(null)
    }
  }

  const handleDownload = (file: FileItem) => {
    const link = document.createElement("a")
    link.href = file.url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast("File sedang didownload", "success")
  }

  const handleViewDetail = (file: FileItem) => {
    setSelectedFile(file)
    setShowDetailModal(true)
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return null // Will show thumbnail
    if (type.startsWith("video/")) return Video
    if (type.startsWith("audio/")) return Music
    if (type.includes("pdf") || type.includes("doc")) return FileText
    return File
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
      month: "short",
      day: "numeric",
    })
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="p-4 bg-slate-800/50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <File className="h-10 w-10 text-slate-500" />
        </div>
        <h3 className="text-xl font-semibold text-slate-300 mb-2">Tidak Ada File</h3>
        <p className="text-slate-500">File tidak ditemukan dengan kriteria pencarian</p>
      </div>
    )
  }

  if (viewMode === "list") {
    return (
      <>
        <div className="space-y-2">
          {files.map((file) => {
            const FileIcon = getFileIcon(file.type)

            return (
              <Card
                key={file.id}
                className="group hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 bg-slate-800/50 border-slate-700/50 hover:border-purple-500/30 backdrop-blur-sm"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-700/30 rounded-lg overflow-hidden flex-shrink-0">
                      {file.type.startsWith("image/") ? (
                        <Image
                          src={file.url || "/placeholder.svg"}
                          alt={file.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : FileIcon ? (
                        <div className="flex items-center justify-center h-full">
                          <FileIcon className="h-6 w-6 text-slate-400" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <File className="h-6 w-6 text-slate-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm truncate text-white" title={file.name}>
                          {file.name}
                        </h3>
                        {file.isFavorite && <StarIcon className="h-4 w-4 text-yellow-400 fill-current flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                        <span>{formatFileSize(file.size)}</span>
                        <span>{formatDate(file.uploadedAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetail(file)}
                        className="text-slate-400 hover:text-white hover:bg-slate-700"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-white hover:bg-slate-700"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                          <DropdownMenuItem
                            onClick={() => handleViewDetail(file)}
                            className="text-slate-300 hover:text-white hover:bg-slate-700"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDownload(file)}
                            className="text-slate-300 hover:text-white hover:bg-slate-700"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleFavorite(file.id)}
                            disabled={favoritingId === file.id}
                            className="text-slate-300 hover:text-white hover:bg-slate-700"
                          >
                            <Star className={`mr-2 h-4 w-4 ${file.isFavorite ? "text-yellow-400 fill-current" : ""}`} />
                            {favoritingId === file.id
                              ? "Memproses..."
                              : file.isFavorite
                                ? "Hapus dari Favorit"
                                : "Tambah ke Favorit"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(file.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            disabled={deletingId === file.id}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {deletingId === file.id ? "Menghapus..." : "Hapus"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <FileDetailModal
          file={selectedFile}
          open={showDetailModal}
          onOpenChange={setShowDetailModal}
          onFileChange={onFileChange}
        />
      </>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {files.map((file) => {
          const FileIcon = getFileIcon(file.type)

          return (
            <Card
              key={file.id}
              className="group hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 bg-slate-800/50 border-slate-700/50 hover:border-purple-500/30 backdrop-blur-sm cursor-pointer"
              onClick={() => handleViewDetail(file)}
            >
              <CardContent className="p-4">
                <div className="aspect-square mb-3 bg-slate-700/30 rounded-xl overflow-hidden relative">
                  {file.type.startsWith("image/") ? (
                    <Image src={file.url || "/placeholder.svg"} alt={file.name} fill className="object-cover" />
                  ) : FileIcon ? (
                    <div className="flex items-center justify-center h-full">
                      <FileIcon className="h-12 w-12 text-slate-400" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <File className="h-12 w-12 text-slate-400" />
                    </div>
                  )}

                  {/* Favorite indicator */}
                  {file.isFavorite && (
                    <div className="absolute top-2 left-2">
                      <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                    </div>
                  )}

                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-8 w-8 p-0 bg-slate-800/80 hover:bg-slate-700 border-slate-600"
                        >
                          <MoreHorizontal className="h-4 w-4 text-slate-300" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewDetail(file)
                          }}
                          className="text-slate-300 hover:text-white hover:bg-slate-700"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDownload(file)
                          }}
                          className="text-slate-300 hover:text-white hover:bg-slate-700"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleFavorite(file.id)
                          }}
                          disabled={favoritingId === file.id}
                          className="text-slate-300 hover:text-white hover:bg-slate-700"
                        >
                          <Star className={`mr-2 h-4 w-4 ${file.isFavorite ? "text-yellow-400 fill-current" : ""}`} />
                          {favoritingId === file.id
                            ? "Memproses..."
                            : file.isFavorite
                              ? "Hapus dari Favorit"
                              : "Tambah ke Favorit"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(file.id)
                          }}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          disabled={deletingId === file.id}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {deletingId === file.id ? "Menghapus..." : "Hapus"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-sm truncate text-white" title={file.name}>
                    {file.name}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{formatFileSize(file.size)}</span>
                    <span>{formatDate(file.uploadedAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <FileDetailModal
        file={selectedFile}
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        onFileChange={onFileChange}
      />
    </>
  )
}
