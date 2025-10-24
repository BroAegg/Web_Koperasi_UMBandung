import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { prisma } from '@/lib/db'
import { TRPCError } from '@trpc/server'
import { Role } from '@prisma/client'

// Zod Schemas
const supplierFilterSchema = z.object({
  search: z.string().optional(),
  is_active: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
})

const createSupplierSchema = z.object({
  business_name: z.string().min(1),
  contact_person: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional(),
  address: z.string().optional(),
  is_active: z.boolean().default(true),
})

const updateSupplierSchema = z.object({
  id: z.string(),
  business_name: z.string().min(1).optional(),
  contact_person: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  is_active: z.boolean().optional(),
})

export const supplierRouter = router({
  // Get all suppliers with filters
  getSuppliers: protectedProcedure.input(supplierFilterSchema).query(async ({ input }) => {
    const { search, is_active, page, limit } = input

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      deleted_at: null,
    }

    if (search) {
      where.OR = [
        { business_name: { contains: search, mode: 'insensitive' } },
        { contact_person: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (is_active !== undefined) {
      where.is_active = is_active
    }

    const [suppliers, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.supplier.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      suppliers,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    }
  }),

  // Get single supplier
  getSupplier: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const supplier = await prisma.supplier.findUnique({
      where: { id: input.id, deleted_at: null },
      include: {
        products: {
          where: { deleted_at: null },
          select: {
            id: true,
            sku: true,
            name: true,
            stock: true,
            selling_price: true,
            is_active: true,
          },
        },
        _count: {
          select: {
            products: true,
            transactions: true,
          },
        },
      },
    })

    if (!supplier) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Supplier not found',
      })
    }

    return supplier
  }),

  // Create supplier
  createSupplier: protectedProcedure
    .input(createSupplierSchema)
    .mutation(async ({ input, ctx }) => {
      // Check if business name already exists
      const existing = await prisma.supplier.findFirst({
        where: {
          business_name: input.business_name,
          deleted_at: null,
        },
      })

      if (existing) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Supplier with this business name already exists',
        })
      }

      const supplier = await prisma.supplier.create({
        data: input,
      })

      // Log activity
      await prisma.activityLog.create({
        data: {
          user_id: ctx.user.userId,
          role: ctx.user.role as Role,
          action: 'CREATE',
          module: 'SUPPLIER',
          description: `Created supplier ${input.business_name}`,
        },
      })

      return supplier
    }),

  // Update supplier
  updateSupplier: protectedProcedure
    .input(updateSupplierSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input

      // Check if supplier exists
      const existing = await prisma.supplier.findUnique({
        where: { id, deleted_at: null },
      })

      if (!existing) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Supplier not found',
        })
      }

      // Check if business name already exists (if updating business name)
      if (data.business_name && data.business_name !== existing.business_name) {
        const duplicateName = await prisma.supplier.findFirst({
          where: {
            business_name: data.business_name,
            deleted_at: null,
            id: { not: id },
          },
        })

        if (duplicateName) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Supplier with this business name already exists',
          })
        }
      }

      const supplier = await prisma.supplier.update({
        where: { id },
        data: {
          ...data,
          updated_at: new Date(),
        },
      })

      // Log activity
      await prisma.activityLog.create({
        data: {
          user_id: ctx.user.userId,
          role: ctx.user.role as Role,
          action: 'UPDATE',
          module: 'SUPPLIER',
          description: `Updated supplier ${supplier.business_name}`,
        },
      })

      return supplier
    }),

  // Delete supplier (soft delete)
  deleteSupplier: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const supplier = await prisma.supplier.findUnique({
        where: { id: input.id, deleted_at: null },
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
      })

      if (!supplier) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Supplier not found',
        })
      }

      // Check if supplier has active products
      if (supplier._count.products > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Cannot delete supplier with existing products. Please reassign or delete products first.',
        })
      }

      await prisma.supplier.update({
        where: { id: input.id },
        data: {
          deleted_at: new Date(),
        },
      })

      // Log activity
      await prisma.activityLog.create({
        data: {
          user_id: ctx.user.userId,
          role: ctx.user.role as Role,
          action: 'DELETE',
          module: 'SUPPLIER',
          description: `Deleted supplier ${supplier.business_name}`,
        },
      })

      return { success: true }
    }),

  // Get supplier statistics
  getSupplierStats: protectedProcedure.query(async () => {
    const [totalSuppliers, activeSuppliers, totalProducts] = await Promise.all([
      prisma.supplier.count({
        where: { deleted_at: null },
      }),
      prisma.supplier.count({
        where: { deleted_at: null, is_active: true },
      }),
      prisma.product.count({
        where: { deleted_at: null },
      }),
    ])

    // Get top suppliers by product count
    const topSuppliers = await prisma.supplier.findMany({
      where: { deleted_at: null, is_active: true },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        products: {
          _count: 'desc',
        },
      },
      take: 5,
    })

    return {
      totalSuppliers,
      activeSuppliers,
      totalProducts,
      topSuppliers: topSuppliers.map(
        (s: {
          id: string
          business_name: string
          contact_person: string
          phone: string
          _count: { products: number }
        }) => ({
          id: s.id,
          business_name: s.business_name,
          contact_person: s.contact_person,
          phone: s.phone,
          productCount: s._count.products,
        })
      ),
    }
  }),
})
