import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, X, Star, Trash2, FileText, FileSpreadsheet, FileImage, FileVideo, FileAudio } from "lucide-react"
import Image from "next/image"
import type { FileItem } from "@/components/file-manager"

interface FilePreviewDialogProps {
  file: FileItem | null
  isOpen: boolean
  onClose: () => void
  onDownload: (file: FileItem) => void
  onToggleFavorite: (file: FileItem) => void
  onDelete: (file: FileItem) => void
}

export function FilePreviewDialog({
  file,
  isOpen,
  onClose,
  onDownload,
  onToggleFavorite,
  onDelete,
}: FilePreviewDialogProps) {
  const getFileIcon = () => {
    if (!file) return null;

    const mimeType = file.mimeType?.toLowerCase() || '';
    
    if (mimeType.startsWith('image/')) {
      return <FileImage className="w-16 h-16 text-blue-500" />;
    }
    if (mimeType.startsWith('video/')) {
      return <FileVideo className="w-16 h-16 text-purple-500" />;
    }
    if (mimeType.startsWith('audio/')) {
      return <FileAudio className="w-16 h-16 text-green-500" />;
    }
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType.includes('csv')) {
      return <FileSpreadsheet className="w-16 h-16 text-green-600" />;
    }
    return <FileText className="w-16 h-16 text-gray-500" />;
  }

  const renderPreview = () => {
    if (!file) return null;

    if (file.mimeType?.startsWith('image/')) {
      return (
        <div className="relative w-full h-[60vh] bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={file.url}
            alt={file.name}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      )
    }

    return (
      <div className="flex flex-col items-center justify-center h-[60vh] bg-gray-100 rounded-lg p-6">
        {getFileIcon()}
        <div className="text-center mt-4">
          <p className="text-lg font-medium mb-2">{file.name}</p>
          <p className="text-sm text-gray-500 mb-4">
            {file.mimeType || 'Unknown file type'}
          </p>
          <p className="text-sm text-gray-500">
            {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Size unknown'}
          </p>
        </div>
      </div>
    )
  }

  if (!file) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold">
            {file.name}
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onToggleFavorite(file)}
            >
              <Star className={`h-4 w-4 ${file.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDownload(file)}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDelete(file)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        {renderPreview()}
      </DialogContent>
    </Dialog>
  )
} 