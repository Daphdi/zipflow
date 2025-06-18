"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, SortAsc } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FilesSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onSearchResults?: (results: any[]) => void
}

export function FilesSearch({ searchQuery, onSearchChange, onSearchResults }: FilesSearchProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery)
  const { toast } = useToast()

  // Update local state when prop changes
  useEffect(() => {
    setLocalQuery(searchQuery)
  }, [searchQuery])

  // Debounced search
  const debouncedSearch = useCallback(
    (value: string) => {
      const timeoutId = setTimeout(() => {
        onSearchChange(value)
        // Notify parent component about search results
        if (onSearchResults) {
          onSearchResults([]) // Reset results while searching
        }
      }, 300) // 300ms delay

      return () => clearTimeout(timeoutId)
    },
    [onSearchChange, onSearchResults]
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalQuery(value)
    debouncedSearch(value)
  }

  return (
    <div className="flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          id="search-input"
          placeholder="🔍 Cari file..."
          value={localQuery}
          onChange={handleSearchChange}
          className="pl-12 h-12 text-lg border-2 border-gray-200 focus:border-sky-400 transition-all duration-300 hover-glow"
        />
      </div>
      <Button variant="outline" className="h-12 px-6 hover-lift flex items-center gap-2">
        <Filter className="h-5 w-5" />
        Filter
      </Button>
      <Button variant="outline" className="h-12 px-6 hover-lift flex items-center gap-2">
        <SortAsc className="h-5 w-5" />
        Urutkan
      </Button>
    </div>
  )
}
