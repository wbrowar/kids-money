import { Request, Response } from 'express'
import { prisma } from '@/utils/prisma.ts'
import { DbError, DbMessage } from '@/utils/db-response.ts'
import { Kid } from '@types'

/**
 * Creates a new kid when no ID is passed in.
 *
 * When an ID is passed in, it will update the existing kid, updating only the fields passed in.
 *
 * @param req The request object containing parameters to be passed in.
 * @param res The response object sent back to the client.
 */
export async function createUpdateKid(req: Request, res: Response) {
  console.log('createUpdateKid', req.body)

  let response
  let saved

  if (req.body.id > -1) {
    // If editing existing kid, get the existing record to update
    const newKid = {}
    const existingKid = await prisma.kid.findUnique({
      where: {
        id: req.body.id,
      },
    })
    if (existingKid) {
      Object.assign(newKid, existingKid)
      Object.assign(newKid, req.body)

      // Remove ID because it will not be updated
      delete (newKid as Partial<Kid>).id

      saved = await prisma.kid.update({
        data: newKid,
        where: {
          id: req.body.id,
        },
      })

      if (saved) {
        response = new DbMessage(`Kid created with name: ${(newKid as Kid).name}`)
      }
    } else {
      response = new DbError('Couldn’t find kid to edit')
    }
  } else {
    // Remove ID so a new one can be generated
    delete req.body.id

    // Add initial adjustment so they start with zero
    req.body.adjustments = {
      create: {
        dollarAdjustment: 0,
        totalToDate: 0,
      },
    }

    saved = await prisma.kid.create({
      data: req.body,
    })

    if (saved) {
      response = new DbMessage(`Kid created with name: ${req.body.name}`)
    }
  }

  res.send(JSON.stringify(response))

  await prisma.$disconnect()
}
