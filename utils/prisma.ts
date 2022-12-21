import { PrismaClient } from '@prisma/client'

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
const prisma = new PrismaClient()

export default prisma
