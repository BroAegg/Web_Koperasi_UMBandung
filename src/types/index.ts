// Prisma types will be available after database setup
// export type { User, Supplier, Product, Category, Transaction, Order, OrderItem, ActivityLog } from '@prisma/client'

// Custom types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
