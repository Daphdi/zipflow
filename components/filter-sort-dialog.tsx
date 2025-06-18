"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Filter, SortAsc, RotateCcw } from "lucide-react"

interface FilterSortDialogProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilter: (filters: FilterOptions) => void
  onApplySort: (sort: SortOptions) => void
}

export interface FilterOptions {
  categories: string[]
  sizeRange: [number, number]
  dateRange: string
  favorites: boolean | null
}

export interface SortOptions {
  field: string
  direction: "asc" | "desc"
}

export function FilterSortDialog({ isOpen, onClose, onApplyFilter, onApplySort }: FilterSortDialogProps) {
  const [activeTab, setActiveTab] = useState<"filter" | "sort">("filter")
  const [categories, setCategories] = useState<string[]>([])
  const [sizeRange, setSizeRange] = useState<[number, number]>([0, 100])
  const [dateRange, setDateRange] = useState<string>("all")
  const [favorites, setFavorites] = useState<boolean | null>(null)
  const [sortField, setSortField] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const categoryOptions = [
    { value: "document", label: "📄 Dokumen" },
    { value: "image", label: "🖼️ Gambar" },
    { value: "video", label: "🎥 Video" },
    { value: "other", label: "📁 Lainnya" },
  ]

  const dateOptions = [
    { value: "all", label: "Semua Waktu" },
    { value: "today", label: "Hari Ini" },
    { value: "week", label: "Minggu Ini" },
    { value: "month", label: "Bulan Ini" },
    { value: "year", label: "Tahun Ini" },
  ]

  const sortOptions = [
    { value: "name", label: "Nama File" },
    { value: "size", label: "Ukuran File" },
    { value: "createdAt", label: "Tanggal Dibuat" },
    { value: "modifiedAt", label: "Tanggal Dimodifikasi" },
  ]

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setCategories([...categories, category])
    } else {
      setCategories(categories.filter((c) => c !== category))
    }
  }

  const handleApply = () => {
    if (activeTab === "filter") {
      onApplyFilter({
        categories,
        sizeRange,
        dateRange,
        favorites,
      })
    } else {
      onApplySort({
        field: sortField,
        direction: sortDirection,
      })
    }
    onClose()
  }

  const handleReset = () => {
    setCategories([])
    setSizeRange([0, 100])
    setDateRange("all")
    setFavorites(null)
    setSortField("name")
    setSortDirection("asc")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="card-modern max-w-md border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="bg-gradient-to-br from-purple-400 to-pink-600 p-3 rounded-xl">
              {activeTab === "filter" ? (
                <Filter className="h-6 w-6 text-white" />
              ) : (
                <SortAsc className="h-6 w-6 text-white" />
              )}
            </div>
            {activeTab === "filter" ? "Filter File" : "Urutkan File"}
          </DialogTitle>
          <DialogDescription className="text-lg">
            {activeTab === "filter" ? "Saring file berdasarkan kriteria tertentu" : "Atur urutan tampilan file"}
          </DialogDescription>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <Button
            variant={activeTab === "filter" ? "default" : "ghost"}
            onClick={() => setActiveTab("filter")}
            className="flex-1 h-10"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button
            variant={activeTab === "sort" ? "default" : "ghost"}
            onClick={() => setActiveTab("sort")}
            className="flex-1 h-10"
          >
            <SortAsc className="h-4 w-4 mr-2" />
            Urutkan
          </Button>
        </div>

        <div className="space-y-6">
          {activeTab === "filter" ? (
            <>
              {/* Category Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-bold text-gray-700">Kategori File</Label>
                <div className="space-y-3">
                  {categoryOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3">
                      <Checkbox
                        id={option.value}
                        checked={categories.includes(option.value)}
                        onCheckedChange={(checked) => handleCategoryChange(option.value, checked as boolean)}
                      />
                      <Label htmlFor={option.value} className="text-sm font-medium">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size Range Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-bold text-gray-700">Ukuran File (MB)</Label>
                <div className="px-3">
                  <Slider
                    value={sizeRange}
                    onValueChange={(value) => setSizeRange(value as [number, number])}
                    max={100}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{sizeRange[0]} MB</span>
                    <span>{sizeRange[1]} MB</span>
                  </div>
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-bold text-gray-700">Rentang Waktu</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dateOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Favorites Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-bold text-gray-700">Status Favorit</Label>
                <Select
                  value={favorites === null ? "all" : favorites.toString()}
                  onValueChange={(value) => setFavorites(value === "all" ? null : value === "true")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua File</SelectItem>
                    <SelectItem value="true">Hanya Favorit</SelectItem>
                    <SelectItem value="false">Bukan Favorit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <>
              {/* Sort Field */}
              <div className="space-y-3">
                <Label className="text-sm font-bold text-gray-700">Urutkan Berdasarkan</Label>
                <Select value={sortField} onValueChange={setSortField}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Direction */}
              <div className="space-y-3">
                <Label className="text-sm font-bold text-gray-700">Arah Urutan</Label>
                <Select value={sortDirection} onValueChange={(value) => setSortDirection(value as "asc" | "desc")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Naik (A-Z, Kecil-Besar)</SelectItem>
                    <SelectItem value="desc">Turun (Z-A, Besar-Kecil)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-3 pt-6">
          <Button variant="outline" onClick={handleReset} className="flex items-center gap-2 hover-lift">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button variant="outline" onClick={onClose} className="hover-lift">
            Batal
          </Button>
          <Button onClick={handleApply} className="btn-primary text-white border-0 hover-lift">
            Terapkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
