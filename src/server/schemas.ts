/**
 * Common Zod validation schemas for tRPC procedures
 * Centralized schemas for consistency across all routers
 */

import { z } from 'zod'

/**
 * Pagination schemas
 */
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
})

export const cursorPaginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().positive().max(100).default(10),
})

/**
 * Date range schemas
 */
export const dateRangeSchema = z.object({
  startDate: z.string().or(z.date()).optional(),
  endDate: z.string().or(z.date()).optional(),
})

/**
 * Search schemas
 */
export const searchSchema = z.object({
  query: z.string().min(1).max(100),
})

export const advancedSearchSchema = z.object({
  query: z.string().optional(),
  filters: z.record(z.string(), z.any()).optional(),
  sort: z
    .object({
      field: z.string(),
      direction: z.enum(['asc', 'desc']),
    })
    .optional(),
})

/**
 * ID schemas
 */
export const idSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
})

export const optionalIdSchema = z.object({
  id: z.string().uuid().optional(),
})

/**
 * Financial schemas
 */
export const amountSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
})

export const transactionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required').max(500),
  category: z.enum(['PEMASUKAN', 'PENGELUARAN']),
  paymentMethod: z.enum(['CASH', 'TRANSFER', 'QRIS', 'EDC']),
})

/**
 * Product schemas
 */
export const productFilterSchema = z.object({
  categoryId: z.string().uuid().optional(),
  supplierId: z.string().uuid().optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().nonnegative().optional(),
  inStock: z.boolean().optional(),
})

export const productCreateSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200),
  description: z.string().max(1000).optional(),
  sku: z.string().min(1, 'SKU is required').max(50),
  category_id: z.string().uuid('Invalid category ID'),
  supplier_id: z.string().uuid('Invalid supplier ID'),
  purchase_price: z.number().nonnegative('Purchase price must be non-negative'),
  selling_price: z.number().positive('Selling price must be positive'),
  stock: z.number().int().nonnegative('Stock must be non-negative').default(0),
  unit: z.string().min(1, 'Unit is required').max(20),
  min_stock: z.number().int().nonnegative('Min stock must be non-negative').default(0),
})

export const productUpdateSchema = productCreateSchema.partial().extend({
  id: z.string().uuid('Invalid product ID'),
})

/**
 * Stock movement schemas
 */
export const stockMovementSchema = z.object({
  product_id: z.string().uuid('Invalid product ID'),
  type: z.enum(['IN', 'OUT', 'ADJUSTMENT']),
  quantity: z.number().int().positive('Quantity must be positive'),
  notes: z.string().max(500).optional(),
})

/**
 * Supplier schemas
 */
export const supplierCreateSchema = z.object({
  name: z.string().min(1, 'Supplier name is required').max(200),
  contact_person: z.string().min(1, 'Contact person is required').max(200),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(20),
  email: z.string().email('Invalid email format').optional(),
  address: z.string().max(500).optional(),
})

export const supplierUpdateSchema = supplierCreateSchema.partial().extend({
  id: z.string().uuid('Invalid supplier ID'),
})

/**
 * Member schemas
 */
export const memberCreateSchema = z.object({
  name: z.string().min(1, 'Member name is required').max(200),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(20),
  address: z.string().max(500).optional(),
  initial_deposit: z.number().nonnegative('Initial deposit must be non-negative').default(0),
})

export const memberUpdateSchema = memberCreateSchema.partial().extend({
  id: z.string().uuid('Invalid member ID'),
})

/**
 * User schemas
 */
export const userCreateSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  full_name: z.string().min(3, 'Full name must be at least 3 characters').max(200),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().max(20).optional(),
  role: z.enum(['ADMIN', 'KASIR', 'STAFF', 'SUPPLIER']),
})

export const userUpdateSchema = z.object({
  id: z.string().uuid('Invalid user ID'),
  username: z.string().min(3).max(50).optional(),
  full_name: z.string().min(3).max(200).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional(),
  role: z.enum(['DEVELOPER', 'SUPER_ADMIN', 'ADMIN', 'KASIR', 'STAFF', 'SUPPLIER']).optional(),
  is_active: z.boolean().optional(),
})

/**
 * Report schemas
 */
export const reportPeriodSchema = z.object({
  period: z.enum(['daily', 'weekly', 'monthly', 'yearly', 'custom']),
  startDate: z.string().or(z.date()).optional(),
  endDate: z.string().or(z.date()).optional(),
})

export const exportFormatSchema = z.object({
  format: z.enum(['csv', 'excel', 'pdf']),
})

/**
 * Activity log schemas
 */
export const activityFilterSchema = z.object({
  userId: z.string().uuid().optional(),
  role: z.enum(['DEVELOPER', 'SUPER_ADMIN', 'ADMIN', 'KASIR', 'STAFF', 'SUPPLIER']).optional(),
  module: z.string().optional(),
  action: z.string().optional(),
  startDate: z.string().or(z.date()).optional(),
  endDate: z.string().or(z.date()).optional(),
})
