import { loadEnvFile } from 'node:process'
import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

loadEnvFile()

/*
 * Shared PrismaClient to be used in /server/api endpoints and /scripts node files.
 *
 * ```
 * const prisma = new PrismaClient()
 *
 * const kid = await prisma.kid.findUnique({
 *   where: {
 *     slug: args.kidSlug,
 *   },
 * })
 *
 * ```
 */

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL,
})

export const prisma = new PrismaClient({ adapter })
