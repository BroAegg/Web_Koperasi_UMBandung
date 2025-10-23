import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { prisma } from '@/lib/db'
import { TRPCError } from '@trpc/server'

// Zod Schemas
const getProductsSchema = z.object({
  search: z.string().optional(),
  category_id: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
})

const cartItemSchema = z.object({
  product_id: z.string(),
  quantity: z.number().min(1),
  price: z.number().positive(),
})

const createOrderSchema = z.object({
  customer_name: z.string().optional(),
  items: z.array(cartItemSchema),
  payment_method: z.enum(['CASH', 'BANK_TRANSFER', 'E_WALLET', 'OTHER']),
  payment_amount: z.number().positive(),
  discount: z.number().min(0).default(0),
  tax: z.number().min(0).default(0),
})

const orderFilterSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED']).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
})

export const posRouter = router({
  // Get products for POS (with stock info)
  getProducts: protectedProcedure.input(getProductsSchema).query(async ({ input }) => {
    const { search, category_id, page, limit } = input

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      is_active: true,
      deleted_at: null,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (category_id) {
      where.category_id = category_id
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
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
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    }
  }),

  // Create order (checkout)
  createOrder: protectedProcedure.input(createOrderSchema).mutation(async ({ input, ctx }) => {
    const userId = ctx.user.userId

    // Validate items
    if (!input.items || input.items.length === 0) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Cart is empty. Please add items to cart.',
      })
    }

    // Check stock availability BEFORE creating order
    for (const item of input.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.product_id },
      })

      if (!product) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Product not found`,
        })
      }

      if (product.deleted_at) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Product "${product.name}" is no longer available`,
        })
      }

      if (!product.is_active) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Product "${product.name}" is not active`,
        })
      }

      if (product.stock < item.quantity) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`,
        })
      }
    }

    // Calculate totals
    let subtotal = 0
    for (const item of input.items) {
      subtotal += Number(item.price) * Number(item.quantity)
    }

    const total = subtotal - Number(input.discount) + Number(input.tax)
    const change = Number(input.payment_amount) - total

    if (change < 0) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Payment insufficient. Total: Rp ${total.toLocaleString('id-ID')}, Payment: Rp ${input.payment_amount.toLocaleString('id-ID')}`,
      })
    }

    // Generate order number
    const orderCount = await prisma.order.count()
    const orderNumber = `ORD-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(orderCount + 1).padStart(4, '0')}`

    // Create order with items in transaction
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const order = await prisma.$transaction(async (tx: any) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          order_number: orderNumber,
          customer_name: input.customer_name,
          subtotal,
          discount: input.discount,
          tax: input.tax,
          total,
          payment_method: input.payment_method,
          payment_amount: input.payment_amount,
          change_amount: change,
          status: 'COMPLETED',
          created_by: userId,
        },
      })

      // Create order items and update stock
      for (const item of input.items) {
        // Create order item
        await tx.orderItem.create({
          data: {
            order_id: newOrder.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity,
          },
        })

        // Update product stock
        const product = await tx.product.findUnique({
          where: { id: item.product_id },
        })

        if (!product) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `Product ${item.product_id} not found`,
          })
        }

        if (product.stock < item.quantity) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
          })
        }

        await tx.product.update({
          where: { id: item.product_id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })

        // Record stock movement
        await tx.stockMovement.create({
          data: {
            product_id: item.product_id,
            type: 'OUT',
            quantity: item.quantity,
            notes: `POS Sale - Order ${orderNumber}`,
            created_by: userId,
          },
        })
      }

      // Create financial transaction
      await tx.transaction.create({
        data: {
          type: 'CASH_IN',
          category: 'SALES',
          amount: total,
          payment_method: input.payment_method,
          description: `POS Sale - Order ${orderNumber}`,
          notes: input.customer_name ? `Customer: ${input.customer_name}` : 'Walk-in customer',
          reference_id: newOrder.id,
          created_by_id: userId,
        },
      })

      return newOrder
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        user_id: userId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        role: ctx.user.role as any,
        action: 'CREATE',
        module: 'POS',
        description: `Created order ${orderNumber} - Rp ${total.toLocaleString('id-ID')}`,
      },
    })

    // Fetch full order with items
    const fullOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
              },
            },
          },
        },
      },
    })

    return fullOrder
  }),

  // Get orders (sales history)
  getOrders: protectedProcedure.input(orderFilterSchema).query(async ({ input }) => {
    const { status, startDate, endDate, page, limit } = input

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (startDate || endDate) {
      where.created_at = {}
      if (startDate) where.created_at.gte = startDate
      if (endDate) where.created_at.lte = endDate
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                },
              },
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    }
  }),

  // Get single order (for receipt)
  getOrder: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const order = await prisma.order.findUnique({
      where: { id: input.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
              },
            },
          },
        },
      },
    })

    if (!order) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Order not found',
      })
    }

    return order
  }),

  // Get sales statistics
  getSalesStats: protectedProcedure
    .input(
      z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async ({ input }) => {
      const { startDate, endDate } = input

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const where: any = {
        status: 'COMPLETED',
      }

      if (startDate || endDate) {
        where.created_at = {}
        if (startDate) where.created_at.gte = startDate
        if (endDate) where.created_at.lte = endDate
      }

      const [totalRevenue, totalOrders] = await Promise.all([
        prisma.order.aggregate({
          where,
          _sum: {
            total: true,
          },
        }),
        prisma.order.count({ where }),
      ])

      const averageOrderValue =
        totalOrders > 0 ? Number(totalRevenue._sum.total || 0) / totalOrders : 0

      // Get top selling products
      const topProducts = await prisma.orderItem.groupBy({
        by: ['product_id'],
        _sum: {
          quantity: true,
          subtotal: true,
        },
        orderBy: {
          _sum: {
            quantity: 'desc',
          },
        },
        take: 5,
      })

      // Get top products with details
       
      const topProductsWithDetails = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        topProducts.map(async (item: any) => {
          const product = await prisma.product.findUnique({
            where: { id: item.product_id },
            select: {
              id: true,
              name: true,
              sku: true,
            },
          })
          return {
            ...product,
            totalQuantity: item._sum.quantity || 0,
            totalRevenue: Number(item._sum.subtotal) || 0,
          }
        })
      )

      return {
        totalRevenue: Number(totalRevenue._sum.total || 0),
        totalOrders,
        averageOrderValue,
        topProducts: topProductsWithDetails,
      }
    }),

  // Cancel order
  cancelOrder: protectedProcedure
    .input(z.object({ id: z.string(), reason: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      const { id, reason } = input

      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          items: true,
        },
      })

      if (!order) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Order not found',
        })
      }

      if (order.status === 'CANCELLED') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Order already cancelled',
        })
      }

      // Update order and restore stock
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await prisma.$transaction(async (tx: any) => {
        // Update order status
        await tx.order.update({
          where: { id },
          data: {
            status: 'CANCELLED',
          },
        })

        // Restore stock for each item
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.product_id },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          })

          // Record stock movement
          await tx.stockMovement.create({
            data: {
              product_id: item.product_id,
              type: 'IN',
              quantity: item.quantity,
              notes: `Order cancelled - ${order.order_number}${reason ? `: ${reason}` : ''}`,
              created_by: ctx.user.userId,
            },
          })
        }
      })

      // Log activity
      await prisma.activityLog.create({
        data: {
          user_id: ctx.user.userId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          role: ctx.user.role as any,
          action: 'UPDATE',
          module: 'POS',
          description: `Cancelled order ${order.order_number}${reason ? `: ${reason}` : ''}`,
        },
      })

      return { success: true }
    }),

  // Get best selling products
  getBestSellers: protectedProcedure
    .input(
      z.object({
        days: z.number().min(1).max(365).default(30),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ input }) => {
      const { days, limit } = input

      // Calculate start date
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      startDate.setHours(0, 0, 0, 0)

      // Get order items with product info
      const orderItems = await prisma.orderItem.findMany({
        where: {
          order: {
            status: 'COMPLETED',
            created_at: {
              gte: startDate,
            },
          },
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              selling_price: true,
              category: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      })

      // Aggregate sales by product
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const productSales = new Map<string, any>()

      orderItems.forEach((item) => {
        const productId = item.product_id
        if (!productSales.has(productId)) {
          productSales.set(productId, {
            product_id: productId,
            product_name: item.product.name,
            product_sku: item.product.sku,
            category_name: item.product.category?.name || 'Uncategorized',
            total_quantity: 0,
            total_revenue: 0,
          })
        }

        const current = productSales.get(productId)
        current.total_quantity += item.quantity
        current.total_revenue += Number(item.subtotal)
      })

      // Sort by total quantity and get top N
      const bestSellers = Array.from(productSales.values())
        .sort((a, b) => b.total_quantity - a.total_quantity)
        .slice(0, limit)

      return bestSellers
    }),
})
