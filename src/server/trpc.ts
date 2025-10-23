import { initTRPC, TRPCError } from '@trpc/server'
import { type Context } from './context'
import superjson from 'superjson'
import { hasPermission } from '@/lib/permissions'
import type { Role } from '@prisma/client'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

export const router = t.router
export const publicProcedure = t.procedure

// Protected procedure - requires authentication
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    })
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // Now user is guaranteed to exist
    },
  })
})

// Admin procedure - requires ADMIN, SUPER_ADMIN, or DEVELOPER role
export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const allowedRoles: Role[] = ['ADMIN', 'SUPER_ADMIN', 'DEVELOPER']

  if (!allowedRoles.includes(ctx.user.role as Role)) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You do not have permission to access this resource',
    })
  }

  return next({ ctx })
})

// Super Admin procedure - requires SUPER_ADMIN or DEVELOPER role
export const superAdminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const allowedRoles: Role[] = ['SUPER_ADMIN', 'DEVELOPER']

  if (!allowedRoles.includes(ctx.user.role as Role)) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Only Super Admin can access this resource',
    })
  }

  return next({ ctx })
})

// Developer procedure - requires DEVELOPER role only
export const developerProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== 'DEVELOPER') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Only Developer can access this resource',
    })
  }

  return next({ ctx })
})

// Permission-based procedure factory
export function requirePermission(
  permission:
    | 'canAccessAll'
    | 'canManageUsers'
    | 'canManageRoles'
    | 'canViewLogs'
    | 'canManageFinancial'
    | 'canManageInventory'
    | 'canManagePOS'
    | 'canManageSuppliers'
    | 'canManageMembers'
    | 'canViewReports'
    | 'canExportData'
) {
  return protectedProcedure.use(async ({ ctx, next }) => {
    if (!hasPermission(ctx.user.role as Role, permission)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `You do not have permission: ${permission}`,
      })
    }

    return next({ ctx })
  })
}
