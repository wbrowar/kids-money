import { Request, Response } from 'express'
import { prisma } from '@/utils/prisma.ts'
import { dollarAdjustmentFromInterestPercentage, interestFromInterestThresholds } from '@/utils/adjustments.ts'
import { DbMessage } from '@/utils/db-response.ts'

/**
 * Creates a new adjustment for the specified kid.
 *
 * @param {Request} req The request object containing parameters to be passed in.
 * @param {Response} res The response object sent back to the client.
 */
export async function createAdjustment(req: Request, res: Response) {
  console.log('createAdjustment', req.body)

  let response

  const adjustmentKid = await prisma.kid.findUnique({
    include: {
      adjustments: {
        orderBy: {
          id: 'desc',
        },
        take: 1,
      },
    },
    where: {
      id: req.body.kidId,
    },
  })

  if (adjustmentKid) {
    // Get total from last adjustment
    const previousAdjustment = adjustmentKid.adjustments?.[0]?.totalToDate ?? 0

    // Create new adjustment
    let createParams: {
      dollarAdjustment?: number
      percentAdjustment?: number
      reason?: string
      totalToDate?: number
    } = {}
    if (req.body.adjustmentType === 'dollar') {
      createParams = {
        dollarAdjustment: req.body.dollarAdjustment,
        reason: req.body.reason ?? '',
        totalToDate: req.body.dollarAdjustment + previousAdjustment,
      }
    } else if (req.body.adjustmentType === 'interest') {
      const interestPercentage = interestFromInterestThresholds(
        previousAdjustment,
        adjustmentKid.interest,
        JSON.parse(adjustmentKid.interestThresholds ?? '[]')
      )
      const calculatedDollarAdjustment = dollarAdjustmentFromInterestPercentage(interestPercentage, previousAdjustment)
      createParams = {
        dollarAdjustment: calculatedDollarAdjustment,
        percentAdjustment: interestPercentage,
        totalToDate: calculatedDollarAdjustment + previousAdjustment,
      }
    }

    if (createParams.dollarAdjustment ?? 0 !== 0) {
      const saved = await prisma.kid.update({
        data: {
          adjustments: {
            // @ts-ignore
            create: createParams,
          },
        },
        where: {
          id: req.body.kidId,
        },
      })

      if (saved) {
        response = new DbMessage(`Adjustment created for kid: ${adjustmentKid.name}`)
      }
    } else {
      response = new DbMessage(`Dollar total equaled 0, so adjustment will be skipped for kid: ${adjustmentKid.name}`)
    }
  }

  res.send(JSON.stringify(response))

  await prisma.$disconnect()
}
