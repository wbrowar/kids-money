import { Request, Response } from 'express'
import { prisma } from '@/utils/prisma.ts'

/**
 * Gets all settings and adjustments for all kids.
 *
 * When `includeAdjustments` is true, it will also get the adjustments for the last year.
 *
 * When `screenshotMode` is true, it will return a list of kids with fake names and photo URLs.
 *
 * @param {Request} req The request object containing parameters to be passed in.
 * @param {Response} res The response object sent back to the client.
 */
export async function externalGetKids(_req: Request, res: Response) {
  console.log('externalGetKids')

  let response = []

  const kidsData = await prisma.kid.findMany({
    include: {
      adjustments: {
        orderBy: {
          id: 'desc',
        },
        take: 1,
      },
    },
  })

  response = kidsData.map((kid) => {
    const currentTotal = kid.adjustments?.[0]?.totalToDate ?? 0
    let savingForPercentage = 0
    let savingForLevel = 1

    if (kid.savingFor && kid.savingForValue) {
      savingForPercentage = Math.round((currentTotal / (kid.savingForValue || 0)) * 100)
      if (savingForPercentage < 0) {
        savingForPercentage = 0
      }

      if (savingForPercentage > 70) {
        savingForLevel = 3
      } else if (savingForPercentage > 40) {
        savingForLevel = 2
      }
    }

    return {
      color: kid.color,
      currentTotal: `$` + currentTotal.toFixed(2),
      interest: kid.interest,
      interestThresholds: kid.interestThresholds ? kid.interestThresholds : undefined,
      savingFor: kid.savingFor ? kid.savingFor : undefined,
      savingForLevel,
      savingForPercentage,
      savingForValue: kid.savingForValue,
      savingForValueUsd: `$` + kid.savingForValue.toFixed(2),
    }
  })

  res.send(JSON.stringify(response))

  await prisma.$disconnect()
}
