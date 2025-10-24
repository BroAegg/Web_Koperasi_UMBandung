import { z } from 'zod'
import { router, publicProcedure } from '../trpc'

export const healthRouter = router({
  check: publicProcedure.query(() => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'API is running',
    }
  }),

  echo: publicProcedure.input(z.object({ message: z.string() })).query(({ input }) => {
    return {
      echo: input.message,
      timestamp: new Date().toISOString(),
    }
  }),
})
