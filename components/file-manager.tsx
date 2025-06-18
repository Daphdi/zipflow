"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import type { FileItem } from "./types"

export interface FileItem {
  id: string
  name: string
  type: "file" | "folder"
  mimeType?: string
  size: number
  createdAt: string
  modifiedAt: string
  isFavorite: boolean
  url?: string
  thumbnail?: string
  category: "document" | "image" | "video" | "other" | "spreadsheet" | "audio"
}

interface FileManagerContextType {
  files: FileItem[]
  uploadFile: (file: File) => Promise<void>
  deleteFile: (id: string) => Promise<void>
  toggleFavorite: (id: string) => void
  searchFiles: (query: string) => FileItem[]
  getFilesByCategory: (category: string) => FileItem[]
  getTotalSize: () => number
  getStorageUsed: () => { used: number; total: number; percentage: number }
}

const FileManagerContext = createContext<FileManagerContextType | undefined>(undefined)

const STORAGE_KEY = "zipflow-files"
const MAX_STORAGE_SIZE = 5 * 1024 * 1024 * 1024 // 5GB in bytes

export function FileManagerProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<FileItem[]>([])
  const { toast } = useToast()
  const { data: session } = useSession()
  console.log('DEBUG CLIENT SESSION:', session);

  useEffect(() => {
    const loadFiles = async () => {
      if (!session?.user) return;

      try {
        const response = await fetch('/api/files');
        if (!response.ok) {
          throw new Error('Failed to fetch files');
        }
        const data = await response.json();
        const formattedFiles = data.map((file: any) => {
          const mimeType = file.type || 'application/octet-stream';
          const dataUrl = `data:${mimeType};base64,${file.content}`;
          
          return {
            id: file.id,
            name: file.name,
            type: "file",
            mimeType: mimeType,
            size: file.size,
            createdAt: file.created_at,
            modifiedAt: file.created_at,
            isFavorite: false,
            url: dataUrl,
            thumbnail: mimeType.startsWith('image/') ? dataUrl : undefined,
            category: getFileCategory(mimeType),
          };
        });
        setFiles(formattedFiles);
      } catch (error) {
        console.error('Error loading files:', error);
        toast({
          title: "Error",
          description: "Failed to load saved files",
          variant: "destructive",
        });
      }
    };
    loadFiles();
  }, [session, toast]);

  const getFileCategory = (mimeType: string): FileItem["category"] => {
    if (mimeType.startsWith("image/")) return "image"
    if (mimeType.startsWith("video/")) return "video"
    if (mimeType.startsWith("audio/")) return "audio"
    if (
      mimeType.includes("spreadsheet") ||
      mimeType.includes("excel") ||
      mimeType.includes("csv")
    )
      return "spreadsheet"
    if (
      mimeType.includes("document") ||
      mimeType.includes("pdf") ||
      mimeType.includes("text") ||
      mimeType.includes("presentation")
    )
      return "document"
    return "other"
  }

  const uploadFile = async (file: File): Promise<FileItem> => {
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please login to upload files",
        variant: "destructive",
      });
      throw new Error('User must be logged in to upload files');
    }
    try {
      const MAX_FILE_SIZE = 100 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File size exceeds the maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      }
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error('Invalid response from server');
      }
      if (!response.ok) {
        const errorMsg = data?.details || data?.error || 'Upload failed';
        toast({
          title: "Upload Failed",
          description: errorMsg,
          variant: "destructive",
        });
        throw new Error(errorMsg);
      }
      if (!data.file) {
        toast({
          title: "Upload Failed",
          description: "Invalid response from server (no file)",
          variant: "destructive",
        });
        throw new Error('Invalid response from server');
      }
      // Pastikan content selalu ada
      const mimeType = file.type || 'application/octet-stream';
      const dataUrl = `data:${mimeType};base64,${data.file.content}`;
      const fileItem: FileItem = {
        id: data.file.id,
        name: data.file.name,
        type: "file",
        mimeType: mimeType,
        size: data.file.size,
        createdAt: data.file.created_at,
        modifiedAt: data.file.created_at,
        isFavorite: false,
        url: dataUrl,
        thumbnail: mimeType.startsWith('image/') ? dataUrl : undefined,
        category: getFileCategory(mimeType),
      };
      setFiles((prev) => Array.isArray(prev) ? [...prev, fileItem] : [fileItem]);
      toast({
        title: "Upload Successful",
        description: `${file.name} has been uploaded successfully`,
      });
      return fileItem;
    } catch (error) {
      let errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteFile = async (id: string) => {
    if (!session?.user) {
      throw new Error('User must be logged in to delete files');
    }

    try {
      const response = await fetch(`/api/files?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      const file = files.find((f) => f.id === id);
      if (file?.url) {
        URL.revokeObjectURL(file.url);
      }
      if (file?.thumbnail) {
        URL.revokeObjectURL(file.thumbnail);
      }
      
      setFiles((prev) => prev.filter((f) => f.id !== id));

      toast({
        title: "File Deleted",
        description: `${file?.name} has been removed from ZipFlow`,
      });
    } catch (error) {
      console.error('File deletion error:', error);
      toast({
        title: "Deletion Failed",
        description: "An error occurred while deleting the file",
        variant: "destructive",
      });
      throw error;
    }
  };

  const toggleFavorite = (id: string) => {
    try {
      setFiles((prev) => prev.map((file) => (file.id === id ? { ...file, isFavorite: !file.isFavorite } : file)));

      const file = files.find((f) => f.id === id);
      const isFavorite = !file?.isFavorite;

      toast({
        title: isFavorite ? "Added to Favorites" : "Removed from Favorites",
        description: `${file?.name} has been ${isFavorite ? "added to" : "removed from"} favorites`,
      });
    } catch (error) {
      console.error('Favorite toggle error:', error);
      toast({
        title: "Operation Failed",
        description: "An error occurred while updating favorites",
        variant: "destructive",
      });
    }
  };

  const searchFiles = (query: string): FileItem[] => {
    console.log('Searching files with query:', query);
    console.log('Current files:', files);
    
    if (!query.trim()) {
      console.log('Empty query, returning all files');
      return files;
    }
    
    const searchTerm = query.toLowerCase();
    const results = files.filter((file) => {
      const matches = file.name.toLowerCase().includes(searchTerm);
      console.log(`File ${file.name} matches: ${matches}`);
      return matches;
    });
    
    console.log('Search results:', results);
    return results;
  };

  const getFilesByCategory = (category: string): FileItem[] => {
    switch (category) {
      case "documents":
        return Array.isArray(files) ? files.filter((file) => file.category === "document") : [];
      case "images":
        return Array.isArray(files) ? files.filter((file) => file.category === "image") : [];
      case "videos":
        return Array.isArray(files) ? files.filter((file) => file.category === "video") : [];
      case "audio":
        return Array.isArray(files) ? files.filter((file) => file.category === "audio") : [];
      case "archives":
        return Array.isArray(files) ? files.filter((file) => file.category === "archive") : [];
      case "favorites":
        return files.filter((file) => file.isFavorite);
      default:
        return [];
    }
  };

  const getTotalSize = (): number => {
    return Array.isArray(files) ? files.reduce((total, file) => total + file.size, 0) : 0;
  };

  const getStorageUsed = () => {
    const used = getTotalSize();
    const percentage = (used / MAX_STORAGE_SIZE) * 100;

    return { used, total: MAX_STORAGE_SIZE, percentage };
  };

  return (
    <FileManagerContext.Provider
      value={{
        files,
        uploadFile,
        deleteFile,
        toggleFavorite,
        searchFiles,
        getFilesByCategory,
        getTotalSize,
        getStorageUsed,
      }}
    >
      {children}
    </FileManagerContext.Provider>
  );
}

export function useFileManager() {
  const context = useContext(FileManagerContext)
  if (context === undefined) {
    throw new Error("useFileManager must be used within a FileManagerProvider")
  }
  return context
}
