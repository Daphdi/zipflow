"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Search,
  File,
  FileText,
  ImageIcon,
  Video,
  Music,
  Archive,
  Clock,
  Star,
  Calendar,
  X,
  ArrowRight,
  Cloud,
} from "lucide-react"
import { getFiles } from "@/lib/files"
import { showToast } from "@/lib/toast"
import type { FileItem } from "@/lib/types"

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<FileItem[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<string>("all")
  const [allFiles, setAllFiles] = useState<FileItem[]>([])

  useEffect(() => {
    if (open) {
      loadFiles()
      loadRecentSearches()
      // Focus pada input ketika modal dibuka
      setTimeout(() => {
        const input = document.querySelector(
          'input[placeholder="Cari file, folder, atau konten..."]',
        ) as HTMLInputElement
        if (input) input.focus()
      }, 100)
    }
  }, [open])

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch()
    } else {
      setSearchResults([])
    }
  }, [searchQuery, selectedFilter, allFiles])

  const loadFiles = async () => {
    try {
      const files = await getFiles()
      setAllFiles(files)
    } catch (error) {
      console.error("Error loading files:", error)
    }
  }

  const loadRecentSearches = () => {
    if (typeof window !== "undefined") {
      const recent = JSON.parse(localStorage.getItem("recentSearches") || "[]")
      setRecentSearches(recent.slice(0, 5))
    }
  }

  const saveRecentSearch = (query: string) => {
    if (query.trim().length < 2 || typeof window === "undefined") return

    const recent = JSON.parse(localStorage.getItem("recentSearches") || "[]")
    const updated = [query, ...recent.filter((item: string) => item !== query)].slice(0, 10)
    localStorage.setItem("recentSearches", JSON.stringify(updated))
    setRecentSearches(updated.slice(0, 5))
  }

  const performSearch = useCallback(async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)

    try {
      // Simulasi delay untuk efek loading
      await new Promise((resolve) => setTimeout(resolve, 300))

      let filtered = allFiles.filter(
        (file) =>
          file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          file.type.toLowerCase().includes(searchQuery.toLowerCase()),
      )

      // Apply filter
      if (selectedFilter !== "all") {
        filtered = filtered.filter((file) => {
          switch (selectedFilter) {
            case "images":
              return file.type.startsWith("image/")
            case "videos":
              return file.type.startsWith("video/")
            case "documents":
              return file.type.includes("pdf") || file.type.includes("doc") || file.type.includes("txt")
            case "audio":
              return file.type.startsWith("audio/")
            case "favorites":
              return file.isFavorite
            case "recent":
              const oneWeekAgo = new Date()
              oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
              return new Date(file.uploadedAt) > oneWeekAgo
            default:
              return true
          }
        })
      }

      // Sort by relevance (name match first, then type match)
      filtered.sort((a, b) => {
        const aNameMatch = a.name.toLowerCase().includes(searchQuery.toLowerCase())
        const bNameMatch = b.name.toLowerCase().includes(searchQuery.toLowerCase())

        if (aNameMatch && !bNameMatch) return -1
        if (!aNameMatch && bNameMatch) return 1

        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      })

      setSearchResults(filtered)
    } catch (error) {
      console.error("Search error:", error)
      showToast("Terjadi kesalahan saat mencari", "error")
    } finally {
      setIsSearching(false)
    }
  }, [searchQuery, selectedFilter, allFiles])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      saveRecentSearch(query.trim())
    }
  }

  const clearRecentSearches = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("recentSearches")
      setRecentSearches([])
      showToast("Riwayat pencarian dihapus", "success")
    }
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return ImageIcon
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
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Kemarin"
    if (diffDays < 7) return `${diffDays} hari lalu`
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" })
  }

  const quickFilters = [
    { id: "all", label: "Semua", icon: Archive, color: "bg-slate-500/20 text-slate-300" },
    { id: "images", label: "Gambar", icon: ImageIcon, color: "bg-sky-500/20 text-sky-300" },
    { id: "videos", label: "Video", icon: Video, color: "bg-blue-500/20 text-blue-300" },
    { id: "documents", label: "Dokumen", icon: FileText, color: "bg-cyan-500/20 text-cyan-300" },
    { id: "audio", label: "Audio", icon: Music, color: "bg-indigo-500/20 text-indigo-300" },
    { id: "favorites", label: "Favorit", icon: Star, color: "bg-amber-500/20 text-amber-300" },
    { id: "recent", label: "Terbaru", icon: Clock, color: "bg-sky-500/20 text-sky-300" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] p-0 bg-gradient-to-br from-slate-800/95 to-slate-900/95 border border-sky-500/30 backdrop-blur-xl overflow-hidden">
        {/* Header dengan Search Input */}
        <div className="p-6 border-b border-sky-500/30">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <Input
              placeholder="Cari file, folder, atau konten..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-12 pr-12 h-14 text-lg bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-sky-500/20 rounded-xl"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            {isSearching && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-sky-500/20 border-t-sky-500"></div>
              </div>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {quickFilters.map((filter) => {
              const Icon = filter.icon
              return (
                <Button
                  key={filter.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`${
                    selectedFilter === filter.id ? "bg-sky-500/20 text-sky-300 border border-sky-400/30" : filter.color
                  } hover:scale-105 transition-all duration-200 rounded-lg px-3 py-2`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {filter.label}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto max-h-[60vh]">
          {!searchQuery ? (
            /* Default State - Recent Searches & Suggestions */
            <div className="p-6 space-y-6">
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Clock className="h-5 w-5 text-slate-400" />
                      Pencarian Terbaru
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearRecentSearches}
                      className="text-slate-400 hover:text-red-400"
                    >
                      Hapus Semua
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-600/50 hover:border-slate-500 transition-all duration-200 px-3 py-2"
                        onClick={() => handleSearch(search)}
                      >
                        <Clock className="h-3 w-3 mr-2" />
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-sky-400" />
                  Aksi Cepat
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div
                    className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/30 hover:border-sky-400/30 transition-all duration-300 cursor-pointer group"
                    onClick={() => setSelectedFilter("favorites")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-sky-500/20 rounded-lg group-hover:bg-sky-500/30 transition-colors">
                        <Star className="h-5 w-5 text-sky-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">File Favorit</h4>
                        <p className="text-sm text-slate-400">Lihat file yang ditandai favorit</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-400 ml-auto group-hover:text-sky-400 transition-colors" />
                    </div>
                  </div>

                  <div
                    className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/30 hover:border-sky-400/30 transition-all duration-300 cursor-pointer group"
                    onClick={() => setSelectedFilter("recent")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-sky-500/20 rounded-lg group-hover:bg-sky-500/30 transition-colors">
                        <Calendar className="h-5 w-5 text-sky-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">File Terbaru</h4>
                        <p className="text-sm text-slate-400">File yang baru diupload</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-400 ml-auto group-hover:text-sky-400 transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : searchResults.length === 0 && !isSearching ? (
            /* No Results */
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="p-6 bg-slate-800/50 rounded-3xl mb-6">
                <Search className="h-12 w-12 text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-300 mb-2">Tidak Ada Hasil</h3>
              <p className="text-slate-500 text-center max-w-md">
                Tidak ditemukan file yang cocok dengan &quot;{searchQuery}&quot;. Coba gunakan kata kunci lain atau ubah filter.
              </p>
            </div>
          ) : (
            /* Search Results */
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">
                  Hasil Pencarian {searchResults.length > 0 && `(${searchResults.length})`}
                </h3>
                {selectedFilter !== "all" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFilter("all")}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Hapus Filter
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {searchResults.map((file) => {
                  const FileIcon = getFileIcon(file.type)
                  return (
                    <div
                      key={file.id}
                      className="group p-4 bg-slate-800/30 rounded-xl border border-slate-700/30 hover:border-sky-400/30 hover:bg-slate-800/50 transition-all duration-300 cursor-pointer"
                      onClick={() => {
                        onOpenChange(false)
                        // Bisa ditambahkan navigasi ke file detail
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-700/50 rounded-xl group-hover:bg-slate-600/50 transition-colors">
                          <FileIcon className="h-6 w-6 text-slate-300" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-white truncate group-hover:text-sky-200 transition-colors">
                              {file.name}
                            </h4>
                            {file.isFavorite && <Star className="h-4 w-4 text-amber-400 fill-current flex-shrink-0" />}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span>{formatFileSize(file.size)}</span>
                            <span>•</span>
                            <span>{formatDate(file.uploadedAt)}</span>
                            <span>•</span>
                            <span className="capitalize">
                              {file.type.startsWith("image/")
                                ? "Gambar"
                                : file.type.startsWith("video/")
                                  ? "Video"
                                  : file.type.startsWith("audio/")
                                    ? "Audio"
                                    : file.type.includes("pdf") || file.type.includes("doc")
                                      ? "Dokumen"
                                      : "File"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-sky-400 transition-colors" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer dengan Keyboard Shortcuts */}
        <div className="p-4 border-t border-sky-500/30 bg-slate-800/30">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-slate-700/50 rounded border border-slate-600 text-slate-300">↑↓</kbd>
                <span>navigasi</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-slate-700/50 rounded border border-slate-600 text-slate-300">Enter</kbd>
                <span>buka</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-slate-700/50 rounded border border-slate-600 text-slate-300">Esc</kbd>
                <span>tutup</span>
              </div>
            </div>
            <div className="text-slate-500">Powered by CloudDrive Search</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
