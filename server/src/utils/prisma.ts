import { loadEnvFile } from 'node:process'
import { PrismaClient } from '../../prisma/generated/client.ts'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { fileURLToPath } from 'node:url'

loadEnvFile(fileURLToPath(new URL('../../.env', import.meta.url)))

/**
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

const adapter = new PrismaBetterSqlite3(
  {
    url: process.env.DATABASE_URL,
  },
  { timestampFormat: 'unixepoch-ms' }
)

export const prisma = new PrismaClient({ adapter })
