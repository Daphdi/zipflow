"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { useFileManager } from "@/components/file-manager"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams } from "next/navigation"
import type { FileItem } from "@/components/file-manager"
import { UploadDialog } from "@/components/upload-dialog"
import { FilePreviewDialog } from "@/components/files/file-preview-dialog"
import { FilesHeader } from "@/components/files/files-header"
import { FilesSearch } from "@/components/files/files-search"
import { FileCard } from "@/components/files/file-card"
import { FileListItem } from "@/components/files/file-list-item"
import { EmptyState } from "@/components/files/empty-state"
import { Button } from "@/components/ui/button"
import { FilesIcon } from "@/components/icons/files-icon"

const MAX_FILES = 3
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const FILE_TYPES = {
  all: 'all',
  images: 'image',
  documents: 'document',
  videos: 'video',
  audio: 'audio',
  spreadsheets: 'spreadsheet',
} as const;

type FileType = 'all' | 'image' | 'document' | 'video' | 'audio' | 'spreadsheet';

export default function FilesPage() {
  const { files, deleteFile, toggleFavorite, searchFiles } = useFileManager()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedFileType, setSelectedFileType] = useState<FileType>(FILE_TYPES.all)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadInProgress, setUploadInProgress] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const highlightId = searchParams.get("highlight")
  const initialType = searchParams.get("type")
  const fileRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const [hasSetInitialType, setHasSetInitialType] = useState(false)

  // Handle URL parameters
  useEffect(() => {
    if (searchParams.get("upload") === "true") {
      handleUploadClick()
    }
    if (searchParams.get("search") === "true") {
      document.getElementById("search-input")?.focus()
    }
  }, [searchParams])

  useEffect(() => {
    if (!hasSetInitialType) {
      if (initialType && Object.values(FILE_TYPES).includes(initialType as FileType)) {
        setSelectedFileType(initialType as FileType)
      } else if (initialType) {
        setSelectedFileType(FILE_TYPES.all)
      }
      setHasSetInitialType(true)
    }
    // eslint-disable-next-line
  }, [initialType])

  const getFileType = (mimeType: string | null | undefined): FileType => {
    if (!mimeType) return FILE_TYPES.all;
    
    const type = mimeType.toLowerCase();
    if (type.startsWith('image/')) return FILE_TYPES.images;
    if (type.startsWith('video/')) return FILE_TYPES.videos;
    if (type.startsWith('audio/')) return FILE_TYPES.audio;
    if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv')) return FILE_TYPES.spreadsheets;
    if (type.includes('pdf') || type.includes('word') || type.includes('text')) return FILE_TYPES.documents;
    return FILE_TYPES.all;
  }

  // Combine search and type filtering
  const filteredFiles = useMemo(() => {
    console.log('Filtering files with query:', searchQuery);
    console.log('Selected file type:', selectedFileType);
    
    const searchResults = searchFiles(searchQuery);
    console.log('Search results before type filter:', searchResults);
    
    if (selectedFileType === FILE_TYPES.all) {
      console.log('No type filter, returning all search results');
      return searchResults;
    }
    
    const typeFiltered = searchResults.filter(file => getFileType(file.mimeType) === selectedFileType);
    console.log('Results after type filter:', typeFiltered);
    
    // Show notification if no results found
    if (searchQuery && typeFiltered.length === 0) {
      let kategori = '';
      if (['image', 'document', 'video', 'audio', 'spreadsheet'].includes(selectedFileType)) {
        kategori = ` dalam kategori ${selectedFileType}`;
      }
      toast({
        title: "Tidak ada hasil",
        description: `Tidak ditemukan file yang cocok dengan "${searchQuery}"${kategori}`,
        variant: "default",
      });
    }
    
    return typeFiltered;
  }, [files, searchQuery, selectedFileType, searchFiles, toast]);

  // Reset file input whenever dialogs close
  useEffect(() => {
    if (!showUploadDialog && !showPreviewDialog && fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [showUploadDialog, showPreviewDialog])

  // Handle file input change with better state control
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log("File input changed", event.target.files)
      if (isProcessing) return;
      const fileList = event.target.files;
      if (!fileList || fileList.length === 0) return;
      const newFiles = Array.from(fileList);
      const oversizedFiles = newFiles.filter(file => file.size > MAX_FILE_SIZE);
      if (oversizedFiles.length > 0) {
        toast({
          title: "File Terlalu Besar",
          description: `Ukuran file maksimal 100MB. File berikut terlalu besar: ${oversizedFiles.map(f => f.name).join(", ")}`,
          variant: "destructive",
        });
      }
      const validFiles = newFiles.filter(file => file.size <= MAX_FILE_SIZE);
      if (validFiles.length === 0) return;
      setSelectedFiles(prev => {
        // Gabungkan file lama dan baru, filter duplikat berdasarkan nama & ukuran
        const combined = [...prev, ...validFiles].filter((file, idx, arr) =>
          arr.findIndex(f => f.name === file.name && f.size === file.size) === idx
        ).slice(0, MAX_FILES);
        // Reset input hanya setelah state benar-benar ter-update
        setTimeout(() => {
          if (fileInputRef.current) fileInputRef.current.value = "";
        }, 0);
        return combined;
      });
      setShowUploadDialog(true);
      setUploadInProgress(true);
    },
    [isProcessing, toast],
  );

  // Handle upload button click with better controls
  const handleUploadClick = useCallback(() => {
    console.log("Upload button clicked")

    if (isProcessing || uploadInProgress || showUploadDialog || showPreviewDialog) {
      console.log("Ignoring upload click - dialogs open or processing")
      return
    }

    if (fileInputRef.current) {
      // Ensure input is clean before clicking
      fileInputRef.current.value = ""
      fileInputRef.current.click()
    }
  }, [isProcessing, uploadInProgress, showUploadDialog, showPreviewDialog])

  // Handle adding more files with proper state checks
  const handleAddMoreFiles = useCallback(() => {
    console.log("Add more files clicked")
    if (isProcessing) {
      console.log("Processing in progress, ignoring add more files")
      return
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  }, [isProcessing]);

  // Handle removing file from selection
  const handleRemoveFile = useCallback((index: number) => {
    console.log(`Removing file at index ${index}`)

    setSelectedFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index)
      if (newFiles.length === 0) {
        setShowUploadDialog(false)
      }
      return newFiles
    })
  }, [])

  // Handle closing upload dialog with complete state reset
  const handleCloseUploadDialog = useCallback(() => {
    console.log("Closing upload dialog")

    setIsProcessing(false)
    setUploadInProgress(false)
    setShowUploadDialog(false)
    setSelectedFiles([])

    // Ensure input is completely reset
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
      fileInputRef.current.blur()
    }
  }, [])

  // Handle upload completion with proper state management
  const handleUploadComplete = useCallback(() => {
    console.log("Upload completed")

    setIsProcessing(false)
    setSelectedFiles([])

    // Close dialog after a short delay
    setTimeout(() => {
      setUploadInProgress(false)
      setShowUploadDialog(false)

      // Complete reset of input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
        fileInputRef.current.blur()
      }
    }, 2000)
  }, [])

  // Handle file download
  const handleDownload = async (file: FileItem) => {
    try {
      if (!file.url) {
        throw new Error('File URL is undefined');
      }
      
      const response = await fetch(file.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download error:', error)
      toast({
        title: "Download Failed",
        description: "Failed to download the file",
        variant: "destructive",
      })
    }
  }

  // Handle file preview with proper event handling
  const handlePreview = useCallback(
    (file: FileItem, event?: React.MouseEvent) => {
      console.log(`Previewing file: ${file.name}`)

      if (event) {
        event.preventDefault()
        event.stopPropagation()
      }

      if (isProcessing || showUploadDialog) {
        console.log("Ignoring preview - processing or upload dialog open")
        return
      }

      setPreviewFile(file)
      setShowPreviewDialog(true)
    },
    [isProcessing, showUploadDialog],
  )

  // Handle file deletion
  const handleDelete = useCallback(
    (file: FileItem) => {
      console.log(`Deleting file: ${file.name}`)

      deleteFile(file.id)
      setShowPreviewDialog(false)
      setPreviewFile(null)

      toast({
        title: "🗑️ File Dihapus",
        description: `${file.name} telah dihapus`,
        className: "notification-info text-white border-0",
      })
    },
    [deleteFile, toast],
  )

  // Handle toggle favorite
  const handleToggleFavorite = useCallback(
    (file: FileItem) => {
      console.log(`Toggling favorite for file: ${file.name}`)

      toggleFavorite(file.id)
      const isFavorite = !file.isFavorite

      toast({
        title: isFavorite ? "❤️ Ditambahkan ke Favorit" : "💔 Dihapus dari Favorit",
        description: `${file.name} ${isFavorite ? "ditambahkan ke" : "dihapus dari"} favorit`,
        className: "notification-info text-white border-0",
      })
    },
    [toggleFavorite, toast],
  )

  // Handle closing preview dialog
  const handleClosePreviewDialog = useCallback(() => {
    console.log("Closing preview dialog")
    setShowPreviewDialog(false)
    setPreviewFile(null)
  }, [])

  useEffect(() => {
    if (highlightId && fileRefs.current[highlightId]) {
      fileRefs.current[highlightId]?.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [highlightId, filteredFiles])

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Files</h1>
        <Button onClick={() => setShowUploadDialog(true)}>
          Upload File
        </Button>
      </div>

      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        <Button
          variant={selectedFileType === FILE_TYPES.all ? "default" : "outline"}
          onClick={() => setSelectedFileType(FILE_TYPES.all)}
        >
          All Files
        </Button>
        <Button
          variant={selectedFileType === FILE_TYPES.images ? "default" : "outline"}
          onClick={() => setSelectedFileType(FILE_TYPES.images)}
        >
          Images
        </Button>
        <Button
          variant={selectedFileType === FILE_TYPES.documents ? "default" : "outline"}
          onClick={() => setSelectedFileType(FILE_TYPES.documents)}
        >
          Documents
        </Button>
        <Button
          variant={selectedFileType === FILE_TYPES.videos ? "default" : "outline"}
          onClick={() => setSelectedFileType(FILE_TYPES.videos)}
        >
          Videos
        </Button>
        <Button
          variant={selectedFileType === FILE_TYPES.audio ? "default" : "outline"}
          onClick={() => setSelectedFileType(FILE_TYPES.audio)}
        >
          Audio
        </Button>
        <Button
          variant={selectedFileType === FILE_TYPES.spreadsheets ? "default" : "outline"}
          onClick={() => setSelectedFileType(FILE_TYPES.spreadsheets)}
        >
          Spreadsheets
        </Button>
      </div>

      {filteredFiles.length === 0 ? (
        <EmptyState
          searchQuery={searchQuery}
          onUploadClick={handleUploadClick}
          disabled={isProcessing || showUploadDialog || showPreviewDialog}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map((file, index) => (
            <div
              key={file.id}
              ref={el => {
                fileRefs.current[file.id] = el;
                return undefined;
              }}
              className={
                highlightId === file.id
                  ? "ring-4 ring-blue-400 rounded-xl transition-all duration-500"
                  : ""
              }
            >
              <FileListItem
                file={file}
                onPreview={handlePreview}
                onDownload={handleDownload}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
                index={index}
              />
            </div>
          ))}
        </div>
      )}

      {/* Hidden File Input with strict controls */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="*/*"
        className="hidden"
        style={{
          display: "none !important",
          position: "absolute",
          left: "-9999px",
          opacity: 0,
          pointerEvents: "none",
        }}
        onChange={handleFileSelect}
        disabled={isProcessing}
      />

      {/* Upload Dialog */}
      <UploadDialog
        key={selectedFiles.map(f => f.name + f.size).join("-")}
        isOpen={showUploadDialog}
        onClose={handleCloseUploadDialog}
        selectedFiles={selectedFiles}
        onAddMoreFiles={handleAddMoreFiles}
        onRemoveFile={handleRemoveFile}
        onUploadStart={() => setIsProcessing(true)}
        onUploadComplete={handleUploadComplete}
        maxFiles={MAX_FILES}
      />

      {/* Preview Dialog */}
      <FilePreviewDialog
        isOpen={showPreviewDialog}
        onClose={handleClosePreviewDialog}
        file={previewFile}
        onDownload={handleDownload}
        onToggleFavorite={handleToggleFavorite}
        onDelete={handleDelete}
      />
    </div>
  )
}
