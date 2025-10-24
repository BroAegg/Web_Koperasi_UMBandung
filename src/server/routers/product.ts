import { z } from 'zod'
import { router, publicProcedure } from '../trpc'

export const productRouter = router({
  // Get all products
  getAll: publicProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).default(10),
          skip: z.number().min(0).default(0),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 10
      const skip = input?.skip ?? 0

      const [products, total] = await Promise.all([
        ctx.prisma.product.findMany({
          take: limit,
          skip: skip,
          include: {
            category: true,
            supplier: true,
          },
          orderBy: {
            created_at: 'desc',
          },
        }),
        ctx.prisma.product.count(),
      ])

      return {
        products,
        pagination: {
          total,
          limit,
          skip,
          hasMore: skip + limit < total,
        },
      }
    }),

  // Get product by ID
  getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const product = await ctx.prisma.product.findUnique({
      where: { id: input.id },
      include: {
        category: true,
        supplier: true,
        stock_movements: {
          orderBy: { created_at: 'desc' },
          take: 10,
        },
      },
    })

    if (!product) {
      throw new Error('Product not found')
    }

    return product
  }),

  // Get low stock products
  getLowStock: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.prisma.product.findMany({
      where: {
        stock: {
          lte: ctx.prisma.product.fields.min_stock,
        },
        is_active: true,
      },
      include: {
        category: true,
        supplier: true,
      },
      orderBy: {
        stock: 'asc',
      },
    })

    return products
  }),

  // Get product statistics
  getStats: publicProcedure.query(async ({ ctx }) => {
    const [total, active, lowStock, categories] = await Promise.all([
      ctx.prisma.product.count(),
      ctx.prisma.product.count({ where: { is_active: true } }),
      ctx.prisma.product.count({
        where: {
          stock: {
            lte: ctx.prisma.product.fields.min_stock,
          },
        },
      }),
      ctx.prisma.category.count(),
    ])

    return {
      total,
      active,
      inactive: total - active,
      lowStock,
      categories,
    }
  }),
})
