import { Request, Response } from 'express'
import { prisma } from '@/utils/prisma.ts'
import { Kid } from '@types'

export async function getKids(req: Request, res: Response) {
  console.log('getKids', 'includeAdjustments', req.body.includeAdjustments, 'screenshotMode', req.body.screenshotMode)

  let response: Kid[] = []

  const oneYearAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 1))

  let kids

  if (req.body?.includeAdjustments) {
    kids = await prisma.kid.findMany({
      include: {
        adjustments: {
          orderBy: {
            id: 'desc',
          },
          where: {
            createdDate: {
              gte: oneYearAgo,
            },
          },
        },
      },
    })
  } else {
    kids = await prisma.kid.findMany()
  }
  if (kids.length) {
    if (req.body?.screenshotMode) {
      kids = kids.map((kid: Kid, index: number) => {
        kid.name = `Kid ${index + 1}`
        kid.photoUrl = `https://i.pravatar.cc/30${index}`
        return kid
      })
    }
    response = kids
  }

  res.send(JSON.stringify(response))

  await prisma.$disconnect()
}
