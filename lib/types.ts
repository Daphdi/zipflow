export interface FileItem {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: string
  isFavorite?: boolean
}

export interface User {
  id: string
  name: string
  email: string
}

export interface StorageStats {
  used: number
  total: number
  fileTypes: {
    type: string
    size: number
    count: number
  }[]
}
