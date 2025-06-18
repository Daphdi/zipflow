"use client"

import { Button } from "@/components/ui/button"
import { Upload, Grid3X3, List, Filter } from "lucide-react"
import { FilterSortDialog } from "@/components/filter-sort-dialog"
import { useState } from "react"

interface FilesHeaderProps {
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  onUploadClick: () => void
  disabled?: boolean
}

export function FilesHeader({ viewMode, onViewModeChange, onUploadClick, disabled = false }: FilesHeaderProps) {
  const [showFilterDialog, setShowFilterDialog] = useState(false)

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📁 Semua File
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Kelola dan atur semua file Anda dengan mudah</p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-white rounded-lg border shadow-sm p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className="h-8 px-3"
              disabled={disabled}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("list")}
              className="h-8 px-3"
              disabled={disabled}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Filter Button */}
          <Button
            variant="outline"
            onClick={() => setShowFilterDialog(true)}
            className="hover-lift"
            disabled={disabled}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>

          {/* Upload Button */}
          <Button
            onClick={onUploadClick}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover-lift"
            disabled={disabled}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload File
          </Button>
        </div>
      </div>

      <FilterSortDialog 
        isOpen={showFilterDialog} 
        onClose={() => setShowFilterDialog(false)} 
        onApplyFilter={() => {}} 
        onApplySort={() => {}} 
      />
    </>
  )
}
