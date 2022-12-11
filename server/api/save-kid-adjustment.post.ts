import { addDollarAdjustmentToTotal } from '~/utils/adjustments'
import { log } from '~/utils/console'
import prisma from '~/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  log('API: get-kid-adjustments', body)

  // Get user from database
  async function runQuery () {
    // Get total from last adjustment
    let previousAdjustment = 0
    const previousAdjustmentData = await prisma.kid.findUnique({
      include: {
        adjustments: {
          orderBy: {
            id: 'desc'
          },
          take: 1
        }
      },
      where: {
        id: body.id
      }
    })
    if (previousAdjustmentData && (previousAdjustmentData?.adjustments?.[0] ?? false)) {
      previousAdjustment = previousAdjustmentData.adjustments[0].totalToDate
    }

    // Create new adjustment
    await prisma.kid.update({
      data: {
        adjustments: {
          create: {
            dollarAdjustment: body.dollarAdjustment,
            totalToDate: addDollarAdjustmentToTotal(body.dollarAdjustment, previousAdjustment)
          }
        }
      },
      where: {
        id: body.id
      }
    })

    return true
  }

  const response = runQuery()
    .then(async (response) => {
      await prisma.$disconnect()
      return response
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })

  return response
})
