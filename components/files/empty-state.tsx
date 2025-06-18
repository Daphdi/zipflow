"use client"

import { Button } from "@/components/ui/button"
import { Upload, Search } from "lucide-react"

interface EmptyStateProps {
  searchQuery: string
  onUploadClick: () => void
  disabled?: boolean
}

export function EmptyState({ searchQuery, onUploadClick, disabled = false }: EmptyStateProps) {
  if (searchQuery) {
    return (
      <div className="text-center py-16 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-8 w-32 h-32 mx-auto mb-8 flex items-center justify-center">
          <Search className="h-16 w-16 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Tidak Ada File Ditemukan</h3>
        <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
          Tidak ada file yang cocok dengan pencarian "{searchQuery}". Coba gunakan kata kunci yang berbeda.
        </p>
      </div>
    )
  }

  return (
    <div className="text-center py-16 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
      <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full p-8 w-32 h-32 mx-auto mb-8 flex items-center justify-center">
        <Upload className="h-16 w-16 text-blue-500" />
      </div>
      <h3 className="text-2xl font-bold text-gray-700 mb-4">Belum Ada File</h3>
      <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
        Mulai dengan mengupload file pertama Anda ke ZipFlow. Drag & drop atau klik tombol upload di bawah.
      </p>
      <Button
        onClick={onUploadClick}
        size="lg"
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover-lift"
        disabled={disabled}
      >
        <Upload className="h-5 w-5 mr-2" />
        Upload File Pertama (Maks 3)
      </Button>
    </div>
  )
}
