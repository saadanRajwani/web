import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined
}

const prismaClient = global.prismaGlobal || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.prismaGlobal = prismaClient
}

export const prisma = prismaClient
export default prismaClient 