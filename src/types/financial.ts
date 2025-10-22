/**
 * Financial Types & Schemas
 * TypeScript interfaces and Zod schemas for financial module
 */

import { z } from 'zod'

// ==========================================
// ENUMS
// ==========================================

export const TransactionType = z.enum(['CASH_IN', 'CASH_OUT', 'TRANSFER', 'ADJUSTMENT'])
export type TransactionType = z.infer<typeof TransactionType>

export const TransactionCategory = z.enum([
  'SALES',
  'PURCHASE',
  'OPERATIONAL',
  'MEMBER_DEPOSIT',
  'MEMBER_WITHDRAWAL',
  'OTHER',
])
export type TransactionCategory = z.infer<typeof TransactionCategory>

export const PaymentMethod = z.enum(['CASH', 'BANK_TRANSFER', 'E_WALLET', 'OTHER'])
export type PaymentMethod = z.infer<typeof PaymentMethod>

export const Period = z.enum(['today', 'week', 'month', 'custom'])
export type Period = z.infer<typeof Period>

// ==========================================
// TRANSACTION TYPES
// ==========================================

export interface Transaction {
  id: string
  type: TransactionType
  category: TransactionCategory
  amount: number
  payment_method: PaymentMethod
  description: string
  notes?: string | null
  supplier_id?: string | null
  reference_id?: string | null
  created_at: Date
  updated_at: Date
  deleted_at?: Date | null
  created_by_id: string
  supplier?: {
    id: string
    business_name: string
  } | null
  createdBy: {
    id: string
    full_name: string
    role: string
  }
}

// ==========================================
// ZOD SCHEMAS FOR VALIDATION
// ==========================================

export const createTransactionSchema = z.object({
  type: TransactionType,
  category: TransactionCategory,
  amount: z.number().positive('Amount must be positive'),
  payment_method: PaymentMethod.default('CASH'),
  description: z.string().min(1, 'Description is required').max(500),
  notes: z.string().max(1000).optional(),
  supplier_id: z.string().optional(),
  reference_id: z.string().optional(),
})

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>

export const updateTransactionSchema = z.object({
  id: z.string(),
  type: TransactionType.optional(),
  category: TransactionCategory.optional(),
  amount: z.number().positive().optional(),
  payment_method: PaymentMethod.optional(),
  description: z.string().min(1).max(500).optional(),
  notes: z.string().max(1000).nullable().optional(),
  supplier_id: z.string().nullable().optional(),
  reference_id: z.string().nullable().optional(),
})

export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>

export const periodFilterSchema = z.object({
  period: Period.default('today'),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
})

export type PeriodFilter = z.infer<typeof periodFilterSchema>

export const transactionFilterSchema = z
  .object({
    search: z.string().optional(),
    type: TransactionType.optional(),
    category: TransactionCategory.optional(),
    supplier_id: z.string().optional(),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
  })
  .merge(periodFilterSchema)

export type TransactionFilter = z.infer<typeof transactionFilterSchema>

// ==========================================
// SUMMARY TYPES
// ==========================================

export interface DailySummary {
  totalBalance: number
  tokoBalance: number
  titipanBalance: number
  cashIn: number
  cashOut: number
  netCashFlow: number
  transactionCount: number
  period: Period
  startDate: Date
  endDate?: Date
  status: 'surplus' | 'deficit'
}

// ==========================================
// CHART DATA TYPES
// ==========================================

export interface ChartDataPoint {
  date: string
  cashIn: number
  cashOut: number
  balance: number
}

export type ChartData = ChartDataPoint[]

// ==========================================
// PAGINATION TYPES
// ==========================================

export interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
  hasMore: boolean
}

export interface TransactionsResponse {
  transactions: Transaction[]
  pagination: Pagination
}

// ==========================================
// CATEGORY LABELS (for UI)
// ==========================================

export const TRANSACTION_CATEGORY_LABELS: Record<TransactionCategory, string> = {
  SALES: 'Penjualan',
  PURCHASE: 'Pembelian',
  OPERATIONAL: 'Operasional',
  MEMBER_DEPOSIT: 'Simpanan Anggota',
  MEMBER_WITHDRAWAL: 'Penarikan Anggota',
  OTHER: 'Lainnya',
}

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  CASH_IN: 'Pemasukan',
  CASH_OUT: 'Pengeluaran',
  TRANSFER: 'Transfer',
  ADJUSTMENT: 'Penyesuaian',
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CASH: 'Tunai',
  BANK_TRANSFER: 'Transfer Bank',
  E_WALLET: 'E-Wallet',
  OTHER: 'Lainnya',
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Get category label in Indonesian
 */
export function getCategoryLabel(category: TransactionCategory): string {
  return TRANSACTION_CATEGORY_LABELS[category] || category
}

/**
 * Get type label in Indonesian
 */
export function getTypeLabel(type: TransactionType): string {
  return TRANSACTION_TYPE_LABELS[type] || type
}

/**
 * Get payment method label in Indonesian
 */
export function getPaymentMethodLabel(method: PaymentMethod): string {
  return PAYMENT_METHOD_LABELS[method] || method
}

/**
 * Get badge variant for transaction type
 */
export function getTypeBadgeVariant(
  type: TransactionType
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (type) {
    case 'CASH_IN':
      return 'default' // Green
    case 'CASH_OUT':
      return 'destructive' // Red
    case 'TRANSFER':
      return 'secondary' // Blue
    case 'ADJUSTMENT':
      return 'outline' // Gray
    default:
      return 'outline'
  }
}

/**
 * Get badge variant for category
 */
export function getCategoryBadgeVariant(
  category: TransactionCategory
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (category) {
    case 'SALES':
      return 'default'
    case 'PURCHASE':
      return 'destructive'
    case 'OPERATIONAL':
      return 'secondary'
    case 'MEMBER_DEPOSIT':
    case 'MEMBER_WITHDRAWAL':
      return 'outline'
    default:
      return 'outline'
  }
}
