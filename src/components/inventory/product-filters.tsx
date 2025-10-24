'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X } from 'lucide-react'

interface FiltersType {
  search?: string
  category_id?: string
  supplier_id?: string
  is_active?: boolean
  low_stock?: boolean
  page: number
  limit: number
}

interface ProductFiltersProps {
  filters: FiltersType
  onFilterChange: (filters: FiltersType) => void
}

export function ProductFilters({ filters, onFilterChange }: ProductFiltersProps) {
  const hasActiveFilters = filters.search || filters.category_id || filters.low_stock

  const handleClearFilters = () => {
    onFilterChange({
      page: 1,
      limit: filters.limit,
    })
  }

  // Hardcoded categories for now (same as form)
  const categories = [
    { id: '1', name: 'Makanan' },
    { id: '2', name: 'Minuman' },
    { id: '3', name: 'Snack' },
    { id: '4', name: 'Keperluan Rumah' },
    { id: '5', name: 'Alat Tulis' },
    { id: '6', name: 'Lainnya' },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {/* Search */}
      <div className="relative md:col-span-2">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Cari nama atau SKU produk..."
          value={filters.search || ''}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value, page: 1 })}
          className="pl-9"
        />
      </div>

      {/* Category Filter */}
      <Select
        value={filters.category_id || 'all'}
        onValueChange={(value) =>
          onFilterChange({
            ...filters,
            category_id: value === 'all' ? undefined : value,
            page: 1,
          })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Semua Kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Kategori</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Low Stock Filter */}
      <Select
        value={filters.low_stock ? 'low' : 'all'}
        onValueChange={(value) =>
          onFilterChange({
            ...filters,
            low_stock: value === 'low' ? true : undefined,
            page: 1,
          })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Semua Stok" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Stok</SelectItem>
          <SelectItem value="low">Stok Rendah</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="ghost" onClick={handleClearFilters} className="md:col-span-4">
          <X className="mr-2 h-4 w-4" />
          Hapus Filter
        </Button>
      )}
    </div>
  )
}
