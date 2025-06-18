"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ExternalLink, FileText, FileImage, FileVideo, FileAudio, FileSpreadsheet, Loader2 } from "lucide-react"
import type { FileItem } from "@/components/file-manager"

interface FilePreviewProps {
  file: FileItem
  onExternalPreview?: () => void
  className?: string
}

export function FilePreview({ file, onExternalPreview, className = "" }: FilePreviewProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [previewError, setPreviewError] = useState(false)

  const getFileIcon = useCallback(() => {
    const mimeType = file.mimeType?.toLowerCase() || ''
    
    if (mimeType.startsWith('image/')) {
      return <FileImage className="w-16 h-16 text-blue-500" />
    }
    if (mimeType.startsWith('video/')) {
      return <FileVideo className="w-16 h-16 text-purple-500" />
    }
    if (mimeType.startsWith('audio/')) {
      return <FileAudio className="w-16 h-16 text-green-500" />
    }
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType.includes('csv')) {
      return <FileSpreadsheet className="w-16 h-16 text-green-600" />
    }
    return <FileText className="w-16 h-16 text-gray-500" />
  }, [file.mimeType])

  const renderPreview = () => {
    if (file.mimeType?.startsWith('image/')) {
      return (
        <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
          {!isImageLoaded && !previewError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          )}
          <Image
            src={file.url || "/placeholder.svg"}
            alt={file.name}
            fill
            className="object-contain"
            unoptimized
            onLoad={() => {
              setIsImageLoaded(true)
              setPreviewError(false)
            }}
            onError={() => {
              setPreviewError(true)
              setIsImageLoaded(false)
            }}
          />
          {onExternalPreview && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onExternalPreview}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white shadow-lg z-10"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Buka Penuh
            </Button>
          )}
        </div>
      )
    }

    if (file.mimeType?.startsWith('video/')) {
      return (
        <div className="w-full h-full flex items-center justify-center p-8">
          <video
            src={file.url}
            controls
            className="max-w-full max-h-full rounded-2xl shadow-2xl ring-4 ring-white"
            preload="metadata"
          />
        </div>
      )
    }

    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-white/80 p-8 rounded-3xl mb-6 shadow-lg">{getFileIcon()}</div>
        <h3 className="text-2xl font-bold text-gray-700 flex-1 break-all">{file.name}</h3>
        <p className="text-gray-500 mb-6">Preview tidak tersedia untuk jenis file ini</p>
        {onExternalPreview && (
          <Button variant="outline" onClick={onExternalPreview} className="hover-lift">
            <ExternalLink className="h-4 w-4 mr-2" />
            Buka di Tab Baru
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {renderPreview()}
    </div>
  )
} 