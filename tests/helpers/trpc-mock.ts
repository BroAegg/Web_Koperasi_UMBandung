/**
 * tRPC Testing Helpers
 * Mock context and utilities for integration testing
 */

import { type Context } from '@/server/context'
import { type PrismaClient, type Role } from '@prisma/client'
import { type DeepMockProxy, mockDeep } from 'vitest-mock-extended'

/**
 * Create mock tRPC context with authenticated user
 */
export function createMockContext({
  userId = 'test-user-id',
  username = 'testuser',
  email = 'test@example.com',
  fullName = 'Test User',
  role = 'ADMIN' as Role,
  isActive = true,
}: {
  userId?: string
  username?: string
  email?: string
  fullName?: string
  role?: Role
  isActive?: boolean
} = {}): Context & { prisma: DeepMockProxy<PrismaClient> } {
  return {
    user: {
      id: userId,
      username,
      email,
      fullName,
      role,
      isActive,
    },
    prisma: mockDeep<PrismaClient>(),
  }
}

/**
 * Create mock context for unauthenticated user
 */
export function createUnauthenticatedContext(): Context & {
  prisma: DeepMockProxy<PrismaClient>
} {
  return {
    user: null,
    prisma: mockDeep<PrismaClient>(),
  }
}

/**
 * Create mock context with specific role
 */
export function createContextWithRole(role: Role): Context & {
  prisma: DeepMockProxy<PrismaClient>
} {
  return createMockContext({ role })
}

/**
 * Mock product data generator
 */
export function mockProduct(overrides = {}) {
  return {
    id: 'prod-1',
    name: 'Test Product',
    sku: 'TEST-001',
    category_id: 'cat-1',
    supplier_id: 'sup-1',
    purchase_price: 10000,
    selling_price: 15000,
    stock: 100,
    min_stock: 10,
    unit: 'pcs',
    description: 'Test product description',
    is_active: true,
    created_at: new Date('2025-01-01'),
    updated_at: new Date('2025-01-01'),
    deleted_at: null,
    ...overrides,
  }
}

/**
 * Mock category data generator
 */
export function mockCategory(overrides = {}) {
  return {
    id: 'cat-1',
    name: 'Test Category',
    description: 'Test category description',
    created_at: new Date('2025-01-01'),
    updated_at: new Date('2025-01-01'),
    deleted_at: null,
    ...overrides,
  }
}

/**
 * Mock supplier data generator
 */
export function mockSupplier(overrides = {}) {
  return {
    id: 'sup-1',
    name: 'Test Supplier',
    contact_person: 'John Doe',
    phone: '08123456789',
    email: 'supplier@test.com',
    address: 'Test Address',
    is_active: true,
    created_at: new Date('2025-01-01'),
    updated_at: new Date('2025-01-01'),
    deleted_at: null,
    ...overrides,
  }
}

/**
 * Mock member data generator
 */
export function mockMember(overrides = {}) {
  return {
    id: 'mem-1',
    member_code: 'MEM-001',
    full_name: 'Test Member',
    email: 'member@test.com',
    phone: '08123456789',
    address: 'Test Address',
    join_date: new Date('2025-01-01'),
    is_active: true,
    created_at: new Date('2025-01-01'),
    updated_at: new Date('2025-01-01'),
    deleted_at: null,
    ...overrides,
  }
}

/**
 * Mock transaction data generator
 */
export function mockTransaction(overrides = {}) {
  return {
    id: 'trx-1',
    transaction_code: 'TRX-001',
    type: 'INCOME',
    category: 'SALES',
    amount: 50000,
    description: 'Test transaction',
    payment_method: 'CASH',
    reference_id: null,
    created_by: 'user-1',
    created_at: new Date('2025-01-01'),
    updated_at: new Date('2025-01-01'),
    deleted_at: null,
    ...overrides,
  }
}

/**
 * Mock order data generator
 */
export function mockOrder(overrides = {}) {
  return {
    id: 'order-1',
    order_code: 'ORD-001',
    member_id: 'mem-1',
    cashier_id: 'user-1',
    total_amount: 100000,
    payment_method: 'CASH',
    payment_amount: 100000,
    change_amount: 0,
    status: 'COMPLETED',
    notes: null,
    created_at: new Date('2025-01-01'),
    updated_at: new Date('2025-01-01'),
    deleted_at: null,
    ...overrides,
  }
}

/**
 * Mock activity log data generator
 */
export function mockActivityLog(overrides = {}) {
  return {
    id: 'log-1',
    module: 'INVENTORY',
    action: 'CREATE',
    description: 'Created product Test Product',
    user_id: 'user-1',
    username: 'testuser',
    role: 'ADMIN',
    ip_address: '127.0.0.1',
    user_agent: 'Test Agent',
    created_at: new Date('2025-01-01'),
    ...overrides,
  }
}
