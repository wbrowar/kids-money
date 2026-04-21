import { Request, Response } from 'express'
import { prisma } from '@/utils/prisma.ts'
import { dollarAdjustmentFromInterestPercentage, interestFromInterestThresholds } from 'front-end/src/utils/adjustments'
import { DbMessage } from '@/utils/db-response.ts'

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
    let createParams = {}
    if (req.body.adjustmentType === 'dollar') {
      createParams = {
        dollarAdjustment: req.body.dollarAdjustment,
        reason: req.body.reason ?? '',
        totalToDate: req.body.dollarAdjustment + previousAdjustment,
      }
    } else if (req.body.adjustmentType === 'interest') {
      const interestPecentage = interestFromInterestThresholds(
        previousAdjustment,
        adjustmentKid.interest,
        JSON.parse(adjustmentKid.interestThresholds ?? '[]')
      )
      const calculatedDollarAdjustment = dollarAdjustmentFromInterestPercentage(interestPecentage, previousAdjustment)
      createParams = {
        dollarAdjustment: calculatedDollarAdjustment,
        percentAdjustment: interestPecentage,
        totalToDate: calculatedDollarAdjustment + previousAdjustment,
      }
    }

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
  }

  res.send(JSON.stringify(response))

  await prisma.$disconnect()
}
