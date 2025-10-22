import React from 'react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, Filter, Download } from 'lucide-react'

interface FilterBarProps {
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  filters?: Array<{
    label: string
    value: string
    options: Array<{ value: string; label: string }>
    onChange: (value: string) => void
  }>
  actions?: React.ReactNode
  onExport?: () => void
}

export function FilterBar({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = [],
  actions,
  onExport,
}: FilterBarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
      {/* Search */}
      {onSearchChange && (
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* Filters */}
      {filters.map((filter, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <label className="text-sm font-medium text-gray-700">{filter.label}:</label>
          <Select value={filter.value} onChange={(e) => filter.onChange(e.target.value)}>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      ))}

      {/* Actions */}
      {actions}

      {/* Export */}
      {onExport && (
        <Button variant="outline" onClick={onExport} className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      )}
    </div>
  )
}
