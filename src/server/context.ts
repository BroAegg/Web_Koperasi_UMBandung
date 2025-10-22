import { prisma } from '../lib/db'

export async function createContext() {
  return {
    prisma,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
