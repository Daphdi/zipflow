"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { useFileManager } from "@/components/file-manager"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileText, ImageIcon, Video, Files, Check, Plus, X } from "lucide-react"

interface UploadDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedFiles: File[]
  onAddMoreFiles: () => void
  onRemoveFile?: (index: number) => void
  onUploadStart?: () => void
  onUploadComplete?: () => void
  maxFiles?: number
}

export function UploadDialog({
  isOpen,
  onClose,
  selectedFiles,
  onAddMoreFiles,
  onRemoveFile,
  onUploadStart,
  onUploadComplete,
  maxFiles = 3,
}: UploadDialogProps) {
  console.log('UploadDialog render, selectedFiles:', selectedFiles)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [uploadComplete, setUploadComplete] = useState(false)
  const { uploadFile } = useFileManager()
  const { toast } = useToast()

  // Add proper state for dialog management
  const [dialogState, setDialogState] = useState<"selecting" | "confirming" | "uploading" | "completed">("selecting")

  // Safe file array
  const fileArray = Array.isArray(selectedFiles) ? selectedFiles : []
  console.log('UploadDialog fileArray:', fileArray)

  // Reset states only when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      console.log("Upload dialog opened, resetting states")
      setIsUploading(false)
      setUploadProgress(0)
      setUploadedFiles([])
      setUploadComplete(false)
      setDialogState("confirming")
    } else {
      console.log("Upload dialog closed, resetting all states")
      setDialogState("selecting")
    }
  }, [isOpen])

  // Reset state when selectedFiles changes (while dialog is open)
  useEffect(() => {
    if (isOpen) {
      setIsUploading(false)
      setUploadProgress(0)
      setUploadedFiles([])
      setUploadComplete(false)
      setDialogState("confirming")
    }
  }, [selectedFiles, isOpen])

  // Handle upload completion
  useEffect(() => {
    if (uploadComplete && onUploadComplete) {
      console.log("Upload completed, calling onUploadComplete")
      onUploadComplete()
    }
  }, [uploadComplete, onUploadComplete])

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="h-5 w-5 text-green-600" />
    if (file.type.startsWith("video/")) return <Video className="h-5 w-5 text-red-600" />
    if (file.type.includes("document") || file.type.includes("pdf") || file.type.includes("text"))
      return <FileText className="h-5 w-5 text-blue-600" />
    return <Files className="h-5 w-5 text-gray-600" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const truncateFileName = (fileName: string, maxLength = 25) => {
    if (fileName.length <= maxLength) return fileName

    const extension = fileName.split(".").pop() || ""
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf("."))
    const truncatedName = nameWithoutExt.substring(0, maxLength - extension.length - 4) + "..."

    return truncatedName + "." + extension
  }

  // Update the upload handler
  const handleUpload = useCallback(async () => {
    if (!fileArray || fileArray.length === 0 || isUploading) {
      console.log("Cannot upload: no files or already uploading")
      return
    }

    console.log(`Starting upload of ${fileArray.length} files`)

    setIsUploading(true)
    setDialogState("uploading")
    setUploadProgress(0)
    setUploadedFiles([])
    setUploadComplete(false)

    if (onUploadStart) {
      onUploadStart()
    }

    try {
      const totalFiles = fileArray.length
      for (let i = 0; i < totalFiles; i++) {
        const file = fileArray[i]
        try {
          await uploadFile(file)
          setUploadedFiles((prev) => [...prev, file.name])
        } catch (err) {
          console.error(`Upload failed for file ${file.name}:`, err)
          toast({
            title: `Upload Gagal: ${file.name}`,
            description: err instanceof Error ? err.message : 'Unknown error',
            variant: "destructive",
            className: "notification-error text-white border-0",
          })
        }
        const progressStep = ((i + 1) / totalFiles) * 100
        setUploadProgress(progressStep)
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
      setUploadComplete(true)
      setDialogState("completed")
      setIsUploading(false)
    } catch (error) {
      console.error("Upload failed:", error)
      toast({
        title: "❌ Upload Gagal",
        description: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengupload file',
        variant: "destructive",
        className: "notification-error text-white border-0",
      })
      setIsUploading(false)
      setDialogState("confirming")
      setUploadComplete(false)
    }
  }, [fileArray, isUploading, uploadFile, toast, onUploadStart])

  // Fix the cancel handler
  const handleCancel = useCallback(() => {
    if (!isUploading) {
      console.log("Canceling upload dialog")
      setDialogState("selecting")
      onClose()
    }
  }, [isUploading, onClose])

  // Fix the add more files handler
  const handleAddMore = useCallback(() => {
    if (!isUploading && !uploadComplete && fileArray.length < maxFiles) {
      onAddMoreFiles()
    }
  }, [isUploading, uploadComplete, fileArray.length, maxFiles, onAddMoreFiles])

  const handleRemoveFile = useCallback(
    (index: number) => {
      if (!isUploading && !uploadComplete && onRemoveFile) {
        console.log(`Removing file at index ${index}`)
        onRemoveFile(index)
      }
    },
    [isUploading, uploadComplete, onRemoveFile],
  )

  const totalSize = fileArray.reduce((total, file) => total + file.size, 0)

  // Handle dialog close with proper state management
  const handleDialogClose = useCallback(
    (open: boolean) => {
      if (!open && !isUploading) {
        console.log("Dialog closed by user")
        setDialogState("selecting")
        onClose()
      }
    },
    [isUploading, onClose],
  )

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${uploadComplete ? "bg-green-100" : "bg-blue-100"}`}>
              {uploadComplete ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <Upload className="h-5 w-5 text-blue-600" />
              )}
            </div>
            {uploadComplete ? "Upload Selesai!" : isUploading ? "Mengupload File..." : "Konfirmasi Upload"}
          </DialogTitle>
          <DialogDescription>
            {uploadComplete
              ? "Semua file berhasil diupload ke ZipFlow"
              : isUploading
                ? "Mohon tunggu, file sedang diupload"
                : `Periksa file yang akan diupload (maksimal ${maxFiles} file)`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden space-y-4">
          {fileArray.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  File yang dipilih ({fileArray.length}/{maxFiles})
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Total: {formatFileSize(totalSize)}
                </span>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                {fileArray.map((file, index) => (
                  <div
                    key={`${file.name}-${file.size}-${index}`}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      uploadedFiles.includes(file.name) ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex-shrink-0">{getFileIcon(file)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900" title={file.name}>
                        {truncateFileName(file.name)}
                      </p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                    {onRemoveFile && !isUploading && !uploadComplete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-500 hover:bg-red-100"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {fileArray.length < maxFiles && !isUploading && !uploadComplete && (
                <Button onClick={handleAddMore} variant="outline" className="w-full mt-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah File (Maks {maxFiles})
                </Button>
              )}
            </div>
          )}

          {isUploading && (
            <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Progress Upload</span>
                <span className="font-bold text-blue-600">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-3" />
              <p className="text-xs text-gray-600 text-center">
                {uploadedFiles.length} dari {fileArray.length} file selesai
              </p>
            </div>
          )}

          {uploadComplete && (
            <div className="space-y-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Upload Berhasil!</span>
              </div>
              <p className="text-sm text-green-700 text-center">Semua {fileArray.length} file berhasil diupload</p>
              <p className="text-xs text-green-600 text-center">Dialog akan tertutup otomatis...</p>
            </div>
          )}

          {fileArray.length === 0 && !isUploading && !uploadComplete && (
            <div className="text-center py-8">
              <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Files className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">Belum ada file yang dipilih</p>
              <Button onClick={handleAddMore} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Pilih File (Maks {maxFiles})
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="flex-shrink-0 gap-2 pt-4 border-t">
          {uploadComplete ? (
            <Button onClick={onClose} className="w-full bg-green-600 hover:bg-green-700">
              <Check className="h-4 w-4 mr-2" />
              Selesai
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={isUploading}>
                {isUploading ? "Tunggu..." : "Batal"}
              </Button>
              <Button
                onClick={handleUpload}
                disabled={isUploading || fileArray.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload {fileArray.length} File
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
