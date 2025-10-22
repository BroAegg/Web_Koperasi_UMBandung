import { router } from './trpc'
import { healthRouter } from './routers/health'
import { productRouter } from './routers/product'
import { authRouter } from './routers/auth'
import { financialRouter } from './routers/financial'
import { posRouter } from './routers/pos'
import { inventoryRouter } from './routers/inventory'
import { supplierRouter } from './routers/supplier'
import { memberRouter } from './routers/member'

export const appRouter = router({
  health: healthRouter,
  product: productRouter,
  auth: authRouter,
  financial: financialRouter,
  pos: posRouter,
  inventory: inventoryRouter,
  supplier: supplierRouter,
  member: memberRouter,
})

export type AppRouter = typeof appRouter
