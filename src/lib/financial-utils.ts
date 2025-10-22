/**
 * Financial Utilities
 * Helper functions for financial calculations and formatting
 */

/**
 * Format number as Indonesian Rupiah currency
 * @param amount - The amount to format
 * @param showPrefix - Whether to show "Rp" prefix
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(1500000) // "Rp 1.500.000"
 * formatCurrency(1500000, false) // "1.500.000"
 */
export function formatCurrency(amount: number, showPrefix: boolean = true): string {
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)

  return showPrefix ? `Rp ${formatted}` : formatted
}

/**
 * Calculate balance from transactions
 * @param transactions - Array of transactions with type and amount
 * @returns Calculated balance
 */
export function calculateBalance(transactions: Array<{ type: string; amount: number }>): number {
  return transactions.reduce((balance, tx) => {
    if (tx.type === 'CASH_IN') {
      return balance + tx.amount
    } else {
      return balance - tx.amount
    }
  }, 0)
}

/**
 * Generate chart data grouped by date
 * @param transactions - Array of transactions
 * @returns Chart data with daily aggregations
 */
export function generateChartData(
  transactions: Array<{
    created_at: Date
    type: string
    amount: number
  }>
): Array<{
  date: string
  cashIn: number
  cashOut: number
  balance: number
  dateObj: Date
}> {
  const dataMap: Record<
    string,
    {
      date: string
      cashIn: number
      cashOut: number
      balance: number
      dateObj: Date
    }
  > = {}

  let runningBalance = 0

  // Sort by date ascending
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  sorted.forEach((tx) => {
    const date = new Date(tx.created_at)
    const dateKey = date.toISOString().split('T')[0]

    if (!dataMap[dateKey]) {
      dataMap[dateKey] = {
        date: dateKey,
        cashIn: 0,
        cashOut: 0,
        balance: runningBalance,
        dateObj: date,
      }
    }

    if (tx.type === 'CASH_IN') {
      dataMap[dateKey].cashIn += tx.amount
      runningBalance += tx.amount
    } else {
      dataMap[dateKey].cashOut += tx.amount
      runningBalance -= tx.amount
    }

    dataMap[dateKey].balance = runningBalance
  })

  return Object.values(dataMap).sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())
}

/**
 * Export transactions to CSV format
 * @param transactions - Array of transactions to export
 * @returns CSV string
 */
export function exportToCSV(
  transactions: Array<{
    created_at: Date
    type: string
    category: string
    amount: number
    description: string
    notes?: string | null
    supplier?: { business_name: string } | null
  }>
): string {
  // CSV Headers
  const headers = [
    'Tanggal',
    'Waktu',
    'Tipe',
    'Kategori',
    'Jumlah',
    'Deskripsi',
    'Catatan',
    'Supplier',
  ]

  // CSV Rows
  const rows = transactions.map((tx) => {
    const date = new Date(tx.created_at)
    return [
      date.toLocaleDateString('id-ID'),
      date.toLocaleTimeString('id-ID'),
      tx.type,
      tx.category,
      tx.amount.toString(),
      `"${tx.description.replace(/"/g, '""')}"`, // Escape quotes
      tx.notes ? `"${tx.notes.replace(/"/g, '""')}"` : '',
      tx.supplier?.business_name || '',
    ]
  })

  // Combine headers and rows
  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')

  return csvContent
}

/**
 * Download CSV file
 * @param csvContent - CSV string content
 * @param filename - Name of the file to download
 */
export function downloadCSV(csvContent: string, filename: string): void {
  // Add BOM for Excel UTF-8 support
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Format date to Indonesian locale
 * @param date - Date to format
 * @param includeTime - Whether to include time
 * @returns Formatted date string
 *
 * @example
 * formatDate(new Date()) // "22 Oktober 2025"
 * formatDate(new Date(), true) // "22 Oktober 2025, 10:30"
 */
export function formatDate(date: Date, includeTime: boolean = false): string {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }

  if (includeTime) {
    options.hour = '2-digit'
    options.minute = '2-digit'
  }

  return new Intl.DateTimeFormat('id-ID', options).format(new Date(date))
}

/**
 * Format relative time (e.g., "2 hours ago")
 * @param date - Date to format
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) {
    return 'Baru saja'
  } else if (diffMin < 60) {
    return `${diffMin} menit lalu`
  } else if (diffHour < 24) {
    return `${diffHour} jam lalu`
  } else if (diffDay === 1) {
    return 'Kemarin'
  } else if (diffDay < 7) {
    return `${diffDay} hari lalu`
  } else {
    return formatDate(date)
  }
}

/**
 * Calculate percentage change
 * @param current - Current value
 * @param previous - Previous value
 * @returns Percentage change (e.g., "+12.5" or "-5.3")
 */
export function calculatePercentageChange(
  current: number,
  previous: number
): { value: string; isPositive: boolean } {
  if (previous === 0) {
    return {
      value: current > 0 ? '+100' : '0',
      isPositive: current > 0,
    }
  }

  const change = ((current - previous) / previous) * 100
  const formatted = change.toFixed(1)
  const isPositive = change >= 0

  return {
    value: isPositive ? `+${formatted}` : formatted,
    isPositive,
  }
}

/**
 * Get period date range
 * @param period - Period type
 * @param customStart - Custom start date (for 'custom' period)
 * @param customEnd - Custom end date (for 'custom' period)
 * @returns Start and end dates
 */
export function getPeriodDateRange(
  period: 'today' | 'week' | 'month' | 'custom',
  customStart?: Date,
  customEnd?: Date
): { start: Date; end: Date } {
  const now = new Date()

  switch (period) {
    case 'today':
      return {
        start: new Date(now.setHours(0, 0, 0, 0)),
        end: new Date(now.setHours(23, 59, 59, 999)),
      }
    case 'week':
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      weekAgo.setHours(0, 0, 0, 0)
      return {
        start: weekAgo,
        end: now,
      }
    case 'month':
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      monthAgo.setHours(0, 0, 0, 0)
      return {
        start: monthAgo,
        end: now,
      }
    case 'custom':
      if (customStart && customEnd) {
        return {
          start: new Date(customStart),
          end: new Date(customEnd),
        }
      }
      // Fallback to today if custom dates not provided
      return {
        start: new Date(now.setHours(0, 0, 0, 0)),
        end: new Date(now.setHours(23, 59, 59, 999)),
      }
    default:
      return {
        start: new Date(now.setHours(0, 0, 0, 0)),
        end: new Date(now.setHours(23, 59, 59, 999)),
      }
  }
}

/**
 * Get period label in Indonesian
 * @param period - Period type
 * @returns Indonesian period label
 */
export function getPeriodLabel(period: 'today' | 'week' | 'month' | 'custom'): string {
  const labels = {
    today: 'Hari Ini',
    week: '7 Hari Terakhir',
    month: '30 Hari Terakhir',
    custom: 'Periode Custom',
  }

  return labels[period]
}
