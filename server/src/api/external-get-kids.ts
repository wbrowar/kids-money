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
export async function externalGetKids(req: Request, res: Response) {
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
    return {
      color: kid.color,
      currentTotal: kid.adjustments?.[0]?.totalToDate ?? 0,
      interest: kid.interest,
      interestThresholds: kid.interestThresholds ? kid.interestThresholds : undefined,
      savingFor: kid.savingFor ? kid.savingFor : undefined,
      savingForValue: kid.savingForValue,
    }
  })

  res.send(JSON.stringify(response))

  await prisma.$disconnect()
}
