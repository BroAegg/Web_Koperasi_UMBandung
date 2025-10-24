'use client'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface FiltersType {
  search: string
  type: 'CASH_IN' | 'CASH_OUT' | 'TRANSFER' | 'ADJUSTMENT' | undefined
  category:
    | 'SALES'
    | 'PURCHASE'
    | 'OPERATIONAL'
    | 'MEMBER_DEPOSIT'
    | 'MEMBER_WITHDRAWAL'
    | 'OTHER'
    | undefined
  page: number
  limit: number
}

interface TransactionFiltersProps {
  filters: FiltersType
  onFilterChange: (filters: FiltersType) => void
}

export function TransactionFilters({ filters, onFilterChange }: TransactionFiltersProps) {
  const handleReset = () => {
    onFilterChange({
      search: '',
      type: undefined,
      category: undefined,
      page: 1,
      limit: 10,
    })
  }

  const hasActiveFilters = filters.search || filters.type || filters.category

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {/* Search */}
      <div className="md:col-span-2">
        <Input
          placeholder="Search transactions..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value, page: 1 })}
        />
      </div>

      {/* Type Filter */}
      <Select
        value={filters.type || 'all'}
        onValueChange={(value) =>
          onFilterChange({
            ...filters,
            type: value === 'all' ? undefined : (value as FiltersType['type']),
            page: 1,
          })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="CASH_IN">Cash In</SelectItem>
          <SelectItem value="CASH_OUT">Cash Out</SelectItem>
          <SelectItem value="TRANSFER">Transfer</SelectItem>
          <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
        </SelectContent>
      </Select>

      {/* Category Filter */}
      <Select
        value={filters.category || 'all'}
        onValueChange={(value) =>
          onFilterChange({
            ...filters,
            category: value === 'all' ? undefined : (value as FiltersType['category']),
            page: 1,
          })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="SALES">Sales</SelectItem>
          <SelectItem value="PURCHASE">Purchase</SelectItem>
          <SelectItem value="OPERATIONAL">Operational</SelectItem>
          <SelectItem value="MEMBER_DEPOSIT">Member Deposit</SelectItem>
          <SelectItem value="MEMBER_WITHDRAWAL">Member Withdrawal</SelectItem>
          <SelectItem value="OTHER">Other</SelectItem>
        </SelectContent>
      </Select>

      {/* Reset Button */}
      {hasActiveFilters && (
        <div className="flex justify-end md:col-span-4">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
