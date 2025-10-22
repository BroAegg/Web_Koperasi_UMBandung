import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { prisma } from '@/lib/db'
import { TRPCError } from '@trpc/server'
import type { Prisma } from '@prisma/client'

// Zod Schemas
const productFilterSchema = z.object({
  search: z.string().optional(),
  category_id: z.string().optional(),
  supplier_id: z.string().optional(),
  is_active: z.boolean().optional(),
  low_stock: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
})

const createProductSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  category_id: z.string(),
  supplier_id: z.string(),
  purchase_price: z.number().positive(),
  selling_price: z.number().positive(),
  stock: z.number().min(0).default(0),
  min_stock: z.number().min(0).default(0),
  is_active: z.boolean().default(true),
})

const updateProductSchema = z.object({
  id: z.string(),
  sku: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  category_id: z.string().optional(),
  supplier_id: z.string().optional(),
  purchase_price: z.number().positive().optional(),
  selling_price: z.number().positive().optional(),
  stock: z.number().min(0).optional(),
  min_stock: z.number().min(0).optional(),
  is_active: z.boolean().optional(),
})

const stockMovementSchema = z.object({
  product_id: z.string(),
  type: z.enum(['IN', 'OUT', 'ADJUSTMENT']),
  quantity: z.number().positive(),
  notes: z.string().optional(),
})

const stockMovementFilterSchema = z.object({
  product_id: z.string().optional(),
  type: z.enum(['IN', 'OUT', 'ADJUSTMENT']).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
})

export const inventoryRouter = router({
  // Get all products with filters
  getProducts: protectedProcedure.input(productFilterSchema).query(async ({ input }) => {
    const { search, category_id, supplier_id, is_active, low_stock, page, limit } = input

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      deleted_at: null,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (category_id) {
      where.category_id = category_id
    }

    if (supplier_id) {
      where.supplier_id = supplier_id
    }

    if (is_active !== undefined) {
      where.is_active = is_active
    }

    if (low_stock) {
      where.stock = {
        lte: prisma.product.fields.min_stock,
      }
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
          supplier: {
            select: {
              id: true,
              business_name: true,
              contact_person: true,
              phone: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    // Calculate low stock count
    const lowStockCount = await prisma.product.count({
      where: {
        deleted_at: null,
        stock: {
          lte: prisma.product.fields.min_stock,
        },
      },
    })

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
      lowStockCount,
    }
  }),

  // Get single product
  getProduct: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const product = await prisma.product.findUnique({
      where: { id: input.id, deleted_at: null },
      include: {
        category: true,
        supplier: true,
      },
    })

    if (!product) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Product not found',
      })
    }

    return product
  }),

  // Create product
  createProduct: protectedProcedure.input(createProductSchema).mutation(async ({ input, ctx }) => {
    // Check if SKU already exists
    const existingSKU = await prisma.product.findFirst({
      where: {
        sku: input.sku,
        deleted_at: null,
      },
    })

    if (existingSKU) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'SKU already exists',
      })
    }

    const product = await prisma.product.create({
      data: {
        ...input,
        created_by: ctx.user.userId,
      },
      include: {
        category: true,
        supplier: true,
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        user_id: ctx.user.userId,
        role: ctx.user.role,
        action: 'CREATE',
        module: 'INVENTORY',
        description: `Created product ${input.name} (${input.sku})`,
      },
    })

    return product
  }),

  // Update product
  updateProduct: protectedProcedure.input(updateProductSchema).mutation(async ({ input, ctx }) => {
    const { id, ...data } = input

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id, deleted_at: null },
    })

    if (!existingProduct) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Product not found',
      })
    }

    // Check if SKU already exists (if updating SKU)
    if (data.sku && data.sku !== existingProduct.sku) {
      const existingSKU = await prisma.product.findFirst({
        where: {
          sku: data.sku,
          deleted_at: null,
          id: { not: id },
        },
      })

      if (existingSKU) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'SKU already exists',
        })
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
      include: {
        category: true,
        supplier: true,
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        user_id: ctx.user.userId,
        role: ctx.user.role,
        action: 'UPDATE',
        module: 'INVENTORY',
        description: `Updated product ${product.name} (${product.sku})`,
      },
    })

    return product
  }),

  // Delete product (soft delete)
  deleteProduct: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const product = await prisma.product.findUnique({
        where: { id: input.id, deleted_at: null },
      })

      if (!product) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Product not found',
        })
      }

      await prisma.product.update({
        where: { id: input.id },
        data: {
          deleted_at: new Date(),
        },
      })

      // Log activity
      await prisma.activityLog.create({
        data: {
          user_id: ctx.user.userId,
          role: ctx.user.role,
          action: 'DELETE',
          module: 'INVENTORY',
          description: `Deleted product ${product.name} (${product.sku})`,
        },
      })

      return { success: true }
    }),

  // Record stock movement
  recordStockMovement: protectedProcedure
    .input(stockMovementSchema)
    .mutation(async ({ input, ctx }) => {
      const { product_id, type, quantity, notes } = input

      const product = await prisma.product.findUnique({
        where: { id: product_id, deleted_at: null },
      })

      if (!product) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Product not found',
        })
      }

      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Create stock movement record
        await tx.stockMovement.create({
          data: {
            product_id,
            type,
            quantity,
            notes,
            created_by: ctx.user.userId,
          },
        })

        // Update product stock
        if (type === 'IN' || type === 'ADJUSTMENT') {
          await tx.product.update({
            where: { id: product_id },
            data: {
              stock: {
                increment: quantity,
              },
            },
          })
        } else if (type === 'OUT') {
          if (product.stock < quantity) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: `Insufficient stock. Available: ${product.stock}`,
            })
          }

          await tx.product.update({
            where: { id: product_id },
            data: {
              stock: {
                decrement: quantity,
              },
            },
          })
        }
      })

      // Log activity
      await prisma.activityLog.create({
        data: {
          user_id: ctx.user.userId,
          role: ctx.user.role,
          action: 'CREATE',
          module: 'INVENTORY',
          description: `Stock ${type} for ${product.name}: ${quantity} units`,
        },
      })

      return { success: true }
    }),

  // Get stock movements
  getStockMovements: protectedProcedure
    .input(stockMovementFilterSchema)
    .query(async ({ input }) => {
      const { product_id, type, startDate, endDate, page, limit } = input

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const where: any = {}

      if (product_id) {
        where.product_id = product_id
      }

      if (type) {
        where.type = type
      }

      if (startDate || endDate) {
        where.created_at = {}
        if (startDate) where.created_at.gte = startDate
        if (endDate) where.created_at.lte = endDate
      }

      const [movements, total] = await Promise.all([
        prisma.stockMovement.findMany({
          where,
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.stockMovement.count({ where }),
      ])

      const totalPages = Math.ceil(total / limit)

      return {
        movements,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasMore: page < totalPages,
        },
      }
    }),

  // Get low stock alerts
  getLowStockAlerts: protectedProcedure.query(async () => {
    const products = await prisma.product.findMany({
      where: {
        deleted_at: null,
        is_active: true,
        stock: {
          lte: prisma.product.fields.min_stock,
        },
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        supplier: {
          select: {
            id: true,
            business_name: true,
            phone: true,
          },
        },
      },
      orderBy: {
        stock: 'asc',
      },
    })

    return products
  }),

  // Get inventory statistics
  getInventoryStats: protectedProcedure.query(async () => {
    const [totalProducts, activeProducts, lowStockProducts, totalStockValue] = await Promise.all([
      prisma.product.count({
        where: { deleted_at: null },
      }),
      prisma.product.count({
        where: { deleted_at: null, is_active: true },
      }),
      prisma.product.count({
        where: {
          deleted_at: null,
          is_active: true,
          stock: {
            lte: prisma.product.fields.min_stock,
          },
        },
      }),
      prisma.product.aggregate({
        where: { deleted_at: null },
        _sum: {
          stock: true,
        },
      }),
    ])

    // Get total value (stock * purchase_price)
    const products = await prisma.product.findMany({
      where: { deleted_at: null },
      select: {
        stock: true,
        purchase_price: true,
      },
    })

    const inventoryValue = products.reduce(
      (sum: number, p: { stock: number; purchase_price: number }) =>
        sum + p.stock * Number(p.purchase_price),
      0
    )

    return {
      totalProducts,
      activeProducts,
      lowStockProducts,
      totalStock: totalStockValue._sum.stock || 0,
      inventoryValue,
    }
  }),

  // Get categories for filters
  getCategories: protectedProcedure.query(async () => {
    return await prisma.category.findMany({
      where: { deleted_at: null },
      orderBy: { name: 'asc' },
    })
  }),

  // Get suppliers for filters
  getSuppliers: protectedProcedure.query(async () => {
    return await prisma.supplier.findMany({
      where: { deleted_at: null, is_active: true },
      orderBy: { business_name: 'asc' },
    })
  }),
})
