/**
 * Product Router Integration Tests
 * Tests tRPC procedures with mocked Prisma client
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { productRouter } from './product'
import {
  createMockContext,
  createUnauthenticatedContext,
  mockProduct,
} from '../../../tests/helpers/trpc-mock'
import type { Context } from '../context'
import type { DeepMockProxy } from 'vitest-mock-extended'
import type { PrismaClient } from '@prisma/client'

describe('Product Router Integration Tests', () => {
  let ctx: Context & { prisma: DeepMockProxy<PrismaClient> }

  beforeEach(() => {
    ctx = createMockContext()
  })

  describe('getAll', () => {
    it('should return paginated products', async () => {
      const mockProducts = [
        mockProduct({ id: 'prod-1', name: 'Product 1' }),
        mockProduct({ id: 'prod-2', name: 'Product 2' }),
      ]

      ctx.prisma.product.findMany.mockResolvedValue(mockProducts as unknown as never)
      ctx.prisma.product.count.mockResolvedValue(2)

      const caller = productRouter.createCaller(ctx)
      const result = await caller.getAll({ limit: 10, skip: 0 })

      expect(result.products).toHaveLength(2)
      expect(result.pagination.total).toBe(2)
    })

    it('should work for public (unauthenticated) access', async () => {
      const unauthCtx = createUnauthenticatedContext()
      unauthCtx.prisma.product.findMany.mockResolvedValue([])
      unauthCtx.prisma.product.count.mockResolvedValue(0)

      const caller = productRouter.createCaller(unauthCtx)
      const result = await caller.getAll()

      expect(result.products).toHaveLength(0)
    })
  })

  describe('getById', () => {
    it('should return product with relations', async () => {
      const mockProductData = {
        ...mockProduct({ id: 'prod-1' }),
        category: { id: 'cat-1', name: 'Category' },
        supplier: {
          id: 'sup-1',
          business_name: 'Supplier',
          contact_person: 'John',
          phone: '123',
        },
        stock_movements: [],
      }

      ctx.prisma.product.findUnique.mockResolvedValue(mockProductData as unknown as never)

      const caller = productRouter.createCaller(ctx)
      const result = await caller.getById({ id: 'prod-1' })

      expect(result.id).toBe('prod-1')
      expect(result.category).toBeDefined()
      expect(result.supplier).toBeDefined()
    })

    it('should throw error for non-existent product', async () => {
      ctx.prisma.product.findUnique.mockResolvedValue(null)

      const caller = productRouter.createCaller(ctx)

      await expect(caller.getById({ id: 'non-existent' })).rejects.toThrow()
    })
  })

  describe('getStats', () => {
    it('should return product statistics', async () => {
      ctx.prisma.product.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(90) // active
        .mockResolvedValueOnce(5) // low stock
      ctx.prisma.category.count.mockResolvedValue(10)

      const caller = productRouter.createCaller(ctx)
      const result = await caller.getStats()

      expect(result).toHaveProperty('total')
      expect(result).toHaveProperty('active')
      expect(result.total).toBe(100)
      expect(result.active).toBe(90)
    })
  })
})
