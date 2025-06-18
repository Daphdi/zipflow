import type { FileItem, StorageStats } from "./types"

export const uploadFile = async (file: File): Promise<FileItem> => {
  // Simulasi upload - dalam implementasi nyata, ini akan upload ke cloud storage
  return new Promise((resolve) => {
    setTimeout(() => {
      const fileItem: FileItem = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file), // Dalam implementasi nyata, ini akan URL dari cloud storage
        uploadedAt: new Date().toISOString(),
        isFavorite: false,
      }

      // Simpan ke localStorage
      const files = JSON.parse(localStorage.getItem("userFiles") || "[]")
      files.push(fileItem)
      localStorage.setItem("userFiles", JSON.stringify(files))

      resolve(fileItem)
    }, 1000) // Simulasi delay upload
  })
}

export const getFiles = async (): Promise<FileItem[]> => {
  // Simulasi fetch files
  return new Promise((resolve) => {
    setTimeout(() => {
      const files = JSON.parse(localStorage.getItem("userFiles") || "[]")
      resolve(files)
    }, 500)
  })
}

export const getFavoriteFiles = async (): Promise<FileItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const files = JSON.parse(localStorage.getItem("userFiles") || "[]")
      const favoriteFiles = files.filter((file: FileItem) => file.isFavorite)
      resolve(favoriteFiles)
    }, 500)
  })
}

export const deleteFile = async (fileId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const files = JSON.parse(localStorage.getItem("userFiles") || "[]")
      const updatedFiles = files.filter((file: FileItem) => file.id !== fileId)
      localStorage.setItem("userFiles", JSON.stringify(updatedFiles))
      resolve()
    }, 500)
  })
}

export const toggleFavorite = async (fileId: string): Promise<{ isFavorite: boolean }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const files = JSON.parse(localStorage.getItem("userFiles") || "[]")
      const updatedFiles = files.map((file: FileItem) => {
        if (file.id === fileId) {
          return { ...file, isFavorite: !file.isFavorite }
        }
        return file
      })
      localStorage.setItem("userFiles", JSON.stringify(updatedFiles))

      const updatedFile = updatedFiles.find((file: FileItem) => file.id === fileId)
      resolve({ isFavorite: updatedFile.isFavorite })
    }, 500)
  })
}

export const getStorageStats = async (): Promise<StorageStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const files = JSON.parse(localStorage.getItem("userFiles") || "[]")

      const totalUsed = files.reduce((acc: number, file: FileItem) => acc + file.size, 0)
      const totalStorage = 15 * 1024 * 1024 * 1024 // 15 GB in bytes

      // Categorize files by type
      const fileTypes = [
        {
          type: "images",
          size: files
            .filter((f: FileItem) => f.type.startsWith("image/"))
            .reduce((acc: number, f: FileItem) => acc + f.size, 0),
          count: files.filter((f: FileItem) => f.type.startsWith("image/")).length,
        },
        {
          type: "videos",
          size: files
            .filter((f: FileItem) => f.type.startsWith("video/"))
            .reduce((acc: number, f: FileItem) => acc + f.size, 0),
          count: files.filter((f: FileItem) => f.type.startsWith("video/")).length,
        },
        {
          type: "documents",
          size: files
            .filter((f: FileItem) => f.type.includes("pdf") || f.type.includes("doc") || f.type.includes("txt"))
            .reduce((acc: number, f: FileItem) => acc + f.size, 0),
          count: files.filter(
            (f: FileItem) => f.type.includes("pdf") || f.type.includes("doc") || f.type.includes("txt"),
          ).length,
        },
        {
          type: "audio",
          size: files
            .filter((f: FileItem) => f.type.startsWith("audio/"))
            .reduce((acc: number, f: FileItem) => acc + f.size, 0),
          count: files.filter((f: FileItem) => f.type.startsWith("audio/")).length,
        },
      ]

      resolve({
        used: totalUsed,
        total: totalStorage,
        fileTypes: fileTypes.filter((ft) => ft.count > 0),
      })
    }, 500)
  })
}
